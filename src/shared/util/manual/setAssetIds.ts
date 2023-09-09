import { ReplicatedStorage } from "@rbxts/services";
import { EGGS } from "shared/configs/eggs";
import { WEAPONS } from "shared/configs/weapons";

import { UnreachableCaseError } from "../unreachableCaseError";

/**
 * This is a true utility function that should be ran in command line in studio to asset asset ids.
 *
 * @param assetType The type of asset to set ids for.
 */
export function setAssetIds(assetType: "pets" | "weapons"): void {
	switch (assetType) {
		case "pets": {
			for (const [eggName, eggData] of pairs(EGGS)) {
				for (const pet of eggData.pets) {
					const petModel = ReplicatedStorage.assetObjects.pets[eggName].FindFirstChild(pet.name);

					if (petModel) {
						petModel.SetAttribute("id", pet.id);
					} else warn(`No pet model found for ${pet.name}`);
				}
			}
			break;
		}
		case "weapons": {
			for (const [weaponName, weaponData] of pairs(WEAPONS)) {
				const weaponModel = ReplicatedStorage.assetObjects.weapons[weaponName];
				weaponModel.SetAttribute("id", weaponData.id);
			}
			break;
		}
		default: {
			throw new UnreachableCaseError(assetType);
		}
	}
}
