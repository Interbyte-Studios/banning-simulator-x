import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

const maximizedSize = { x: 0.238, y: 0.147 };
const minimizedSize = { x: 0.22, y: 0.13 };

const springProps = {
	frequency: 5,
	dampingRatio: 0.5,
};

interface ZonePurchaseButtonProps {
	onClick: () => void;
}

/**
 * Roact Element in zone info display to prompt zone purchase.
 *
 * @param props
 */
export const ZonePurchaseButton = hooks((props: ZonePurchaseButtonProps) => {
	// motor
	const motor = new Flipper.GroupMotor({
		x: maximizedSize.x,
		y: maximizedSize.y,
	});
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);
	return (
		<textbutton
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.9)}
			Size={binding.map((value) => {
				return UDim2.fromScale(value.x, value.y);
			})}
			AutoButtonColor={false}
			BackgroundColor3={Color3.fromRGB(167, 240, 170)}
			Event={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => props.onClick(),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => {
					motor.setGoal({
						x: new Flipper.Spring(minimizedSize.x, springProps),
						y: new Flipper.Spring(minimizedSize.y, springProps),
					});
				},

				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => {
					motor.setGoal({
						x: new Flipper.Spring(maximizedSize.x, springProps),
						y: new Flipper.Spring(maximizedSize.y, springProps),
					});
				},
			}}
		>
			<uicorner CornerRadius={new UDim(0.15, 0)} />
			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Color={Color3.fromRGB(112, 158, 113)} Thickness={3} />
			<textlabel
				Text={"Purchase"}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.8, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Font={font}
				BackgroundTransparency={1}
				TextColor3={color3White}
				TextScaled={true}
			>
				<uistroke Thickness={3} Color={Color3.fromRGB(112, 158, 113)} />
			</textlabel>
		</textbutton>
	);
});
