import Roact from "@rbxts/roact";
import { RARITIES, Rarities } from "shared/configs/rarities";

/**
 * A ui gradient component which has its gradient colors set depending on the specified rarity.
 *
 * @param props The properties of the rarity gradient.
 * @param props.Rarity The rarity gradient to be displayed.
 * @returns A roact component.
 */
export function RarityGradient(props: { Rarity: Rarities }): Roact.Element {
	const rarityData = RARITIES[props.Rarity];
	const rarityColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.BeginningColor),
		new ColorSequenceKeypoint(1, rarityData.EndingColor),
	]);

	return <uigradient Color={rarityColorSequence} Rotation={-90} />;
}
