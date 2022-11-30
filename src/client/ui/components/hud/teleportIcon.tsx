import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

interface TeleportIconProps extends TeleportIconMappedProps {
	displayTeleportationMenu: () => void;
}

interface TeleportIconMappedProps {
	gamepasses: GamepassesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TeleportIconMappedProps {
	return {
		gamepasses: state.gamepasses,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const TeleportIcon = RoactRodux.connect(mapStateToProps)(
	hooks((props: TeleportIconProps, { useEffect }) => {
		const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = new Flipper.SingleMotor(maximizedSize);
		const [binding, setBinding] = Roact.createBinding(motor.getValue());

		motor.onStep(setBinding);

		useEffect(() => {
			return (): void => {
				motor.destroy();
			};
		}, []);

		return (
			<imagebutton
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, value);
				})}
				Image={assetIds.images.ui.hud.icons.teleport}
				LayoutOrder={6}
				Event={{
					Activated: (): void => {
						if (props.gamepasses.Teleportation) {
							props.displayTeleportationMenu();
						} else {
							MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, GAMEPASSES.Teleportation);
						}
					},
					MouseEnter: (): void => motor.setGoal(minizmizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.9, 0.35)}
					Position={UDim2.fromScale(0.5, 1)}
					Text={"Teleport"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<uistroke Color={Color3.fromRGB(0, 108, 176)} />
				</textlabel>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
