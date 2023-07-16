import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { RARITIES } from "shared/configs/rarities";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { remotes } from "shared/remotes";
import { FusionFailKind } from "shared/remotes/fusing";
import { awardCurrency } from "shared/rodux/currencies";
import { deletePets, FusedPet, fusePets } from "shared/rodux/pets";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";

remotes.Server.Get("requestFusion").SetCallback(
	withPlayerStore((_, store, petsToFuse, variant) => {
		const currentState = store.getState();

		const previousVariant = variant === "radiant" ? "void" : "regular";

		// check that all pets have the same id and are the same variant
		const cachedGuids: Array<string> = [];
		let petId: number | undefined;
		for (const petGuid of petsToFuse) {
			const storedPet = currentState.pets.find((_pet) => _pet.guid === petGuid);
			if (storedPet === undefined) {
				return {
					success: false,
					reason: FusionFailKind.InternalError,
				};
			}

			if (storedPet.equipped || storedPet.locked) {
				return {
					success: false,
					reason: FusionFailKind.InternalError,
				};
			}

			if (storedPet.variant !== previousVariant) {
				return {
					success: false,
					reason: FusionFailKind.InternalError,
				};
			}

			if (cachedGuids.includes(storedPet.guid)) {
				return {
					success: false,
					reason: FusionFailKind.InternalError,
				};
			} else {
				cachedGuids.push(storedPet.guid);
			}

			if (petId === undefined) {
				petId = storedPet.id;
			} else {
				if (petId !== storedPet.id) {
					return {
						success: false,
						reason: FusionFailKind.PetsNotSameId,
					};
				}
			}
		}
		if (petId === undefined) {
			return {
				success: false,
				reason: FusionFailKind.InternalError,
			};
		}

		const petData = getPetData(petId);
		const rarityId = RARITIES[petData.rarity].reverseId;
		const maxFusions = currentState.gamepasses["Better Fusion"]
			? RARITIES[petData.rarity].betterMaxFusions
			: RARITIES[petData.rarity].maxFusions;

		if (petData.rarity === "Prismatic" || petData.rarity === "Primordial") {
			return {
				success: false,
				reason: FusionFailKind.InternalError,
			};
		}

		// check that player has enough money
		const eggName = getEggNameFromPetId(petId);
		const eggData = getEggData(eggName);
		const eggCost = getEggCost(eggName, true, 0);
		let fusionCost = eggCost.amount / rarityId;
		if (petData.fusionCost !== undefined) {
			fusionCost = petData.fusionCost;
		}
		fusionCost = fusionCost * petsToFuse.size() * (variant === "radiant" ? 3 : 2);

		if (eggData.world !== "Limited" && currentState.worldPrestige[eggData.world] !== undefined) {
			fusionCost -=
				fusionCost *
				currentState.worldPrestige[eggData.world].reducedFusionCostUpgrades *
				WORLD_PRESTIGE.reducedFusionCost.reducedCostMultiplier;
		}

		if (currentState.currencies[eggCost.currencyType] < fusionCost) {
			return {
				success: false,
				reason: FusionFailKind.NotEnoughCurrency,
			};
		}

		// get fusion rate of success
		const fusionSuccessRate = petsToFuse.size() * (100 / maxFusions);

		const random = new Random();
		const success = random.NextNumber(0, 100) <= fusionSuccessRate;
		if (!success) {
			for (const petGuid of petsToFuse) {
				const storedPet = currentState.pets.find((_pet) => _pet.guid === petGuid);
				if (storedPet !== undefined) {
					modifyPetCount({
						type: "deletePet",
						petId: storedPet.id,
						variant: storedPet.variant,
						amount: 1,
					});
				}
			}

			store.dispatch(deletePets(petsToFuse));
			store.dispatch(awardCurrency(eggCost.currencyType, -fusionCost));
			return {
				success: false,
				reason: FusionFailKind.UnsuccesfulFusion,
			};
		}

		const newPet: FusedPet = {
			id: petData.id,
			variant: variant,
			tradeLocked: false,
			guid: HttpService.GenerateGUID(false),
		};

		modifyPetCount({
			type: "addPet",
			petId: petData.id,
			variant,
		});

		modifyPetCount({
			type: "deletePet",
			petId: petData.id,
			variant: previousVariant,
			amount: petsToFuse.size(),
		});

		store.dispatch(deletePets(petsToFuse));
		store.dispatch(fusePets(fusionCost, eggCost.currencyType, newPet));

		return { success: true };
	}),
);
