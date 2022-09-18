import { Workspace } from "@rbxts/services";
import { EggName } from "shared/configs/eggs";

import { getMagnitudeBetweenPlayerAndObject } from "./getDistanceFromObject";

const activationDistance = 15;

/**
 * @param character The character model.
 * @param eggName The Name or primary part of the egg.
 * @param isVoid Whether or not the egg is void.
 * @returns Whether or not the player is within activation distance of the egg.
 */
export function withinDistanceToHatch(character: Model, eggName: EggName, isVoid: boolean): boolean {
	const eggFolder = Workspace.interactions.eggs[eggName];
	const egg = isVoid ? eggFolder.void.egg.PrimaryPart : eggFolder.regular.egg.PrimaryPart;
	assert(egg, `Expected to find primary part for ${isVoid ? "Void" : "Regular"} ${eggName}`);

	const magnitudeToBasePart = getMagnitudeBetweenPlayerAndObject(character, egg);
	if (magnitudeToBasePart === undefined) {
		// character did not exist
		return false;
	}

	return magnitudeToBasePart <= activationDistance;
}
