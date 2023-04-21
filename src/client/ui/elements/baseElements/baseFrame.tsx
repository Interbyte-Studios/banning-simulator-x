// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";

interface BaseFrameProps
	extends Partial<{
		// allow both the normal type and the binding variant
		[K in keyof WritableInstanceProperties<Frame>]:
			| WritableInstanceProperties<Frame>[K]
			| Roact.Binding<WritableInstanceProperties<Frame>[K]>;
	}> {}

/**
 * A base frame with preset properties.
 *
 * @param props The properties of the frame.
 * @returns A frame roact component with preset properties.
 */
export const BaseFrame = (props: Roact.PropsWithChildren<BaseFrameProps>): Roact.Element => {
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
