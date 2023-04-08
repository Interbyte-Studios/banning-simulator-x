// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { hooks } from "../../hooks";
import { BaseImageLabel } from "../baseElements/baseImageLabel";

interface DamageIconProps {
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
export const DamageIcon = hooks((props: DamageIconProps) => {
	if (typeIs(props.size, "UDim2")) {
		return (
			<BaseImageLabel
				native={{
					AnchorPoint: props.anchorPoint,
					Size: props.size,
					Position: props.position,
					Image: assetIds.images.vectors.Sword,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</BaseImageLabel>
		);
	} else {
		return (
			<BaseImageLabel
				native={{
					AnchorPoint: props.anchorPoint,
					Position: props.position,
					Image: assetIds.images.vectors.Sword,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</BaseImageLabel>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
