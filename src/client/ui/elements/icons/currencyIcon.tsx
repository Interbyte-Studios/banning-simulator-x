// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import { Currency } from "shared/configs/currencies";

import { hooks } from "../../hooks";
import { BaseImageLabel } from "../baseElements/baseImageLabel";

interface CurrencyIconProps {
	anchorPoint?: Vector2;
	position: UDim2;
	size:
		| {
				minimizedSize: number;
				maximizedSize: number;
		  }
		| UDim2;
	currency: Currency;
}

/* eslint-disable jsdoc/require-jsdoc */
export const CurrencyIcon = hooks((props: CurrencyIconProps) => {
	const currency = getCurrencyIcon(props.currency);

	if (typeIs(props.size, "UDim2")) {
		return (
			<BaseImageLabel
				native={{
					AnchorPoint: props.anchorPoint,
					Size: props.size,
					Position: props.position,
					Image: currency,
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
					Image: currency,
				}}
				size={{ minSize: props.size.minimizedSize, maxSize: props.size.maximizedSize }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</BaseImageLabel>
		);
	}
});
/* eslint-enable jsdoc/require-jsdoc */
