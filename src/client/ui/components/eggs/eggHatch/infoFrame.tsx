import Roact from "@rbxts/roact";
import { udim2TopMiddle, vec2Middle } from "client/ui/commonValues";
import { BaseImageLabel } from "client/ui/elements/baseImageLabel";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

interface InfoFrameProps {
	Id: 0 | 1 | 2;
	IsVisible: boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export function InfoFrame(props: InfoFrameProps): Roact.Element {
	const infoFramePositions = preserveWithConstraint<Record<0 | 1 | 2, UDim2>>()({
		0: new UDim2(0.5, 0, 0.75, 0),
		1: new UDim2(0.325, 0, 0.75, 0),
		2: new UDim2(0.675, 0, 0.75, 0),
	});

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={infoFramePositions[props.Id]}
			Size={new UDim2(0.15, 0, 0.15, 0)}
			Visible={props.IsVisible}
		>
			<BaseTextLabel Position={new UDim2(0.6, 0, 0.25, 0)} Size={new UDim2(0.75, 0, 0.5, 0)} Text={"PET NAME"}>
				<BaseImageLabel
					AnchorPoint={new Vector2(1, 0.5)}
					Position={udim2TopMiddle}
					Size={new UDim2(0.3, 0, 1, 0)}
					Image={"http://www.roblox.com/asset/?id=9125808056"}
				/>
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
			<BaseTextLabel Position={new UDim2(0.5, 0, 0.65, 0)} Size={new UDim2(0.75, 0, 0.35, 0)} Text={"PET RARITY"}>
				<RarityGradient Rarity="Basic" />
				<BaseUIStroke Thickness={2.4} />
			</BaseTextLabel>
		</frame>
	);
}
