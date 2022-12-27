import { ReplicatedStorage } from "@rbxts/services";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";
import { weldObject } from "shared/util/weldObject";

export interface PetCreated {
	guid: string;
	id: number;
	model: Model;
	owner: Player;
	alignOrientation: AlignOrientation;
	alignPosition: AlignPosition;
	petType: "Walk" | "Fly";
}

/**
 *
 * @param petName The name of the pet we are getting the model for.
 * @returns The model for the pet.
 */
function getPetModel(petName: string): Model {
	for (const [, eggFolder] of pairs(ReplicatedStorage.assetObjects.pets.GetChildren())) {
		for (const [_, petModel] of pairs(eggFolder.GetChildren())) {
			if (petModel.Name === petName) {
				if (petModel.IsA("Model")) {
					return petModel.Clone();
				}
			}
		}
	}

	throw `Could not find pet model for pet of name ${petName}`;
}

/**
 * @param player Player The owner of the pet.
 * @param petId The id of the pet.
 * @param guid The unique id of the pet.
 * @param isVoid The value to see if the pet is void type or not.
 * @returns Data for the new pet.
 */
export function createPetFollow(player: Player, petId: number, guid: string, isVoid: boolean): PetCreated {
	const petData = getPetData(petId);

	const petModel = getPetModel(petData.name);
	assert(petModel.IsA("Model"));
	setAssetProperties("pet", petModel, isVoid);

	if (petModel.PrimaryPart === undefined) {
		throw ` Expected to find primary part for pet ${petData.name}`;
	}

	const petParts: Array<BasePart> = [];
	for (const [, part] of pairs(petModel.GetChildren())) {
		if (!part.IsA("BasePart")) continue;
		petParts.push(part);
	}

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

	const character = player.Character;
	petModel.PrimaryPart.PivotTo(character?.PrimaryPart?.CFrame ?? new CFrame(0, 0, 0));
	const data: PetCreated = {
		guid: guid,
		id: petId,
		model: petModel,
		alignOrientation: alignOrientation,
		alignPosition: alignPosition,
		petType: animationType,
		owner: player,
	};

	return data;
}
