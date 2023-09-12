import { ReplicatedStorage } from "@rbxts/services";
import { playerStores } from "server/playerStore";
import { PET_MAX_LEVELS } from "shared/configs/pets";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { Store } from "shared/rodux";
import { killNpc } from "shared/rodux/currencies";
import { logPetMaxLevel } from "shared/rodux/playerIndex/pets";
import { getBanningMastery } from "shared/util/getBanningMastery";
import { getPetExperienceMastery } from "shared/util/getPetExperienceMastery";
import { getPetLevel } from "shared/util/getPetLevel";
import { getPetStrength } from "shared/util/getPetStrength";
import { getTalismanStatEffect } from "shared/util/getTalismanDamage";
import { getWeaponDamage } from "shared/util/getWeaponDamage";

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

const random = new Random();

/**
 * @param part The part to move.
 * @param target The target to travel to.
 * @param speed The speed of the part per frame.
 */
export function lerpPosition(part: BasePart, target: Vector3, speed: number): void {
	const startPosition = part.Position;
	const direction = target.sub(startPosition);

	// Calculate the normalized direction manually
	const magnitude = math.sqrt(direction.X * direction.X + direction.Y * direction.Y + direction.Z * direction.Z);

	// Check for a zero vector to avoid division by zero
	if (magnitude === 0) return;

	const normalizedDirection = new Vector3(direction.X / magnitude, direction.Y / magnitude, direction.Z / magnitude);

	// Determine how much to move in this frame
	const moveDistance = new Vector3(
		normalizedDirection.X * speed,
		normalizedDirection.Y * speed,
		normalizedDirection.Z * speed,
	);

	// Apply the movement
	part.Position = startPosition.add(moveDistance);
}

/**
 * Runs a simulation step for NPCs.
 *
 * @param state The current state of the game for the NPCs.
 * @param npcAttacks An array of players that are hitting an npc.
 * @param time The current time of the game.
 */
export function runStep(
	state: Array<NpcWorldState>,
	npcAttacks: Array<{ player: Player; store: Store; character: BasePart }>,
	time: number,
): void {
	// get npcs
	const npcs: Set<NpcInstance> = new Set();
	const npcCharacterToNpc: Map<BasePart, NpcInstance> = new Map();
	for (const world of state) {
		for (const zone of world.zones) {
			// spawn any npcs that need spawning
			if (zone.npcs.size() < ZONE_NPC_AMOUNT) {
				const zoneInfo = zones[zone.name];
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
				const npcPart = new Instance("Part");
				npcPart.Size = new Vector3(1, 1, 1);
				npcPart.Name = selectedNpc.name;
				npcPart.Anchored = true;
				npcPart.CanCollide = false;
				npcPart.PivotTo(getRandomCFrame(zone.spawn.min, zone.spawn.max, random));
				npcPart.SetAttribute("MaxHealth", selectedNpc.health);
				npcPart.SetAttribute("Health", selectedNpc.health);
				npcPart.Parent = getNpcFolder();

				zone.npcs.push({
					npc: selectedNpc,
					instance: npcPart,
					spawn: zone.spawn,
					state: {
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

		const currentHealth = character.GetAttribute("Health") as number;
		if (currentHealth === undefined) {
			continue;
		}

		if (currentHealth <= 0) {
			continue;
		}

		const playerCharacter = player.Character;
		if (playerCharacter === undefined) {
			continue;
		}

		const playerHumanoid = playerCharacter.FindFirstChildOfClass("Humanoid");
		if (playerHumanoid === undefined) {
			continue;
		}

		const playerRootPart = playerHumanoid.RootPart;
		if (playerRootPart === undefined) {
			continue;
		}

		// check distance between player and npc
		if (playerRootPart.Position.sub(character.Position).Magnitude > 50) {
			continue;
		}

		// apply weapon damage to npc
		const storeState = store.getState();

		const currentWeaponData = storeState.weapons.find((weapon) => weapon.id === storeState.currentWeapon.id);
		if (currentWeaponData === undefined) {
			continue;
		}

		if (storeState.currentTalisman !== undefined) {
			const currentTalismanData = storeState.talismans.find((talisman) => talisman.id === storeState.currentTalisman);
			if (currentTalismanData === undefined) {
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
		const health = currentHealth - damageAmount;
		character.SetAttribute("Health", health);

		// check if npc is dead
		const newHealth = character.GetAttribute("Health") as number;
		if (newHealth !== undefined && newHealth <= 0) {
			// reward player
			const store = playerStores.get(player);
			if (store === undefined) {
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
			const rebirthMultiplier = store.getState().rebirths.currencyMultipliers[WORLDS[npc.world.name].reward] * 0.3;

			currencyBoosters.push(globalCurrencyEventMultiplier, boostCurrencyMultiplier, gamepassCurrencyMultiplier);

			let currencyMultiplier = 0;
			currencyBoosters.forEach((booster) => {
				currencyMultiplier += booster;
			});
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

			const rebirthBansMultiplier = 5 * store.getState().rebirths.rebirth;

			for (const pet of equippedPets) {
				const petLevel = getPetLevel(pet);
				const maxLevel = PET_MAX_LEVELS[pet.variant];

				const petAfterKill = {
					...pet,
					bans: pet.bans + 1,
				};
				const nextPetLevel = getPetLevel(petAfterKill);
				if (petLevel < maxLevel && nextPetLevel >= maxLevel) {
					store.dispatch(logPetMaxLevel([{ id: pet.id, variant: pet.variant }]));
				}
			}

			// apply reward
			store.dispatch(
				killNpc(
					reward.currency * currencyMultiplier + reward.currency * currencyMultiplier * rebirthMultiplier,
					WORLDS[npc.world.name].reward,
					petBansBonus + petBansBonus * rebirthBansMultiplier,
					reward.experience * experienceMultiplier,
					storeState.currentWeapon.id,
					storeState.currentTalisman,
					petExperienceMultiplier,
					equippedPets,
				),
			);

			// kill npc
			npcs.delete(npc);
			if (character) {
				character.Destroy();
			}

			// remove from state
			const npcZone = npc.world.zones.find((zone) => zone.spawn === npc.spawn);
			npcZone?.npcs.unorderedRemove(npcZone.npcs.indexOf(npc));

			// get rid of npc instance
			npc.instance.Parent = undefined;
			npcCharacterToNpc.delete(character);

			const questBans = player.GetAttribute("petQuestBan") as number | undefined;
			player.SetAttribute("petQuestBan", questBans !== undefined ? questBans + 1 : 0);
		}
	}

	// move & wander & attack players
	for (const npc of npcs) {
		const wanderingDistance = npc.instance.Position.sub(npc.spawn.floor.Position).Magnitude;
		const outsideWanderingZone = wanderingDistance > npc.spawn.floor.Size.X / 2 + NPC_SPAWN_SURROUNDING;

		if ((outsideWanderingZone && !npc.lerpTarget) || (!npc.lerpTarget && time >= npc.state.nextWanderTime)) {
			const targetPosition = getRandomCFrame(npc.spawn.min, npc.spawn.max, random).Position;
			npc.lerpTarget = targetPosition;
			npc.lerpProgress = 0;
		}
		if (npc.lerpTarget !== undefined && npc.lerpProgress !== undefined) {
			const t = 0.3;
			lerpPosition(npc.instance, npc.lerpTarget, t);
			npc.lerpProgress += t;
			if (npc.lerpProgress >= 35) {
				npc.lerpTarget = undefined;
				npc.lerpProgress = undefined;
				npc.state.nextWanderTime = time + random.NextInteger(NPC_WANDER_COOLDOWN_MIN, NPC_WANDER_COOLDOWN_MAX);
			}
		}
	}
}
