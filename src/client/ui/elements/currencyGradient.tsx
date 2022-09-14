import Roact from "@rbxts/roact";
import { Currency, CURRENCY_GRADIENTS } from "shared/configs/currencies";

/**
 * A ui gradient component which has its gradient colors set depending on the specified currency.
 *
 * @param props The properties of the currency gradient.
 * @param props.Currency The rarity currency to be displayed.
 * @returns A roact component.
 */
export function CurrencyGradient(props: { Currency: Currency }): Roact.Element {
	const rarityData = CURRENCY_GRADIENTS[props.Currency];
	const rarityColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.BeginningColor),
		new ColorSequenceKeypoint(1, rarityData.EndingColor),
	]);

	return <uigradient Color={rarityColorSequence} Rotation={-90} />;
}
