import Roact from "@rbxts/roact";
import { RANKS } from "shared/configs/ranks";

/**
 * A ui gradient component which has its gradient colors set depending on the specified rank.
 *
 * @param props The properties of the rank gradient.
 * @param props.Rank The rank to use for the gradient.
 * @returns A roact component.
 */
export function RankGradient(props: { Rank: number }): Roact.Element {
	const rarityData = RANKS.find((rank) => rank.id === props.Rank);
	assert(rarityData, `Failed to get data for rank of id: "${props.Rank}".`);

	const rarityColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.gradient.beginningColor),
		new ColorSequenceKeypoint(1, rarityData.gradient.endingColor),
	]);

	return <uigradient Color={rarityColorSequence} Rotation={-90} />;
}
