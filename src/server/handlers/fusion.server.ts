import { HttpService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { RARITIES } from "shared/configs/rarities";
import { remotes } from "shared/remotes";
import { FusionFailKind } from "shared/remotes/fusing";
import { addPets, ConfirmedPet, deletePets } from "shared/rodux/pets";
import { getEggCost } from "shared/util/getEggCost";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";

remotes.Server.Create("requestFusion").SetCallback(
	withPlayerStore((_, store, petsToFuse, variant) => {
		// check that all pets have the same id
		let petId: number | undefined;
		for (const petGuid of petsToFuse) {
			const storedPet = store.getState().pets.find((_pet) => _pet.guid === petGuid);
			if (storedPet === undefined) {
				return {
					success: false,
					reason: FusionFailKind.InternalError,
				};
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
		const maxFusions = RARITIES[petData.rarity].maxFusions;

		// check that player has enough money
		const eggName = getEggNameFromPetId(petId);
		const eggCost = getEggCost(eggName, true, 0);
		const fusionCost =
			(eggCost.amount / rarityId) * petsToFuse.size() * (variant === "radiant" ? 3 : variant === "void" ? 2 : 1);

		if (store.getState().currencies[eggCost.currencyType] < fusionCost) {
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
			store.dispatch(deletePets(petsToFuse));
			return {
				success: false,
				reason: FusionFailKind.UnsuccesfulFusion,
			};
		}

		const newPet: ConfirmedPet = {
			id: petData.id,
			variant: variant,
			method: "fuse",
			tradeLocked: false,
			autoDeleted: false,
			guid: HttpService.GenerateGUID(false),
		};

		store.dispatch(deletePets(petsToFuse));
		store.dispatch(addPets(fusionCost, eggCost.currencyType, [newPet]));

		return { success: true };
	}),
);
