import Roact from "@rbxts/roact";
import { uiDarkStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { Currency } from "shared/configs/currencies";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface CurrencyProps {
	currency: Currency;
	amount: number;
	offerType: "Local" | "Foreign";
}

/**
 * This component is used to display the currency in the confirmed offer.
 *
 * @param props The properties of the currency component.
 * @param props.currency The currency to display.
 * @param props.amount The amount of the currency to display.
 * @returns A Roact element that represents the currency component.
 */
export const ConfirmedCurrencyDisplayed = (props: CurrencyProps): Roact.Element => {
	return (
		<BaseFrame
			Position={props.offerType === "Local" ? UDim2.fromScale(0.04, 0.655) : UDim2.fromScale(0.549, 0.655)}
			Size={UDim2.fromScale(0.42, 0.09)}
			BackgroundTransparency={0}
			BackgroundColor3={uiTextStrokeColor}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />

			<SpringImageLabel
				native={{
					AnchorPoint: new Vector2(0, 0),
					Position: UDim2.fromScale(0, 0),
					Image: props.currency,
				}}
				size={{ minSize: 0.9, maxSize: 1 }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageLabel>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.583, 0.5),
					Size: UDim2.fromScale(0.769, 0.8),
					Text: statsAbbreviator.numberToString(props.amount),
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</BaseFrame>
	);
};
