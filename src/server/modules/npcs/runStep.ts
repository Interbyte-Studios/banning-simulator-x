import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { stores } from "server/playerStore";
import { WORLDS } from "shared/configs/worlds";
import { NpcCharacter } from "shared/remotes/damageNPC";
import { Store } from "shared/rodux";
import { killNpc } from "shared/rodux/currencies";
import { getTalismanStatEffect } from "shared/util/getTalismanDamage";
import { getWeaponDamage } from "shared/util/getWeaponDamage";

import { getNpcCharacter } from "./getNpcCharacter";
import { getNpcFolder } from "./getNpcFolder";
import { getRandomCFrame } from "./getRandomCFrame";
import { NpcInstance, NpcWorldState } from "./worldState";

// how far the npc will travel around spawn
const NPC_SPAWN_SURROUNDING = 25;
// min and max times for an NPC to wait between wanders
const NPC_WANDER_COOLDOWN_MIN = 7;
const NPC_WANDER_COOLDOWN_MAX = 15;
// amount of NPCs in a zone
const ZONE_NPC_AMOUNT = 8;
const ZONE_NPC_BOSS_AMOUNT = 2;

/*
// distance units for following a player
const NPC_FOLLOW_DISTANCE = 20;
// distance to attack a player
const NPC_ATTACK_DISTANCE = 2;
// cooldown between attacks the NPC performs
const NPC_ATTACK_COOLDOWN = 2;
*/

const random = new Random();

const emitters = ReplicatedStorage.assetObjects.emitters;

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

				const amountOfBosses = zone.npcs.filter((npc) => npc.npc.isBoss === true).size();

				// if it's a boss zone, use the boss npc, otherwise, randomly choose an npc
				const selectedNpc =
					amountOfBosses < ZONE_NPC_BOSS_AMOUNT
						? zoneInfo.npcs.find((npc) => npc.isBoss)
						: zoneInfo.npcs.find((npc) => !npc.isBoss);

				if (selectedNpc === undefined) {
					warn(`Failed to spawn npc for zone ${zone.name}`);
					continue;
				}

				// spawn npc which will immediately start wandering
				const npcCharacter = getNpcCharacter(selectedNpc.name).Clone();
				npcCharacter.Humanoid.MaxHealth = selectedNpc.health;
				npcCharacter.Humanoid.Health = selectedNpc.health;
				npcCharacter.PivotTo(getRandomCFrame(zone.spawn.min, zone.spawn.max, random));
				npcCharacter.Parent = getNpcFolder();

				const impactEmitter = emitters["impact emitters"].Impact.Clone();
				const attachment = impactEmitter.FindFirstChildOfClass("Attachment");
				assert(attachment, `Failed to get attachment for impact emitter.`);
				attachment.Parent = npcCharacter.Humanoid.RootPart;
				attachment.Name = "ImpactEmitter";
				impactEmitter.Destroy();

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
			warn(`Player ${player.Name} attempted to attack ${character.Name}, but it didn't exist`);
			continue;
		}

		// check that npc is alive
		if (!(npc.instance.Humanoid.Health > 0)) {
			// currently this is possible if two players kill and NPC in the same tick
			warn(`Player ${player.Name} attempted to attack ${character.Name}, but the NPC was dead`);
			continue;
		}

		// check that npc has a root part
		const humanoidRootPart = npc.instance.Humanoid.RootPart;
		if (humanoidRootPart === undefined) {
			warn(`Failed to get HumanoidRootPart for npc ${npc.instance.Name}`);
			continue;
		}

		// apply weapon damage to npc
		const storeState = store.getState();

		const currentWeaponData = storeState.weapons.find((weapon) => weapon.id === storeState.currentWeapon.id);
		if (currentWeaponData === undefined) {
			warn(`Player ${player.Name} does not own the weapon they're attacking with.`);
			continue;
		}

		const weaponDamage = getWeaponDamage(currentWeaponData);
		const talismanStatEffects = getTalismanStatEffect(
			storeState.currentTalisman,
			storeState.talismans.find((talisman) => talisman.id === storeState.currentTalisman)?.phase,
		);

		const damageAmount = weaponDamage + talismanStatEffects.damage;

		npc.instance.Humanoid.TakeDamage(damageAmount);

		// check if npc is dead
		if (npc.instance.Humanoid.Health <= 0) {
			// reward player
			const store = stores.get(player);
			if (store === undefined) {
				warn(`Could not get store for "${player.GetFullName()}" when rewarding them for killing NPC`);
				continue;
			}

			const { reward } = npc.npc;

			// get currency multiplier
			const currencyBoosters: Array<number> = [];
			currencyBoosters.push(
				ReplicatedStorage.events.currency.enabled.Value
					? ReplicatedStorage.events.currency.multiplier.Value > 1
						? ReplicatedStorage.events.currency.multiplier.Value
						: 0
					: 0,
				store.getState().boosts.active["x2 Currency"] > 0 ? 2 : 0,
			);

			let currencyMultiplier = 0;
			currencyBoosters.forEach((booster) => {
				currencyMultiplier += booster;
			});
			currencyMultiplier = currencyMultiplier > 1 ? currencyMultiplier : 1;

			// get experience multiplier
			const experienceBoosters: Array<number> = [];
			experienceBoosters.push(
				ReplicatedStorage.events.experience.enabled.Value
					? ReplicatedStorage.events.experience.multiplier.Value > 1
						? ReplicatedStorage.events.experience.multiplier.Value
						: 0
					: 0,
				store.getState().boosts.active["x2 Rank Experience"] > 0 ? 2 : 0,
			);

			let experienceMultiplier = talismanStatEffects.experience;
			experienceBoosters.forEach((booster) => {
				experienceMultiplier += booster;
			});

			// apply reward
			store.dispatch(
				killNpc(
					reward.currency * currencyMultiplier,
					WORLDS[npc.world.name].reward,
					reward.experience * experienceMultiplier,
					storeState.currentWeapon.id,
					storeState.currentTalisman,
				),
			);

			// display ban emitter
			const banEmitters =
				weaponDamage >= npc.instance.Humanoid.MaxHealth ? emitters["crit ban emitters"] : emitters["ban emitters"];

			const randomBanEmitterIndex = math.ceil(math.random(1, banEmitters.GetChildren().size())) - 1;
			const randomBanEmitter = banEmitters.GetChildren()[randomBanEmitterIndex] as BasePart;
			if (randomBanEmitter === undefined) {
				warn(`Failed to get ban emitter for index ${randomBanEmitterIndex}`);
				continue;
			}

			const banEmitter = randomBanEmitter.Clone();
			banEmitter.CFrame = humanoidRootPart.CFrame;
			banEmitter.Parent = Workspace;

			const impactEmitter = humanoidRootPart.FindFirstChild("ImpactEmitter") as Attachment;
			if (impactEmitter !== undefined) {
				impactEmitter.Parent = banEmitter;

				for (const particleEmitter of impactEmitter.GetChildren()) {
					if (!particleEmitter.IsA("ParticleEmitter")) {
						continue;
					}

					particleEmitter.Emit(1);
					task.delay(particleEmitter.Lifetime.Max, () => {
						particleEmitter.Clear();
					});
				}
			}

			const emitter = banEmitter.FindFirstChild("Attachment")?.FindFirstChild("Banned") as ParticleEmitter;
			if (emitter !== undefined) {
				emitter.Emit(1);
			} else warn("emitter is undefined");

			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(character);

			task.delay(emitter.Lifetime.Max, () => {
				emitter.Clear();
				banEmitter.Destroy();
			});
		} else {
			const emitter = humanoidRootPart.FindFirstChild("ImpactEmitter") as Attachment;
			if (emitter === undefined) {
				warn(`Failed to get impact emitter for npc ${npc.instance.Name}`);
				continue;
			}

			for (const particleEmitter of emitter.GetChildren()) {
				if (!particleEmitter.IsA("ParticleEmitter")) {
					continue;
				}

				particleEmitter.Emit(1);
				task.delay(particleEmitter.Lifetime.Max, () => {
					particleEmitter.Clear();
				});
			}
		}
	}

	// move & wander & attack players
	for (const npc of npcs) {
		const wanderingDistance = npc.instance.Head.Position.sub(npc.spawn.floor.Position).Magnitude;

		if (
			// check if npc has walked outside of wandering zone
			wanderingDistance > npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING ||
			// check if npc needs to re-wander
			(npc.state.state === "WANDERING" && time >= npc.state.nextWanderTime)
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

		/*
		// move to closest player if they are close enough and exist
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

		*/
	}
}
