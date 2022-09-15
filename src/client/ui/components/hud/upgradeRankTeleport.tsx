import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface UpgradeRankTeleportProps {
	position: UDim2;
	minimizedSize: number;
	maximizedSize: number;
}

/* eslint-disable jsdoc/require-jsdoc */
export const UpgradeRankTeleport = hooks((props: UpgradeRankTeleportProps, { useEffect }) => {
	const minizmizedSpring = new Flipper.Spring(props.minimizedSize, { frequency: 5 });
	const maximizedSpring = new Flipper.Spring(props.maximizedSize, { frequency: 5 });

	const motor = new Flipper.SingleMotor(props.maximizedSize);
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
			Position={props.position}
			Image={assetIds.images.ui.hud.upgrade}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				MouseEnter: (): void => motor.setGoal(minizmizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
