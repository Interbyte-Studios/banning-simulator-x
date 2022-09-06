import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { getRankIcon } from "client/util/getRankIcon";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface RankIconProps {
	position: UDim2;
	size:
		| {
				minimizedSize: number;
				maximizedSize: number;
		  }
		| UDim2;
	rank: number;
}

/* eslint-disable jsdoc/require-jsdoc */
export const RankIcon = hooks((props: RankIconProps, { useEffect }) => {
	const rank = getRankIcon(props.rank);

	if (typeIs(props.size, "UDim2")) {
		return (
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={props.size}
				Position={props.position}
				Image={rank}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
		);
	} else {
		const minizmizedSpring = new Flipper.Spring(props.size.minimizedSize, { frequency: 5 });
		const maximizedSpring = new Flipper.Spring(props.size.maximizedSize, { frequency: 5 });

		const motor = new Flipper.SingleMotor(props.size.maximizedSize);
		const [binding, setBinding] = Roact.createBinding(motor.getValue());

		motor.onStep(setBinding);

		useEffect(() => {
			return (): void => {
				motor.destroy();
			};
		}, []);

		return (
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, value);
				})}
				Position={props.position}
				Image={rank}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					MouseEnter: (): void => motor.setGoal(minizmizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
