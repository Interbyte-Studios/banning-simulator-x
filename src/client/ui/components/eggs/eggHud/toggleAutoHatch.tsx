import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, Players, Workspace } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
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
export const ToggleAutoHatchButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleAutoHatchButtonProps, hooks) => {
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

					for (const [name, data] of pairs(EGGS)) {
						if (!data.hatchable) {
							continue;
						}

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
			<SpringImageButton
				native={{
					Position: props.petsSize <= 6 ? UDim2.fromScale(0.825, 0.435) : UDim2.fromScale(0.825, 0.4),
					Image: props.autoActive ? assetIds.images.buttons["green button"] : assetIds.images.buttons["red button"],
				}}
				size={{ minSize: 0.08, maxSize: 0.1 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: async (): Promise<void> => {
						playSFX(UIEngagement.MajorEngagement);
						toggleAuto.SendToServer();
					},
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(1, 1),
						Text: "R",
					}}
					stroke={{
						native: {
							Thickness: 2,
							Color: props.autoActive ? Color3.fromRGB(28, 107, 46) : Color3.fromRGB(122, 54, 133),
						},
						isBillboard: true,
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.4),
							Position: UDim2.fromScale(0.5, 0.95),
							Text: "Auto",
						}}
						stroke={{
							native: {
								Thickness: 2,
								Color: props.autoActive ? Color3.fromRGB(28, 107, 46) : Color3.fromRGB(122, 54, 133),
							},
							isBillboard: true,
						}}
					/>
				</StrokeTextLabel>
			</SpringImageButton>
		);
	}),
);
