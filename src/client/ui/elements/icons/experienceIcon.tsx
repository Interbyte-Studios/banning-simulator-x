// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import assetIds from "shared/assets";

import { Image } from "../baseElements/image";
import { SpringImage } from "../baseElements/springImage";

interface ExperienceIconProps {
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
export const ExperienceIcon = (props: ExperienceIconProps): Roact.Element => {
	if (typeIs(props.size, "UDim2")) {
		return (
			<Image
				native={{
					AnchorPoint: props.anchorPoint,
					Size: props.size,
					Position: props.position,
					Image: assetIds.images.vectors.Experience,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</Image>
		);
	} else {
		return (
			<SpringImage
				native={{
					AnchorPoint: props.anchorPoint,
					Position: props.position,
					Image: assetIds.images.vectors.Experience,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImage>
		);
	}
};
/* eslint-enable jsdoc/require-jsdoc */
