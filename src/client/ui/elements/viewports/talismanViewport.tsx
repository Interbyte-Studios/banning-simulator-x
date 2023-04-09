// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getTalismanDecal } from "client/util/getTalismanDecal";
import { TalismanPhases } from "shared/configs/talismans";

import { Image } from "../baseElements/image";

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
 * @returns The Roact element to render.
 */
export const TalismanViewport = (props: TalismanViewportProp): Roact.Element => {
	const talismanImage = getTalismanDecal(props.talismanId, props.phase);

	return (
		<Image
			native={{
				Size: UDim2.fromScale(0.9, 0.9),
				Position: UDim2.fromScale(0.5, 0.5),
				Image: talismanImage,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</Image>
	);
};
