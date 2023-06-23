import { ReplicatedStorage } from "@rbxts/services";
import { Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";
import { weldObject } from "shared/util/weldObject";

import { PetCreated } from "./petAnimationCache";

/**
 * @param petName The name of the pet we are getting the model for.
 * @returns The model for the pet.
 */
function getPetModel(petName: string): Model {
	const eggModels = ReplicatedStorage.assetObjects.pets.GetChildren();
	for (const eggModel of eggModels) {
		for (const petModel of eggModel.GetChildren()) {
			if (!petModel.IsA("Model")) {
				continue;
			}

			if (petModel.Name !== petName) {
				continue;
			}

			return petModel.Clone();
		}
	}

	throw `Could not find pet model for pet of name ${petName}`;
}

/**
 * @param player Player The owner of the pet.
 * @param petId The id of the pet.
 * @param guid The unique id of the pet.
 * @param variant The variant of the pet.
 * @returns Data for the new pet.
 */
export function cachePetForAnimation(
	player: Player,
	petId: number,
	guid: string,
	variant: Variants,
): PetCreated | undefined {
	const petData = getPetData(petId);

	const petModel = getPetModel(petData.name);
	if (petModel === undefined) {
		warn(`[ Pet Follow Module ] - Failed to get pet model for pet ${petData.name}`);
		return;
	}

	petModel.Name = guid;
	setAssetProperties("pet", petModel, variant);

	const primaryPart = petModel.PrimaryPart;
	if (primaryPart === undefined) {
		warn(`[ Pet Follow Module ] - Failed to get primary part for pet ${petData.name}`);
		return;
	}

	if (!primaryPart.IsA("BasePart")) {
		warn(`[ Pet Follow Module ] - Primary part for pet ${petData.name} is not a BasePart`);
		return;
	}

	const petParts = petModel.GetChildren().filter((child) => child.IsA("BasePart")) as Array<BasePart>;
	weldObject(petParts, primaryPart);

	const alignOrientation = new Instance("AlignOrientation", primaryPart);
	alignOrientation.RigidityEnabled = true;
	alignOrientation.ReactionTorqueEnabled = true;

	const alignPosition = new Instance("AlignPosition", primaryPart);
	alignPosition.ReactionForceEnabled = true;
	alignPosition.ApplyAtCenterOfMass = true;

	const attachment = new Instance("Attachment", primaryPart);
	const animationType = petModel.GetAttribute("animationType") as "Walk" | "Fly";

	if (animationType === undefined) {
		warn(`[ Pet Follow Module ] - Failed to get animation type for pet ${petData.name}`);
		return;
	}

	alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	alignPosition.Mode = Enum.PositionAlignmentMode.OneAttachment;
	alignOrientation.Attachment0 = attachment;
	alignPosition.Attachment0 = attachment;
	alignPosition.Responsiveness = animationType === "Fly" ? 15 : 20;
	alignOrientation.Responsiveness = 20;

	const returnValue: PetCreated = {
		guid,
		id: petId,
		model: petModel,
		alignOrientation,
		alignPosition,
		petType: animationType,
		owner: player,
	};
	return returnValue;
}
