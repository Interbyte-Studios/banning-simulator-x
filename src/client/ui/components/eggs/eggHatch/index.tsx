import Roact from "@rbxts/roact";
import { t } from "@rbxts/t";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { EggName } from "shared/configs/eggs";
import { ConfirmedPet } from "shared/remotes/eggs/hatchEgg";

import { InfoFrame } from "./infoFrame";

interface EggHatchProps {
	eggName: EggName;
	isVoid: boolean;
	pets: Array<ConfirmedPet>;
}

const isValidPetSlotId = t.literal(1, 2, 3);

/**
 * Displays information about pets that have been hatched.
 *
 * @param props Properties of the component.
 * @param props.eggName The name of the egg that has been hatched.
 * @param props.isVoid Whether or not the egg and hatched pets are void.
 * @param props.pets The pet(s) that were hatched from the egg(s).
 * @returns A roact element.
 */
export function EggHatch(props: EggHatchProps): Roact.Element {
	const infoFrames = [];
	for (const pet of props.pets) {
		const id = infoFrames.size() + 1;
		if (!isValidPetSlotId(id)) throw `Expected pet slot id to be 1, 2, or 3, but got ${id}`;

		infoFrames.push(
			<InfoFrame eggName={props.eggName} id={props.pets.size() === 1 ? 3 : id} isVoid={props.isVoid} pet={pet.id} />,
		);
	}

	return (
		<frame AnchorPoint={vec2Middle} Position={udim2Middle} Size={udim2BottomRight} BackgroundTransparency={1}>
			{infoFrames}
		</frame>
	);
}
