// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

interface BaseImageButtonProps extends Partial<WritableInstanceProperties<Frame>> {}

export const BaseFrame = hooks((props: BaseImageButtonProps) => {
	return (
		<frame
			AnchorPoint={props.AnchorPoint ?? vec2Middle}
			Position={props.Position ?? UDim2.fromScale(0.5, 0.5)}
			Size={props.Size ?? UDim2.fromScale(0.5, 0.5)}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			{...props}
		/>
	);
});
