import Flipper from "@rbxts/flipper";
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import { canHatchEgg } from "client/eggs/canHatchEgg";
import { tryPurchaseEgg } from "client/eggs/purchaseEgg";
import { BaseImageLabel } from "client/ui/elements/baseImageLabel";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/remoteContext";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { MAIN_GROUP } from "shared/configs/game";
import { Pet } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";

import { udim2Middle, uiTheme, userOwnsTripleEggs, vec2Middle } from "../../../commonValues";
import { PetFrame } from "../../../elements/petFrame";
import { RescalingScrollingFrame } from "../../../elements/rescalingScrollingFrame";
import { AnimateEggs } from "../eggHatch/animateEggs";
import { eggHudAnimator } from "./eggHudAnimator";

const player = Players.LocalPlayer;

interface EggHudProps extends MappedEggHudProps {
	adornee: BasePart;
	eggName: EggName;
	isVoid: boolean;
	pets: Record<string, Pet>;
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

interface MappedEggHudProps {
	autoActive: boolean;
	currenciesState: CurrenciesState;
	gamepassesState: GamepassesState;
	petsState: PetsState;
	worldsState: WorldsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): MappedEggHudProps {
	return {
		autoActive: state.settings.autoHatch,
		currenciesState: state.currencies,
		gamepassesState: state.gamepasses,
		petsState: state.pets,
		worldsState: state.worlds,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EggHudDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggHudProps, { useState, useEffect, useContext }) => {
		// motor
		const motor = new Flipper.GroupMotor({
			X: 1,
			Y: 1,
		});

		const { toggleAuto } = useContext(remoteContext);

		// bindings
		const [binding, setBinding] = Roact.createBinding(motor.getValue());
		const [activelyWatching, setActivelyWatching] = useState(false);

		// bind motor to update on step && cleanup
		useEffect(() => {
			motor.onStep(setBinding);
			eggHudAnimator.addMotor(props.adornee, motor);

			return (): void => {
				motor.stop();
				eggHudAnimator.removeMotors(props.adornee);
			};
		});

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
							 */
							Activated: async (): Promise<void> => {
								if (activelyWatching) {
									return;
								}

								if (props.autoActive) {
									const character = player.Character;
									if (character === undefined) {
										return;
									}

									const humanoid = character.FindFirstChildOfClass("Humanoid");
									if (humanoid === undefined) {
										return;
									}

									setActivelyWatching(true);

									RunService.BindToRenderStep("autoHatch", Enum.RenderPriority.Last.Value, async () => {
										if (!canHatchEgg(AnimateEggs.lasHatchTime)) {
											return;
										}

										const canPurchase = tryPurchaseEgg(
											props.currenciesState,
											props.gamepassesState,
											props.petsState,
											props.worldsState,
											userOwnsTripleEggs ? 3 : 1,
											props.eggName,
											props.isVoid,
										);

										if (canPurchase) {
											await props.initiateHatch(userOwnsTripleEggs ? 3 : 1, props.eggName, props.isVoid);
										} else {
											setActivelyWatching(false);
											RunService.UnbindFromRenderStep("autoHatch");
										}
									});

									const connection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
										setActivelyWatching(false);
										RunService.UnbindFromRenderStep("autoHatch");
										connection.Disconnect();
									});
								} else {
									setActivelyWatching(true);

									const canPurchase = tryPurchaseEgg(
										props.currenciesState,
										props.gamepassesState,
										props.petsState,
										props.worldsState,
										userOwnsTripleEggs ? 3 : 1,
										props.eggName,
										props.isVoid,
									);

									if (canPurchase) {
										await props.initiateHatch(userOwnsTripleEggs ? 3 : 1, props.eggName, props.isVoid);
									} else {
										setActivelyWatching(false);
									}
								}
							},
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
									props.autoActive ? "RectangularButtonConfirmation" : "RectangularButtonWarning"
								]
							}
							HoverImage={
								assetIds.images.buttons[uiTheme].templates.rectangular[
									props.autoActive ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
								]
							}
							PressedImage={
								assetIds.images.buttons[uiTheme].templates.rectangular[
									props.autoActive ? "RectangularButtonWarning" : "RectangularButtonConfirmation"
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
								Text={props.autoActive ? "On" : "Off"}
								AutomaticSize={Enum.AutomaticSize.X}
							>
								<BaseUIStroke Thickness={2.4} />
							</BaseTextLabel>
						</imagebutton>
						<BaseTextLabel
							Position={UDim2.fromScale(0.5, 0.425)}
							Size={UDim2.fromScale(0.85, 0.25)}
							Text={"Auto Hatch"}
						>
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
	}),
);
