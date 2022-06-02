import Roact from "@rbxts/roact";
import { RARITIES, Rarities } from "shared/configs/rarities";

/* eslint-disable jsdoc/require-jsdoc */
export function RarityGradient(props: { Rarity: Rarities }): Roact.Element {
	const rarityData = RARITIES[props.Rarity];
	const rarityColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.Color1),
		new ColorSequenceKeypoint(1, rarityData.Color2),
	]);

	return <uigradient Color={rarityColorSequence} Rotation={-90} />;
}
