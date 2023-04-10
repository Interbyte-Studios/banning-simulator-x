// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { ImageLabel } from "../baseElements/imagelabels/image";
import { SpringImageLabel } from "../baseElements/imagelabels/springImage";

interface WalkSpeedIconProps {
	anchorPoint?: Vector2;
	position: UDim2;
	size:
		| {
				minimizedSize: number;
				maximizedSize: number;
		  }
		| UDim2;
}

/* eslint-disable jsdoc/require-jsdoc */
export const WalkSpeedIcon = (props: WalkSpeedIconProps): Roact.Element => {
	if (typeIs(props.size, "UDim2")) {
		return (
			<ImageLabel
				native={{
					AnchorPoint: props.anchorPoint,
					Size: props.size,
					Position: props.position,
					Image: assetIds.images.vectors.WalkSpeed,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</ImageLabel>
		);
	} else {
		return (
			<SpringImageLabel
				native={{
					AnchorPoint: props.anchorPoint,
					Position: props.position,
					Image: assetIds.images.vectors.WalkSpeed,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageLabel>
		);
	}
};
/* eslint-enable jsdoc/require-jsdoc */
