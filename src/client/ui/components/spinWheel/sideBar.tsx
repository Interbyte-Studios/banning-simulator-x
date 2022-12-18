import Roact from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";

interface SpinSidebarProps {
	spinsDone: number;
	startTime: number;
	endTime: number;
	visible: boolean;
}

/**
 * Used in sidebar to show the amount of spins player has left.
 *
 * @param props The props reqruied for the element.
 * @param props.index The index number of the spin.
 * @param props.spinsDone The amount of spins the player has done.
 * @param props.endTime The time when the player spinned the wheel.
 * @returns Roact element.
 */
const SidebarSlot = hooks(
	(props: { index: number; spinsDone: number; endTime: number }, { useEffect, useState }): Roact.Element => {
		const [timer, updateTimer] = useState<number>(0);
		const spinDone = props.index <= props.spinsDone;
		const nextSpinWait = props.endTime;

		useEffect(() => {
			task.defer(() => {
				while (props.index === props.spinsDone + 1 && props.index + props.spinsDone < 7) {
					const timeNow = DateTime.now().UnixTimestamp;
					const timeRemaining = nextSpinWait - timeNow;

					updateTimer(math.clamp(timeRemaining, 0, math.huge));
					task.wait(1);

					if (timeRemaining <= 0) {
						break;
					}
				}
			});
		}, [props.endTime]);

		return (
			<frame BackgroundColor3={Color3.fromRGB(52, 190, 255)} LayoutOrder={props.index}>
				<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(11, 52, 68) }} />
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<textlabel
					Text={
						spinDone
							? "Used"
							: props.index === props.spinsDone + 1
							? timer <= 0
								? "SPIN!"
								: formatTime(timer)
							: "DO BEFORE SPIN"
					}
					Position={UDim2.fromScale(0.57, 0.5)}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.5, 0.8)}
					Font={font}
					TextScaled={true}
					TextColor3={spinDone ? Color3.fromRGB(39, 255, 89) : Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB() }} />
				</textlabel>
				<imagelabel
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Fit}
					Size={UDim2.fromScale(0.31, 1.3)}
					Position={UDim2.fromScale(0.11, 0.5)}
					AnchorPoint={vec2Middle}
					Image={"rbxassetid://11751284496"}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<imagelabel
						BackgroundTransparency={1}
						ScaleType={Enum.ScaleType.Fit}
						Size={UDim2.fromScale(0.9, 0.9)}
						Position={UDim2.fromScale(0.5, 0.5)}
						AnchorPoint={vec2Middle}
						Image={"rbxassetid://11751293075"}
					>
						<textlabel
							Text={tostring(props.index)}
							Position={UDim2.fromScale(0.48, 0.5)}
							AnchorPoint={vec2Middle}
							Size={UDim2.fromScale(0.8, 0.8)}
							Font={font}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							BackgroundTransparency={1}
						>
							<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(11, 52, 68) }} />
						</textlabel>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagelabel>
				</imagelabel>
			</frame>
		);
	},
);

export const SpinWheelSidebar = hooks((props: SpinSidebarProps, { useEffect }) => {
	const slots: Array<Roact.Element> = [];

	for (let i = 1; i < 7; i++) {
		slots.push(<SidebarSlot index={i} spinsDone={props.spinsDone} endTime={props.endTime} />);
	}

	useEffect(() => {
		slots.clear();
		for (let i = 1; i < 7; i++) {
			slots.push(<SidebarSlot index={i} spinsDone={props.spinsDone} endTime={props.endTime} />);
		}
	}, [props.spinsDone]);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={UDim2.fromScale(0.167, 0.612)}
			Position={UDim2.fromScale(0.22, 0.52)}
			ClipsDescendants={true}
			BackgroundColor3={Color3.fromRGB(52, 190, 255)}
			Visible={props.visible}
		>
			<uiaspectratioconstraint AspectRatio={0.55} />
			<BaseUIStroke native={{ Thickness: 4, Color: Color3.fromRGB(11, 52, 68) }} />
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} ClipsDescendants={false}>
				{slots}
				<uipadding PaddingTop={new UDim(0.04, 0)} PaddingBottom={new UDim(0.04, 0)} />
				<uigridlayout
					CellSize={UDim2.fromScale(0.85, 0.12)}
					CellPadding={UDim2.fromScale(0, 0.058)}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
			</frame>
		</frame>
	);
});
