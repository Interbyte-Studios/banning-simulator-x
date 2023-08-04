import Roact from "@rbxts/roact";

import { BaseFrame } from "../baseElements/baseFrame";
import { BaseUIStroke } from "../baseElements/baseUIStroke";
import { StrokeTextLabel } from "../baseElements/textlabels/strokeTextLabel";

/**
 * Notification component.
 *
 * @param props Component props.
 * @param props.position Position of the notification.
 * @param props.size Size of the notification.
 * @param props.amount Amount of notifications.
 * @returns Notification component.
 */
export const Notification = (props: { position: UDim2; size: UDim2; amount: number }): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			Position={props.position}
			Size={props.size}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<uigradient
				Rotation={90}
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(255, 152, 154)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(255, 61, 64)),
					])
				}
			/>
			<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(156, 48, 50) }} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.7, 0.7),
					Text: tostring(props.amount),
				}}
				stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(112, 34, 37) } }}
			/>
		</BaseFrame>
	);
};
