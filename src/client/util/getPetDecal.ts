import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

/**
 * Fetches the decal of a given pet.
 *
 * @param eggName The egg the pet comes from.
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The decal of the pet.
 */
export function getPetDecal(eggName: EggName, petId: number, variant: Variants): string {
	const petData = getPetData(eggName, petId);

	const variantUpperCase = variant === "radiant" ? "Radiant" : variant === "void" ? "Void" : "";
	const petVariantName = variant === "regular" ? petData.name : `${variantUpperCase} ${petData.name}`;

	const image = assetIds.images.decals.pets[petVariantName as keyof typeof assetIds.images.decals.pets];

	if (image === undefined) {
		return assetIds.images.decals.pets.DecalTemplate;
	}

	return image;
}
