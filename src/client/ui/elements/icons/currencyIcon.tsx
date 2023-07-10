// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";

import { hooks } from "../../hooks";
import { ImageButton } from "../baseElements/imagebuttons/image";
import { SpringImageButton } from "../baseElements/imagebuttons/springImage";

interface CurrencyIconProps {
	anchorPoint?: Vector2;
	position: UDim2;
	size:
		| {
				minimizedSize: number;
				maximizedSize: number;
		  }
		| UDim2;
	currency: Currency | "robux";
	events?: Roact.JsxInstanceEvents<ImageButton>;
}

/* eslint-disable jsdoc/require-jsdoc */
export const CurrencyIcon = hooks((props: CurrencyIconProps) => {
	const currency = props.currency === "robux" ? assetIds.images.vectors.Robux : getCurrencyIcon(props.currency);

	if (typeIs(props.size, "UDim2")) {
		return (
			<ImageButton
				native={{
					AnchorPoint: props.anchorPoint,
					Size: props.size,
					Position: props.position,
					Image: currency,
				}}
				events={props.events}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</ImageButton>
		);
	} else {
		return (
			<SpringImageButton
				native={{
					AnchorPoint: props.anchorPoint,
					Position: props.position,
					Image: currency,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
				events={props.events}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageButton>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
