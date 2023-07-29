import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface CoinsCurrencyProps extends CurrencyViewerMappedProps {
	position: UDim2;
	size: UDim2;
	currencyType: Currency;
}

interface CurrencyViewerMappedProps {
	currencies: CurrenciesState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): CurrencyViewerMappedProps {
	return {
		currencies: state.currencies,
	};
}

export const CurrencyViewer = RoactRodux.connect(mapStateToProps)(
	hooks((props: CoinsCurrencyProps) => {
		return (
			<ImageLabel
				native={{
					AnchorPoint: new Vector2(0, 0.5),
					Image: assetIds.images.ui.hud["viewer background"],
					Size: props.size,
					Position: props.position,
				}}
			>
				<uiaspectratioconstraint AspectRatio={4.8} />
				<CurrencyIcon
					position={UDim2.fromScale(0.075, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1.05 }}
					currency={props.currencyType}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.65, 0.9),
						Text: twoDpAbbreviator.numberToString(props.currencies[props.currencyType]),
					}}
					stroke={{
						currencyGradient: "coins",
						native: { Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) },
					}}
				/>
			</ImageLabel>
		);
	}),
);
