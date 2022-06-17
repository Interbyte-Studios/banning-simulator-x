import Roact from "@rbxts/roact";
import { udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { EggName } from "shared/configs/eggs";
import { ConfirmedPet } from "shared/remotes/eggs/hatchEgg";

import { InfoFrame } from "./infoFrame";

interface EggHatchProps {
	eggName: EggName | undefined;
	isVoid: boolean | undefined;
	pets: Array<ConfirmedPet> | undefined;
}

/* eslint-disable jsdoc/require-jsdoc */
export function EggHatch(props: EggHatchProps): Roact.Element {
	if (props.eggName === undefined || props.isVoid === undefined || props.pets === undefined) {
		return <></>;
	}

	const infoFrames: Array<Roact.Element> = [];
	for (const pet of props.pets) {
		const id = (infoFrames.size() + 1) as 1 | 2 | 3;
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
