import Roact from "@rbxts/roact";
import { getTalismanDecal } from "client/util/getTalismanDecal";
import { TalismanPhases } from "shared/configs/talismans";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface TalismanViewportProp {
	talismanId: number;
	phase: TalismanPhases;
}

/**
 * A viewport of a talisman.
 *
 * @param props The properties of the talisman viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.talismanId The id of the talisman being displayed.
 * @param props.phase The phase of the talisman being displayed.
 */
export const TalismanViewport = hooks((props: TalismanViewportProp) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.9, 0.9)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={getTalismanDecal(props.talismanId, props.phase)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
});
