import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface EnabledButtonProps extends Partial<WritableInstanceProperties<ImageButton>> {
	minimizedSize: { x: number; y: number };
	maximizedSize: { x: number; y: number };
	isEnabled: boolean;
	onClicked: () => void;
}

const springProps = {
	frequency: 5,
	dampingRatio: 0.5,
};

/**
 * A button used to change the value of a boolean.
 *
 * @param props Properties of the enable button component.
 * @param props.minimizedSize The minimum size of the component.
 * @param props.maximizedSize The maximum size of the component.
 * @param props.isEnabled The value of the boolean.
 * @param props.onPressed A function to change the value of the boolean.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EnabledButton = hooks((props: EnabledButtonProps, hooks) => {
	const { motor, binding } = useBindingMotor(hooks, { x: props.maximizedSize.x, y: props.maximizedSize.y });

	return (
		<imagebutton
			AnchorPoint={props.AnchorPoint}
			Position={props.Position}
			Size={binding.map((value) => {
				return UDim2.fromScale(value.x, value.y);
			})}
			BackgroundTransparency={1}
			Image={
				props.isEnabled ? assetIds.images.buttons["green toggle button"] : assetIds.images.buttons["red toggle button"]
			}
			Event={{
				Activated: (): void => props.onClicked(),
				MouseEnter: (): void =>
					motor.setGoal({
						x: new Flipper.Spring(props.minimizedSize.x, springProps),
						y: new Flipper.Spring(props.minimizedSize.y, springProps),
					}),
				MouseLeave: (): void =>
					motor.setGoal({
						x: new Flipper.Spring(props.maximizedSize.x, springProps),
						y: new Flipper.Spring(props.maximizedSize.y, springProps),
					}),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={props.isEnabled ? `On` : `Off`}
				Font={font}
			>
				<BSX_UIStroke
					defaultBlackColor={false}
					native={{
						Thickness: 2.5,
						Color: props.isEnabled ? Color3.fromRGB(111, 158, 113) : Color3.fromRGB(138, 92, 92),
					}}
				/>
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
