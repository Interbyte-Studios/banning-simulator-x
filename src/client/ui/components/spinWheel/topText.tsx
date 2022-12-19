import Roact from "@rbxts/roact";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";

interface SpinWheelTextProps {
	startTime: number;
	endTime: number;
	dayEndTime: number;
	spins: number;
}

export const SpinWheelTopText = hooks((props: SpinWheelTextProps, { useState, useEffect, useValue }) => {
	const [timer, updateTimer] = useState<number>(0);

	const mounted = useValue(false);
	useEffect(() => {
		mounted.value = true;

		return (): void => {
			mounted.value = false;
		};
	}, []);

	useEffect(() => {
		task.defer(() => {
			while (props.spins > 0) {
				if (!mounted.value) {
					task.wait();
					continue;
				}

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
			Text={
				props.spins === 6
					? `Wait ${formatTime(timer)} to spin again.`
					: timer === 0
					? `SPIN!`
					: `${formatTime(timer)} For next spin`
			}
			Position={UDim2.fromScale(0.5, 0.18)}
			AnchorPoint={vec2Middle}
			Size={UDim2.fromScale(0.8, 0.1)}
			TextColor3={color3White}
			TextScaled={true}
			Font={font}
			BackgroundTransparency={1}
		>
			<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(11, 52, 68) }} />
		</textlabel>
	);
});
