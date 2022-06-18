import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

/**
 * Returns the decal of the specified pet id.
 *
 * @param eggName The name of the egg the pet comes from.
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The decal id.
 */
export function getPetDecal(eggName: EggName, petId: number, variant: Variants): string {
	const petData = getPetData(eggName, petId);

	const variantDecals = assetIds.images.decals.pets[variant];
	const petDecal = variantDecals[petData.name as keyof typeof variantDecals];
	assert(petDecal, `Did not find decal for pet ${petData.name} of variant ${variant}`);

	return petDecal;
}
