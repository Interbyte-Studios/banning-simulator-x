import Flipper from "@rbxts/flipper";
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { handleEggPurchase } from "client/eggs/purchaseEgg";
import { toggleAuto } from "client/network";
import { BaseImageLabel } from "client/ui/elements/baseImageLabel";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import assetIds from "shared/assets";
import { EggNames } from "shared/configs/eggs";
import { MAIN_GROUP } from "shared/configs/game";
import { Pet } from "shared/configs/pets";
import { Store } from "shared/rodux";

import { udim2Middle, uiTheme, userOwnsTripleEggs, vec2Middle } from "../../../commonValues";
import { PetFrame } from "../../../elements/petFrame";
import { RescalingScrollingFrame } from "../../../elements/rescalingScrollingFrame";
import { eggHudAnimatorService } from "./eggHudAnimator";

interface EggHudProps {
	adornee: BasePart;
	autoHatch: boolean;
	eggName: EggNames;
	isVoid: boolean;
	pets: Record<string, Pet>;
	store: Store;
}

/* eslint-disable jsdoc/require-jsdoc */
export function EggHudDisplay(props: EggHudProps): Roact.Element {
	const motor = new Flipper.GroupMotor({
		X: 1,
		Y: 1,
	});

	const [binding, setBinding] = Roact.createBinding(motor.getValue());
	motor.onStep(setBinding);

	eggHudAnimatorService.addMotor(props.adornee, motor);

	return (
		<billboardgui
			Active={true}
			Adornee={props.adornee}
			AlwaysOnTop={true}
			Size={UDim2.fromScale(15, 20)}
			ClipsDescendants={true}
			ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
		>
			<frame
				Visible={true}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={udim2Middle}
				Size={binding.map((value) => {
					return UDim2.fromScale(value.X, value.Y);
				})}
			>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={udim2Middle}
					Size={UDim2.fromScale(0.175, 0.135)}
					Image={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEgg}
					HoverImage={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEggSelected}
					PressedImage={assetIds.images.buttons[uiTheme].specialized.openEgg.OpenEggSelected}
					Event={{
						/**
						 * Purchases eggs.
						 *
						 * @returns Nothing.
						 */
						Activated: (): void =>
							handleEggPurchase(props.store, userOwnsTripleEggs ? 3 : 1, props.eggName, props.isVoid),
					}}
				/>
				<BaseImageLabel
					Position={UDim2.fromScale(0.5, 0.675)}
					Size={UDim2.fromScale(0.4, 0.24)}
					Image={assetIds.images.backgrounds[uiTheme].AutoHatchBG}
				>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.725)}
						Size={UDim2.fromScale(0.9, 0.3)}
						Image={
							assetIds.images.buttons[uiTheme].templates.rectangular[
								props.autoHatch ? "RectangularButtonConfirmation" : "RectangularButtonWarning"
							]
						}
						HoverImage={
							assetIds.images.buttons[uiTheme].templates.rectangular[
								props.autoHatch ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
							]
						}
						PressedImage={
							assetIds.images.buttons[uiTheme].templates.rectangular[
								props.autoHatch ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
							]
						}
						Event={{
							/**
							 *
							 */
							Activated: (): void => {
								if (Players.LocalPlayer.IsInGroup(MAIN_GROUP)) {
									toggleAuto.SendToServer();
								}
							},
						}}
					>
						<BaseTextLabel
							Position={udim2Middle}
							Size={UDim2.fromScale(0.9, 0.6)}
							Text={props.autoHatch ? "On" : "Off"}
							AutomaticSize={Enum.AutomaticSize.X}
						>
							<BaseUIStroke Thickness={2.4} />
						</BaseTextLabel>
					</imagebutton>
					<BaseTextLabel Position={UDim2.fromScale(0.5, 0.425)} Size={UDim2.fromScale(0.85, 0.25)} Text={"Auto Hatch"}>
						<BaseUIStroke Thickness={2.4} />
					</BaseTextLabel>
				</BaseImageLabel>
				<BaseImageLabel
					Position={UDim2.fromScale(0.5, 0.265)}
					Size={UDim2.fromScale(0.5, 0.325)}
					Image={assetIds.images.backgrounds[uiTheme].EggPetDisplay}
				>
					<RescalingScrollingFrame
						Active={true}
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						ScrollBarThickness={0}
						Position={UDim2.fromScale(0.5, 0.42)}
						Size={UDim2.fromScale(0.9, 0.65)}
						BorderSizePixel={0}
						ScrollingDirection={Enum.ScrollingDirection.Y}
					>
						<uigridlayout
							CellSize={UDim2.fromScale(0.3, 0.48)}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						{Object.values(props.pets).map((petInfo) => {
							return (
								<PetFrame eggName={props.eggName} petId={petInfo.id} variant={props.isVoid ? "void" : "regular"} />
							);
						})}
					</RescalingScrollingFrame>
					<BaseTextLabel
						Position={UDim2.fromScale(0.5, 0.01)}
						Size={UDim2.fromScale(1, 0.1)}
						Text={props.isVoid ? `Void ${props.eggName} Egg` : `${props.eggName} Egg`}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<BaseUIStroke Thickness={2.4} />
					</BaseTextLabel>
				</BaseImageLabel>
			</frame>
		</billboardgui>
	);
}
