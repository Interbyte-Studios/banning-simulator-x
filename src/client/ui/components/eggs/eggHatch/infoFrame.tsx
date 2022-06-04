import Roact from "@rbxts/roact";
import { udim2TopMiddle, vec2Middle } from "client/ui/commonValues";
import { BaseImageLabel } from "client/ui/elements/baseImageLabel";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { getPetDecal } from "client/util/getPetDecal";
import { EggNames } from "shared/configs/eggs";
import { getPetData } from "shared/util/getPetData";
import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

interface InfoFrameProps {
	eggName: EggNames;
	id: 0 | 1 | 2;
	isVisible: boolean;
	pet: number;
	isVoid: boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export function InfoFrame(props: InfoFrameProps): Roact.Element {
	const infoFramePositions = preserveWithConstraint<Record<0 | 1 | 2, UDim2>>()({
		0: new UDim2(0.5, 0, 0.75, 0),
		1: new UDim2(0.25, 0, 0.75, 0),
		2: new UDim2(0.75, 0, 0.75, 0),
	});

	const petInfo = getPetData(props.eggName, props.pet);

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={infoFramePositions[props.id]}
			Size={new UDim2(0.175, 0, 0.12, 0)}
			Visible={props.isVisible}
		>
			<BaseTextLabel
				Position={new UDim2(0.7, 0, 0.3, 0)}
				Size={new UDim2(0.8, 0, 0.55, 0)}
				Text={string.upper(petInfo.petName)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseImageLabel
					AnchorPoint={new Vector2(1, 0.5)}
					Position={udim2TopMiddle}
					Size={new UDim2(0.4, 0, 1.15, 0)}
					Image={getPetDecal(props.eggName, props.pet, props.isVoid ? "void" : "regular")}
				/>
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
			<BaseTextLabel
				Position={new UDim2(0.5, 0, 0.875, 0)}
				Size={new UDim2(0.75, 0, 0.4, 0)}
				Text={string.upper(petInfo.petData.rarity)}
			>
				<RarityGradient Rarity={petInfo.petData.rarity} />
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
		</frame>
	);
}
