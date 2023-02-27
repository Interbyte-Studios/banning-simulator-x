import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";

import { RightComponentHeader } from "../util/rightComponentHeader";

interface AccoladesProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * An accolades section displaying user achievements.
 */
export const Accolades = hooks((props: AccoladesProps) => {
	return (
		<>
			<RightComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Accolades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.5)}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			></RescalingScrollingFrame>
		</>
	);
});
