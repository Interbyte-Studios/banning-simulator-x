import { HttpService, ReplicatedStorage } from "@rbxts/services";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { remotes } from "shared/remotes";
import { StoreState } from "shared/rodux";
import { HatchedPet, Pet } from "shared/rodux/pets";
import { isImmuneRarity } from "shared/rodux/settings";
import { getEggData } from "shared/util/getEggData";
import { getPetData } from "shared/util/getPetData";

import { modifyPetCount } from "../datastore/pets";

/**
 * Random object used for hatching.
 */
const random = new Random();

/**
 * Relevant hatching remotes.
 */
const eggsNamespace = remotes.Server.GetNamespace("eggs");
const hatchSystemMessage = eggsNamespace.Get("hatchEggSystemMessage");

/**
 * A type to define a pet hatched via the `hatchGameFunction`.
 */
export type PetHatched = {
	pet: Pet;
	isMagic: boolean;
};

/**
 * @param storeState The state of the players store.
 * @param egg The name of the egg.
 * @param variant The variant of the egg.
 * @returns The hatched pet.
 */
export function hatchGameEgg(storeState: StoreState, egg: EggName, variant: Exclude<Variants, "radiant">): PetHatched {
	const eggData = getEggData(egg);
	const randomNum = random.NextNumber(0, 100);

	let luckMultiplier = 0;
	luckMultiplier += storeState.boosts.active["x2 Hatching Luck"] > 0 ? 2 : 0;
	luckMultiplier += storeState.gamepasses["x2 Luck"] ? 2 : 0;
	luckMultiplier += storeState.rebirths.extraLuck ? 2 : 0;
	luckMultiplier += ReplicatedStorage.events.luck.enabled.Value ? 2 : 0;

	// decide whether it's shiny or not if they have magic egg
	const magicRandomNumber = random.NextNumber(0, 100);
	const shinyChance = storeState.rebirths.magicEggUpgrades;
	const isMagicPet = magicRandomNumber <= shinyChance;

	let magicVariant: Variants = variant;
	if (isMagicPet) {
		if (variant === "void") {
			magicVariant = "radiant";
		} else {
			magicVariant = "void";
		}
	}

	const hasLegendPets = eggData.pets.find((p) => isImmuneRarity(p.rarity)) !== undefined;

	let hatchedPet: Pet | undefined;
	let cumulativeChance = 0;
	for (let i = 0; i < eggData.pets.size(); i++) {
		const pet = eggData.pets[i];

		// we need to check if there are any legendary+ pets if they have luck enabled
		// if there are, we need to remove their chance * luck from the 1st pet in the egg
		if (luckMultiplier > 0 && hasLegendPets) {
			for (const immunePet of eggData.pets) {
				if (!isImmuneRarity(pet.rarity)) {
					continue;
				}

				pet.chance -= immunePet.chance * luckMultiplier;
				pet.chance += immunePet.chance;
			}
		}
		cumulativeChance += pet.chance;

		if (randomNum <= cumulativeChance) {
			hatchedPet = {
				id: pet.id,
				bans: 0,
				guid: HttpService.GenerateGUID(false),
				equipped: false,
				locked: false,
				variant: magicVariant,
				tradeLocked: false,
			};
		}
	}
	assert(hatchedPet, `Failed to hatch pet in egg ${egg}`);

	return {
		pet: hatchedPet,
		isMagic: isMagicPet,
	};
}

/**
 * @param player The player hatching the egg.
 * @param storeState The state of the players store.
 * @param eggName The name of the egg.
 * @param amount The number of eggs to hatch.
 * @param variant The variant of the egg.
 * @returns An array of hatched pets.
 */
export function hatchHatchableEgg(
	player: Player,
	storeState: StoreState,
	eggName: EggName,
	amount: number,
	variant: Exclude<Variants, "radiant">,
): Array<HatchedPet> {
	// find the eggs to hatch
	const hatchedEggs: Array<HatchedPet> = [];
	for (let i = 0; i < amount; i++) {
		// invoke a hatched egg
		const hatchedPet = hatchGameEgg(storeState, eggName, variant);
		const petData = getPetData(hatchedPet.pet.id);

		// log pet
		const storedPet: HatchedPet = {
			...hatchedPet.pet,
			autoDeleted: storeState.settings.autoDelete.includes(hatchedPet.pet.id),
			magicPet: hatchedPet.isMagic,
		};

		if (!storedPet.autoDeleted) {
			modifyPetCount({
				type: "addPet",
				petId: storedPet.id,
				variant: storedPet.variant,
			});
		}

		// check if it should be saved to the memory store service (rarity of `Primordial` or higher)
		if (petData.rarity === "Secret" || petData.rarity === "Primordial") {
			hatchSystemMessage.SendToAllPlayers(player, petData.id, storedPet.variant, "hatched");

			const variantUpperCase = storedPet.variant === "radiant" ? "Radiant" : storedPet.variant === "void" ? "Void" : "";
			const petVariantName = storedPet.variant === "regular" ? petData.name : `${variantUpperCase} ${petData.name}`;

			const image = assetIds.images.decals.pets[petVariantName as keyof typeof assetIds.images.decals.pets];
			let decalToPass = 0;
			if (image !== undefined) {
				decalToPass = image.match("%d+")[0] as number;
			}

			let existAmount = 0;
			const petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(petData.id) as Configuration;
			if (petExistCache !== undefined) {
				const variantCache = petExistCache.FindFirstChild(storedPet.variant) as IntValue;
				if (variantCache !== undefined) {
					const variantCache = petExistCache.FindFirstChild(storedPet.variant) as IntValue;
					if (variantCache !== undefined) {
						existAmount += variantCache.Value;
					}
				}
			}

			task.spawn(() => {
				pcall(() => {
					HttpService.RequestAsync({
						Url: "http://137.184.152.180:8765/hatch",
						Body: HttpService.JSONEncode({
							roblox_uid: player.UserId,
							secret_name: petData.name,
							secret_type: petData.rarity,
							pet_variant: storedPet.variant,
							decal: decalToPass,
							exist: existAmount + 1,
						}),
						Method: "POST",
						Headers: {
							"Content-Type": "application/json",
							"X-ACCESS-TOKEN": "V1qijQkozBm1LdD5SsO1",
						},
					});
				});
			});
		} else if (petData.rarity === "Legendary" && !storedPet.autoDeleted) {
			hatchSystemMessage.SendToAllPlayers(player, petData.id, storedPet.variant, "hatched");
		}
		hatchedEggs.push(storedPet);
	}
	return hatchedEggs;
}
