import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { AutoDeleteState } from "shared/rodux/autoDelete";

interface EpicRarityAutoDeleteButtonMappedProps {
	autoDelete: AutoDeleteState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
/* eslint-disable jsdoc/require-jsdoc */
function mapStateToProps(state: StoreState): EpicRarityAutoDeleteButtonMappedProps {
	return {
		autoDelete: state.autoDelete,
	};
}

export const EpicRarityAutoDeleteButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: EpicRarityAutoDeleteButtonMappedProps, hooks) => {
		const maxButtonSize = 0.2;
		const minButtonSize = 0.15;

		const maximizedSpring = new Flipper.Spring(maxButtonSize, { frequency: 5 });
		const minimizedSpring = new Flipper.Spring(minButtonSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxButtonSize);

		const { useContext } = hooks;
		const { toggleAutoDelete } = useContext(remoteContext);

		return (
			<imagebutton
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.75, 0.6)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.275, value);
				})}
				Image={
					props.autoDelete.rarities.Epic
						? assetIds.images.buttons["green toggle button"]
						: assetIds.images.buttons["red toggle button"]
				}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => toggleAutoDelete.SendToServer("Epic"),
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.9, 0.45)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"Epic"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke Thickness={2.5} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
