import { ReplicatedStorage } from "@rbxts/services";
import { EGGS } from "shared/configs/eggs";

import { UnreachableCaseError } from "./unreachableCaseError";

/**
 * This is a true utility function that should be ran in command line in studio to asset asset ids.
 *
 * @param assetType The type of asset to set ids for.
 */
export function setAssetIds(assetType: "pets"): void {
	switch (assetType) {
		case "pets": {
			for (const [eggName, eggData] of pairs(EGGS)) {
				for (const [petName, petData] of pairs(eggData.pets)) {
					const petModel = ReplicatedStorage.assetObjects.pets[eggName].FindFirstChild(petName);

					if (petModel) {
						petModel.SetAttribute("id", petData.id);
					} else warn(`No pet model found for ${petName}`);
				}
			}
			break;
		}
		default: {
			throw new UnreachableCaseError(assetType);
		}
	}
}
