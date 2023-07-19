import { ReplicatedStorage } from "@rbxts/services";
import { playerStores } from "server/playerStore";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { WORLDS } from "shared/configs/worlds";
import { NpcCharacter } from "shared/remotes/damageNPC";
import { Store } from "shared/rodux";
import { killNpc } from "shared/rodux/currencies";
import { getBanningMastery } from "shared/util/getBanningMastery";
import { getPetExperienceMastery } from "shared/util/getPetExperienceMastery";
import { getPetStrength } from "shared/util/getPetStrength";
import { getTalismanStatEffect } from "shared/util/getTalismanDamage";
import { getWeaponDamage } from "shared/util/getWeaponDamage";

import { getNpcCharacter } from "./getNpcCharacter";
import { getNpcFolder } from "./getNpcFolder";
import { getRandomCFrame } from "./getRandomCFrame";
import { NpcInstance, NpcWorldState } from "./worldState";

// how far the npc will travel around spawn
const NPC_SPAWN_SURROUNDING = 15;
// min and max times for an NPC to wait between wanders
const NPC_WANDER_COOLDOWN_MIN = 7;
const NPC_WANDER_COOLDOWN_MAX = 15;
// amount of NPCs in a zone
const ZONE_NPC_AMOUNT = 11;
const ZONE_NPC_BOSS_AMOUNT = 3;

/*
// distance units for following a player
const NPC_FOLLOW_DISTANCE = 20;
// distance to attack a player
const NPC_ATTACK_DISTANCE = 2;
// cooldown between attacks the NPC performs
const NPC_ATTACK_COOLDOWN = 2;
*/

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

				const amountOfBosses = zone.npcs.filter((npc) => npc.npc.isBoss === true).size();

				// if it's a boss zone, use the boss npc, otherwise, randomly choose an npc
				const selectedNpc =
					amountOfBosses < ZONE_NPC_BOSS_AMOUNT
						? zoneInfo.npcs.find((npc) => npc.isBoss)
						: zoneInfo.npcs.find((npc) => !npc.isBoss);

				if (selectedNpc === undefined) {
					warn(`[NPC RunStep] - Failed to spawn npc for zone ${zone.name}`);
					continue;
				}

				// spawn npc which will immediately start wandering
				const npcCharacter = getNpcCharacter(selectedNpc.name).Clone();
				npcCharacter.Humanoid.MaxHealth = selectedNpc.health;
				npcCharacter.Humanoid.Health = selectedNpc.health;
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
			continue;
		}

		// check that npc is alive
		if (!(npc.instance.Humanoid.Health > 0)) {
			// currently this is possible if two players kill and NPC in the same tick
			continue;
		}

		// check that npc has a root part
		const humanoidRootPart = npc.instance.Humanoid.RootPart;
		if (humanoidRootPart === undefined) {
			continue;
		}

		const playerCharacter = player.Character;
		if (playerCharacter === undefined) {
			continue;
		}

		const playerHumanoid = character.FindFirstChildOfClass("Humanoid");
		if (playerHumanoid === undefined) {
			continue;
		}

		const playerRootPart = playerHumanoid.RootPart;
		if (playerRootPart === undefined) {
			continue;
		}

		// check distance between player and npc
		if (playerRootPart.Position.sub(humanoidRootPart.Position).Magnitude > 8) {
			continue;
		}

		// apply weapon damage to npc
		const storeState = store.getState();

		const currentWeaponData = storeState.weapons.find((weapon) => weapon.id === storeState.currentWeapon.id);
		if (currentWeaponData === undefined) {
			warn(`[NPC RunStep] - Player ${player.Name} does not own the weapon they're attacking with.`);
			continue;
		}

		if (storeState.currentTalisman !== undefined) {
			const currentTalismanData = storeState.talismans.find((talisman) => talisman.id === storeState.currentTalisman);
			if (currentTalismanData === undefined) {
				warn(
					`[NPC RunStep] - Player ${player.Name} does not own the talisman they're attacking with. | Current Talisman ID: ${storeState.currentTalisman}}`,
				);
				continue;
			}
		}

		const weaponDamage = getWeaponDamage(currentWeaponData);
		const talismanStatEffects = getTalismanStatEffect(
			storeState.currentTalisman,
			storeState.talismans.find((talisman) => talisman.id === storeState.currentTalisman)?.phase,
		);

		const equippedPets = store.getState().pets.filter((pet) => pet.equipped);
		let petDamageBonus = 0;
		let petBansBonus = 0;
		for (const pet of equippedPets) {
			const petStrength = getPetStrength(pet);
			petDamageBonus += petStrength.petDamage;
			petBansBonus += petStrength.petBans;
		}

		const damageAmount = weaponDamage + talismanStatEffects.damage + petDamageBonus;
		npc.instance.Humanoid.TakeDamage(damageAmount);

		// check if npc is dead
		if (npc.instance.Humanoid.Health <= 0) {
			// reward player
			const store = playerStores.get(player);
			if (store === undefined) {
				warn(`[NPC RunStep] - Could not get store for "${player.GetFullName()}" when rewarding them for killing NPC`);
				continue;
			}

			const { reward } = npc.npc;
			petBansBonus += reward.bans;

			// get currency multiplier
			const currencyBoosters: Array<number> = [];
			const globalCurrencyEventMultiplier = ReplicatedStorage.events.currency.enabled.Value
				? ReplicatedStorage.events.currency.multiplier.Value > 1
					? ReplicatedStorage.events.currency.multiplier.Value
					: 0
				: 0;
			const boostCurrencyMultiplier = store.getState().boosts.active["x2 Currency"] > 0 ? 2 : 0;
			const gamepassCurrencyMultiplier = store.getState().gamepasses["x2 Currency"] ? 2 : 0;
			const masteryCurrencyMultiplier = getBanningMastery(store.getState().bans).currencyGainedMultiplier;

			currencyBoosters.push(globalCurrencyEventMultiplier, boostCurrencyMultiplier, gamepassCurrencyMultiplier);

			let currencyMultiplier = 0;
			currencyBoosters.forEach((booster) => {
				currencyMultiplier += booster;
			});
			currencyMultiplier +=
				store.getState().worldPrestige[npc.world.name].currencyUpgrades * WORLD_PRESTIGE.currency.multiplierIncrement;
			currencyMultiplier = currencyMultiplier > 1 ? currencyMultiplier : 1;
			currencyMultiplier += masteryCurrencyMultiplier - 1;

			// get experience multiplier
			let experienceMultiplier = 0;
			if (store.getState().gamepasses["x2 Experience"]) {
				experienceMultiplier += 2;
			}
			if (store.getState().boosts.active["x2 Rank Experience"] > 0) {
				experienceMultiplier += 2;
			}
			if (
				ReplicatedStorage.events.experience.enabled.Value &&
				ReplicatedStorage.events.experience.multiplier.Value > 1
			) {
				experienceMultiplier += ReplicatedStorage.events.experience.multiplier.Value;
			}
			experienceMultiplier = experienceMultiplier > 1 ? experienceMultiplier : 1;

			// get pet experience multiplier
			let petExperienceMultiplier = 0;
			if (store.getState().boosts.active["x2 Pet Experience"] > 0) {
				petExperienceMultiplier += 2;
			}
			petExperienceMultiplier = petExperienceMultiplier > 1 ? petExperienceMultiplier : 1;
			petExperienceMultiplier += getPetExperienceMastery(store.getState().index).additionalPetExperienceMultiplier - 1;

			// apply reward
			store.dispatch(
				killNpc(
					reward.currency * currencyMultiplier,
					WORLDS[npc.world.name].reward,
					petBansBonus,
					reward.experience * experienceMultiplier,
					storeState.currentWeapon.id,
					storeState.currentTalisman,
					petExperienceMultiplier,
					equippedPets,
				),
			);

			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(character);
		}
	}

	// move & wander & attack players
	for (const npc of npcs) {
		// sometimes the head of an npc disappears
		// we need to investigate this further (TODO), but for now
		// we want to just remove the npc if that happens
		if (npc.instance.FindFirstChild("Head") === undefined) {
			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(npc.instance);

			continue;
		}

		const npcRoot = npc.instance.Humanoid.RootPart;
		if (npcRoot === undefined) {
			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(npc.instance);

			continue;
		}

		if (npcRoot.Position.sub(npc.spawn.floor.Position).Magnitude > 110) {
			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(npc.instance);

			continue;
		}

		const leftFoot = npc.instance.FindFirstChild("LeftFoot") as BasePart;
		if (leftFoot !== undefined && leftFoot.Position.Y < npc.spawn.floor.Position.Y - 1.5 - npc.spawn.floor.Size.Y / 2) {
			// kill npc
			npcs.delete(npc);

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(npc.instance);

			continue;
		}

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
