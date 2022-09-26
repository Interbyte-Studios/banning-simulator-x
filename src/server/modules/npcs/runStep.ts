import { Players } from "@rbxts/services";
import { stores } from "server/playerStore";
import { WORLDS } from "shared/configs/worlds";
import { Store } from "shared/rodux";
import { killNpc } from "shared/rodux/currencies";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { getWeaponLevel } from "shared/util/getWeaponLevel";

import { getNpcCharacter } from "./getNpcCharacter";
import { getNpcFolder } from "./getNpcFolder";
import { getRandomCFrame } from "./getRandomCFrame";
import { NpcCharacter } from "./isNpcCharacter";
import { NpcInstance, NpcWorldState } from "./worldState";

// distance units for following a player
const NPC_FOLLOW_DISTANCE = 20;
// how far the npc will travel around spawn
const NPC_SPAWN_SURROUNDING = 25;
// distance to attack a player
const NPC_ATTACK_DISTANCE = 2;
// cooldown between attacks the NPC performs
const NPC_ATTACK_COOLDOWN = 2;
// min and max times for an NPC to wait between wanders
const NPC_WANDER_COOLDOWN_MIN = 7;
const NPC_WANDER_COOLDOWN_MAX = 15;
// amount of NPCs in a zone
const ZONE_NPC_AMOUNT = 4;

const random = new Random();

/**
 * Runs a simulation step for NPCs.
 *
 * @param state The current state of the game for the NPCs.
 * @param npcAttacks An array of players that are hitting an npc.
 * @param time The current time of the game.
 */
export function runStep(
	state: Array<NpcWorldState>,
	npcAttacks: Array<{ player: Player; store: Store; character: NpcCharacter }>,
	time: number,
): void {
	// get npcs
	const npcs: Set<NpcInstance> = new Set();
	const npcCharacterToNpc: Map<NpcCharacter, NpcInstance> = new Map();
	for (const world of state) {
		for (const zone of world.zones) {
			// spawn any npcs that need spawning
			if (zone.npcs.size() < ZONE_NPC_AMOUNT) {
				const zoneInfo = WORLDS[world.name].zones[zone.name];
				assert(zoneInfo, `Failed to find zone "${zone.name}" in world "${world.name}"`);

				// if it's a boss zone, use the boss npc, otherwise, randomly choose an npc
				const selectedNpc =
					zoneInfo.npcs.find((npc) => npc.isBoss) ?? zoneInfo.npcs[random.NextInteger(0, zoneInfo.npcs.size() - 1)];

				// spawn npc which will immediately start wandering
				const npcCharacter = getNpcCharacter(selectedNpc.name).Clone();
				npcCharacter.PivotTo(getRandomCFrame(zone.spawn.min, zone.spawn.max, random));
				npcCharacter.Parent = getNpcFolder();

				zone.npcs.push({
					npc: selectedNpc,
					instance: npcCharacter,
					spawn: zone.spawn,
					state: {
						state: "WANDERING",
						nextWanderTime: 0,
					},
					world,
				});
			}

			for (const npc of zone.npcs) {
				npcs.add(npc);
				npcCharacterToNpc.set(npc.instance, npc);
			}
		}
	}

	// check for attacks
	for (const { player, store, character } of npcAttacks) {
		const npc = npcCharacterToNpc.get(character);
		if (npc === undefined) {
			throw `Player ${player.Name} attempted to attack ${character.Name}, but it didn't exist`;
		}

		// check that npc is alive
		if (!(npc.npc.health > 0)) {
			// currently this is possible if two players kill and NPC in the same tick
			throw `Player ${player.Name} attempted to attack ${character.Name}, but the NPC was dead`;
		}

		// apply weapon damage to npc
		const storeState = store.getState();

		const currentWeaponData = storeState.weapons.get(storeState.currentWeapon.id);
		if (currentWeaponData === undefined) {
			throw `Player ${player.Name} does not own the weapon they're attacking with.`;
		}

		const weapon = getWeaponInfo(storeState.currentWeapon.id);
		const weaponLevelBonus = getWeaponLevel(currentWeaponData.bans);
		npc.npc.health -= weapon.data.damage + weapon.data.damage * 0.25 * weaponLevelBonus.level;

		// check if npc is dead
		if (npc.npc.health <= 0) {
			// reward player
			const store = stores.get(player);
			assert(store, `Could not get store for "${player.GetFullName()}" when rewarding them for killing NPC`);

			const { reward } = npc.npc;

			store.dispatch(
				killNpc(
					reward.currency,
					WORLDS[npc.world.name].reward,
					reward.experience,
					storeState.currentWeapon.id,
					storeState.currentTalisman,
				),
			);

			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
		}
	}

	// move & wander & attack players
	for (const npc of npcs) {
		// get closest character
		let closestDistance = math.huge;
		let closestPlayer;
		for (const player of Players.GetPlayers()) {
			const distance = player.DistanceFromCharacter(npc.instance.Head.Position);

			if (distance !== 0 && distance < closestDistance) {
				closestDistance = distance;
				closestPlayer = player;
			}
		}

		const wanderingDistance = npc.instance.Head.Position.sub(npc.spawn.floor.Position).Magnitude;
		// move to closest player if they are close enough and exist
		if (
			closestPlayer &&
			closestDistance < NPC_FOLLOW_DISTANCE &&
			wanderingDistance < npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING &&
			// check that npc would not walk to the player outside the region
			closestPlayer.DistanceFromCharacter(npc.spawn.floor.Position) < npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING
		) {
			const closestCharacter = closestPlayer.Character?.FindFirstChildWhichIsA("Humanoid");
			if (!(closestCharacter && closestCharacter.RootPart)) {
				continue;
			}

			npc.instance.Humanoid.MoveTo(closestCharacter.RootPart.Position);

			// change to following state if not already
			let followingState = {
				state: "FOLLOWING" as const,
				lastAttackTime: 0,
			};
			if (npc.state.state !== "FOLLOWING") {
				npc.state = followingState;
			} else {
				followingState = npc.state;
			}

			// attack player if they are close enough
			if (closestDistance < NPC_ATTACK_DISTANCE) {
				if (followingState.lastAttackTime + NPC_ATTACK_COOLDOWN < time) {
					// perform attack
					closestCharacter.TakeDamage(npc.npc.damage);
					followingState.lastAttackTime = time;
				}
			}
		} else if (
			// check if npc has walked outside of wandering zone
			wanderingDistance > npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING ||
			// check if npc needs to re-wander
			(npc.state.state === "WANDERING" && time >= npc.state.nextWanderTime) ||
			// check if npc has walked outside follow distance
			(closestDistance > NPC_FOLLOW_DISTANCE && npc.state.state === "FOLLOWING")
		) {
			// return back to a random spawn
			let returnState = {
				state: "WANDERING" as const,
				nextWanderTime: time,
			};
			if (npc.state.state !== "WANDERING") {
				npc.state = returnState;
			} else {
				returnState = npc.state;
			}

			npc.instance.Humanoid.MoveTo(getRandomCFrame(npc.spawn.min, npc.spawn.max, random).Position);

			returnState.nextWanderTime = time + random.NextInteger(NPC_WANDER_COOLDOWN_MIN, NPC_WANDER_COOLDOWN_MAX);
		}
	}
}
