// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getRankIcon } from "client/util/getRankIcon";

import { hooks } from "../../hooks";
import { ImageLabel } from "../baseElements/imagelabels/image";
import { SpringImageLabel } from "../baseElements/imagelabels/springImage";

interface RankIconProps {
	position: UDim2;
	size:
		| {
				minimizedSize: number;
				maximizedSize: number;
		  }
		| UDim2;
	rank: number;
}

/* eslint-disable jsdoc/require-jsdoc */
export const RankIcon = hooks((props: RankIconProps) => {
	const rank = getRankIcon(props.rank);

	if (typeIs(props.size, "UDim2")) {
		return (
			<ImageLabel
				native={{
					Size: props.size,
					Position: props.position,
					Image: rank,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</ImageLabel>
		);
	} else {
		return (
			<SpringImageLabel
				native={{
					Position: props.position,
					Image: rank,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageLabel>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
