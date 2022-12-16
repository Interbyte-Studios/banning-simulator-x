import Roact from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";

interface SpinWheelTextProps {
	startTime: number;
	endTime: number;
	dayEndTime: number;
	spins: number;
}

export const SpinWheelTopText = hooks((props: SpinWheelTextProps, { useState, useEffect }) => {
	const [timer, updateTimer] = useState<number>(0);

	useEffect(() => {
		task.defer(() => {
			while (props.spins > 0) {
				const timeNow = DateTime.now().UnixTimestamp;

				if (props.spins === 6) {
					const timeEnded = props.dayEndTime - timeNow;
					updateTimer(math.clamp(timeEnded, 0, math.huge));

					if (timeEnded <= 0) {
						break;
					}
				} else {
					const timeEnded = props.endTime - timeNow;
					updateTimer(math.clamp(timeEnded, 0, math.huge));

					if (timeEnded <= 0) {
						break;
					}
				}

				task.wait(1);
			}
		});
	}, [props.spins, props.startTime]);

	return (
		<textlabel
			Key={"TIMER"}
			Text={
				props.spins === 6
					? `Wait ${formatTime(timer)} to spin again.`
					: timer === 0
					? `SPIN!`
					: `${formatTime(timer)} For next spin`
			}
			Position={UDim2.fromScale(0.5, 0.07)}
			AnchorPoint={vec2Middle}
			Size={UDim2.fromOffset(500, 60)}
			TextColor3={color3White}
			TextScaled={true}
			Font={font}
			BackgroundTransparency={1}
		>
			<uistroke Thickness={4} Color={Color3.fromRGB(11, 52, 68)} />
		</textlabel>
	);
});
