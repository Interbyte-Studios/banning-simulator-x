import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";

import { AnimateEggs } from "../eggHatch/animateEggs";

interface TripleHatchEggProps extends TripleHatchEggMappedProps {
	eggName: EggName;
	isVoid: boolean;
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

interface TripleHatchEggMappedProps {
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
function mapStateToProps(state: StoreState): TripleHatchEggMappedProps {
	return {
		autoActive: state.settings.gameplay.autoHatch,
		currenciesState: state.currencies,
		gamepassesState: state.gamepasses,
		petsState: state.pets,
		worldsState: state.worlds,
	};
}

/**
 * Roact imagebutton component to hatch 3 eggs.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const TripleHatchEggButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: TripleHatchEggProps, hooks) => {
		const player = Players.LocalPlayer;

		const maxButtonSize = 0.12;
		const minButtonSize = 0.1;

		const maximizedSpring = new Flipper.Spring(maxButtonSize, { frequency: 5 });
		const minimizedSpring = new Flipper.Spring(minButtonSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxButtonSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.65, 0.75)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.15, value);
				})}
				Image={assetIds.images.buttons["teal button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: async (): Promise<void> => {
						playSFX(UIEngagement.MajorEngagement);

						// eslint-disable-next-line roblox-ts/lua-truthiness
						if (!props.gamepassesState["Triple Hatch"]) {
							MarketplaceService.PromptGamePassPurchase(player, GAMEPASSES["Triple Hatch"]);
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

							RunService.BindToRenderStep("autoHatch", Enum.RenderPriority.Last.Value, async () => {
								if (!AnimateEggs.canHatchEgg()) {
									return;
								}

								const character = player.Character;
								if (character === undefined) {
									RunService.UnbindFromRenderStep("autoHatch");
									return;
								}

								const humanoid = character.FindFirstChildOfClass("Humanoid");
								if (humanoid === undefined) {
									RunService.UnbindFromRenderStep("autoHatch");
									return;
								}

								await props.initiateHatch(3, props.eggName, props.isVoid);
							});

							const movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
								RunService.UnbindFromRenderStep("autoHatch");
								movementConnection.Disconnect();
							});

							const diedConnection = humanoid.Died.Connect(() => {
								RunService.UnbindFromRenderStep("autoHatch");
								diedConnection.Disconnect();
							});
						} else {
							if (!AnimateEggs.canHatchEgg()) {
								return;
							}

							await props.initiateHatch(3, props.eggName, props.isVoid);
						}
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"T"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke
						isBillboard={true}
						native={{
							Thickness: 2,
							Color: Color3.fromRGB(54, 130, 133),
						}}
					/>
					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(1, 0.4)}
						Position={UDim2.fromScale(0.5, 0.95)}
						Text={"Triple"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke
							isBillboard={true}
							native={{
								Thickness: 2,
								Color: Color3.fromRGB(54, 130, 133),
							}}
						/>
					</textlabel>
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
