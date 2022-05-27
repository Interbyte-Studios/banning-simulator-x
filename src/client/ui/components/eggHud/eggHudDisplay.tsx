import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { BaseImageButton } from "client/ui/elements/baseImageButton";
import { BaseImageLabel } from "client/ui/elements/baseImageLabel";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import assetIds from "shared/assets";
import { EggNames } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

import { autoEnabled, udim2Middle, udim2TopLeft, uiTheme, vec2Middle } from "../../commonValues";
import { PetFrame } from "../../elements/petFrame";
import { RescalingScrollingFrame } from "../rescalingScrollingFrame";

interface eggCostDisplayProps {
	adornee: BasePart;
	eggName: EggNames;
	isVoid: boolean;
	pets: Record<string, Pet>;
}

/* eslint-disable jsdoc/require-jsdoc */
export function EggHudDisplay(props: eggCostDisplayProps): Roact.Element {
	return (
		<billboardgui
			Active={true}
			Adornee={props.adornee}
			MaxDistance={30}
			AlwaysOnTop={true}
			Size={new UDim2(15, 0, 20, 0)}
			ClipsDescendants={true}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
		>
			<BaseImageButton
				Position={udim2Middle}
				Size={new UDim2(0.175, 0, 0.135, 0)}
				Image={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEgg}
				HoverImage={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEggSelected}
				PressedImage={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEggSelected}
			/>
			<BaseImageLabel
				Position={new UDim2(0.5, 0, 0.675, 0)}
				Size={new UDim2(0.4, 0, 0.24, 0)}
				Image={assetIds.images.backgrounds[uiTheme].AutoHatchBG}
			>
				<BaseImageButton
					Position={new UDim2(0.5, 0, 0.725, 0)}
					Size={new UDim2(0.9, 0, 0.3, 0)}
					Image={
						assetIds.images.buttons[uiTheme].templates.rectangular[
							autoEnabled === "On" ? "RectangularButtonConfirmation" : "RectangularButtonWarning"
						]
					}
					HoverImage={
						assetIds.images.buttons[uiTheme].templates.rectangular[
							autoEnabled === "On" ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
						]
					}
					PressedImage={
						assetIds.images.buttons[uiTheme].templates.rectangular[
							autoEnabled === "On" ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
						]
					}
				>
					<BaseTextLabel Position={udim2Middle} Size={new UDim2(0.9, 0, 0.6, 0)} Text={string.upper(autoEnabled)}>
						<BaseUIStroke Thickness={2.4} />
					</BaseTextLabel>
				</BaseImageButton>
				<BaseTextLabel Position={new UDim2(0.5, 0, 0.425, 0)} Size={new UDim2(0.85, 0, 0.25, 0)} Text={"Auto Hatch"}>
					<BaseUIStroke Thickness={2.4} />
				</BaseTextLabel>
			</BaseImageLabel>
			<BaseImageLabel
				Position={new UDim2(0.5, 0, 0.265, 0)}
				Size={new UDim2(0.5, 0, 0.325, 0)}
				Image={assetIds.images.backgrounds[uiTheme].EggPetDisplay}
			>
				<RescalingScrollingFrame
					Active={true}
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={new UDim2(0.5, 0, 0.42, 0)}
					Size={new UDim2(0.9, 0, 0.65, 0)}
					BorderSizePixel={0}
					CanvasSize={udim2TopLeft}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout CellPadding={new UDim2(0.05, 0, 0.05, 0)} CellSize={new UDim2(0.3, 0, 0.48, 0)} />
					{Object.entries(props.pets).map(([, petInfo]) => {
						return <PetFrame eggName={props.eggName} petId={petInfo.id} />;
					})}
				</RescalingScrollingFrame>
				<BaseTextLabel
					Position={new UDim2(0.5, 0, 0.01, 0)}
					Size={new UDim2(1, 0, 0.1, 0)}
					Text={props.isVoid ? `Void ${props.eggName} Egg` : `${props.eggName} Egg`}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke Thickness={2.4} />
				</BaseTextLabel>
			</BaseImageLabel>
		</billboardgui>
	);
}
