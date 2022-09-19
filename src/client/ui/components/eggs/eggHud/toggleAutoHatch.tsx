import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { EGGS } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";

interface ToggleAutoHatchButtonProps extends ToggleAutoHatchButtonMappedProps {
	petsSize: number;
}

interface ToggleAutoHatchButtonMappedProps {
	autoActive: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): ToggleAutoHatchButtonMappedProps {
	return {
		autoActive: state.settings.gameplay.autoHatch,
	};
}

const player = Players.LocalPlayer;

/**
 * Roact imagebutton component to enable/disable auto hatch feature.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleAutoHatchButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleAutoHatchButtonProps, hooks) => {
		const maxButtonSize = 0.1;
		const minButtonSize = 0.08;

		const maximizedSpring = new Flipper.Spring(maxButtonSize, { frequency: 5 });
		const minimizedSpring = new Flipper.Spring(minButtonSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxButtonSize);

		const { useContext, useEffect } = hooks;
		const { toggleAuto } = useContext(remoteContext);

		useEffect(() => {
			ContextActionService.BindAction(
				"toggleAuto",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					const character = player.Character;
					if (character === undefined) {
						return;
					}

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					if (humanoid === undefined) {
						return;
					}

					const humanoidRootPart = humanoid.RootPart;
					if (humanoidRootPart === undefined) {
						return;
					}

					for (const [name] of pairs(EGGS)) {
						const eggFolder = Workspace.interactions.eggs[name];

						const regularEgg = eggFolder.regular.egg.PrimaryPart;
						assert(regularEgg, `Expected PrimaryPart on egg ${name}`);

						const voidEgg = eggFolder.void.egg.PrimaryPart;
						assert(voidEgg, `Expected PrimaryPart on void egg ${name}`);

						if (humanoidRootPart.Position.sub(regularEgg.Position).Magnitude < 15) {
							toggleAuto.SendToServer();
							break;
						}

						if (humanoidRootPart.Position.sub(voidEgg.Position).Magnitude < 15) {
							toggleAuto.SendToServer();
							break;
						}
					}
				},
				false,
				Enum.KeyCode.R,
			);
		});

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={props.petsSize <= 6 ? UDim2.fromScale(0.825, 0.435) : UDim2.fromScale(0.825, 0.4)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.15, value);
				})}
				Image={props.autoActive ? assetIds.images.buttons["green button"] : assetIds.images.buttons["red button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: async (): Promise<void> => toggleAuto.SendToServer(),
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"R"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<uistroke
						Color={props.autoActive ? Color3.fromRGB(28, 107, 46) : Color3.fromRGB(122, 54, 133)}
						Thickness={2}
					/>
					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(1, 0.4)}
						Position={UDim2.fromScale(0.5, 0.95)}
						Text={"Auto"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<uistroke
							Color={props.autoActive ? Color3.fromRGB(28, 107, 46) : Color3.fromRGB(122, 54, 133)}
							Thickness={2}
						/>
					</textlabel>
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
