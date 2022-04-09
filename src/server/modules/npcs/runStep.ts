import { Players } from "@rbxts/services";
import { Store } from "shared/rodux";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { NpcCharacter } from "./isNpcCharacter";
import { NpcInstance, NpcWorldState } from "./worldState";

// distance units for following a player
const NPC_FOLLOW_DISTANCE = 10;
// how far the npc will travel around spawn
const NPC_SPAWN_SURROUNDING = 15;
// distance to attack a player
const NPC_ATTACK_DISTANCE = 2;
// cooldown between attacks the NPC performs
const NPC_ATTACK_COOLDOWN = 2;
// min and max times for an NPC to wait between wanders
const NPC_WANDER_COOLDOWN_MIN = 7;
const NPC_WANDER_COOLDOWN_MAX = 15;

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
			throw `Player ${player.Name} attempted to attack ${character.Name}, but the NPC was dead`;
		}

		// apply weapon damage to npc
		const weapon = getWeaponInfo(store.getState().currentWeapon);
		npc.npc.health -= weapon.damage;
	}

	// move & attack npcs
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

		if (!closestPlayer) {
			continue;
		}

		const wanderingDistance = npc.instance.Head.Position.sub(npc.spawn.floor.Position).Magnitude;
		// move to closest player if they are close enough
		if (
			closestDistance < NPC_FOLLOW_DISTANCE &&
			wanderingDistance < npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING
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
		} else if (wanderingDistance > npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING) {
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

			if (returnState.nextWanderTime <= time) {
				npc.instance.Humanoid.MoveTo(
					new Vector3(
						random.NextInteger(npc.spawn.min.X, npc.spawn.max.X),
						npc.spawn.min.Y,
						random.NextInteger(npc.spawn.min.Z, npc.spawn.max.Z),
					),
				);

				returnState.nextWanderTime = time + random.NextInteger(NPC_WANDER_COOLDOWN_MIN, NPC_WANDER_COOLDOWN_MAX);
			}
		}
	}
}
