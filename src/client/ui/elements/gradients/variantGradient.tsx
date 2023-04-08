import Roact from "@rbxts/roact";
import { VARIANT_GRADIENTS, Variants } from "shared/configs/pets";

/**
 * A ui gradient component which has its gradient colors set depending on the specified variant.
 *
 * @param props The properties of the rarity gradient.
 * @param props.variant The variant gradient to be displayed.
 * @returns A roact component.
 */
export function VariantGradient(props: { variant: Variants }): Roact.Element {
	const rarityData = VARIANT_GRADIENTS[props.variant];
	const rarityColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.BeginningColor),
		new ColorSequenceKeypoint(1, rarityData.EndingColor),
	]);

	return <uigradient Color={rarityColorSequence} Rotation={-90} />;
}
