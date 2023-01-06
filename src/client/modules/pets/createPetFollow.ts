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
export function cachePetForAnimation(player: Player, petId: number, guid: string, variant: Variants): PetCreated {
	const petData = getPetData(petId);

	const petModel = getPetModel(petData.name);
	assert(petModel.IsA("Model"));
	setAssetProperties("pet", petModel, variant);

	if (petModel.PrimaryPart === undefined) {
		throw `Expected to find primary part for pet ${petData.name}`;
	}

	const petParts: Array<BasePart> = [];
	petModel.GetChildren().forEach((part) => {
		if (part.IsA("BasePart")) {
			petParts.push(part);
		}
	});

	petModel.Name = guid;
	weldObject(petParts, petModel.PrimaryPart);
	assert(petModel.PrimaryPart.IsA("BasePart"));

	const alignOrientation = new Instance("AlignOrientation", petModel.PrimaryPart);
	const alignPosition = new Instance("AlignPosition", petModel.PrimaryPart);
	const attachment = new Instance("Attachment", petModel.PrimaryPart);
	const animationType = petModel.GetAttribute("animationType") as "Walk" | "Fly";

	if (animationType === undefined) {
		error(`Could not get animation type for ${petData.name}`);
	}

	alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	alignPosition.Mode = Enum.PositionAlignmentMode.OneAttachment;
	alignOrientation.Attachment0 = attachment;
	alignPosition.Attachment0 = attachment;
	alignPosition.Responsiveness = animationType === "Fly" ? 15 : 20;
	alignOrientation.Responsiveness = 20;

	const originCFrame = new CFrame(0, 0, 0);
	const returnValue: PetCreated = {
		guid,
		id: petId,
		model: petModel,
		alignOrientation,
		alignPosition,
		petType: animationType,
		owner: player,
	};

	const character = player.Character;
	if (character === undefined) {
		petModel.PrimaryPart.PivotTo(originCFrame);
		return returnValue;
	}

	const primaryPart = character.PrimaryPart;
	if (primaryPart === undefined) {
		petModel.PrimaryPart.PivotTo(originCFrame);
		return returnValue;
	}

	petModel.MoveTo(primaryPart.Position);
	return returnValue;
}
