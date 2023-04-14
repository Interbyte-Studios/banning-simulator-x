// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";

interface BaseImageButtonProps extends Partial<WritableInstanceProperties<Frame>> {}

/**
 * A base frame with preset properties.
 *
 * @param props The properties of the frame.
 * @returns A frame roact component with preset properties.
 */
export const BaseFrame = (props: Roact.PropsWithChildren<BaseImageButtonProps>): Roact.Element => {
	return (
		<frame
			AnchorPoint={props.AnchorPoint ?? vec2Middle}
			Position={props.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={props.Size ?? UDim2.fromScale(0.5, 0.5)}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			{...props}
		/>
	);
};
