import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { PlayerTradeItem } from "shared/configs/trading";
import { Pet } from "shared/rodux/pets";

import { ConfirmedNotice } from "./confirmedNotice";
import { ConfirmedCurrencyDisplayed } from "./currency";

interface OfferProps {
	player: Player;
	offerType: "Local" | "Foreign";
	isConfirmed: boolean;
	offerData: PlayerTradeItem;
}

/**
 * The offer component is the component that displays the offer of the player.
 *
 * @param props The props of the component.
 * @returns The component.
 */
export const Offer = (props: OfferProps): Roact.Element => {
	const playerStore = retrieveStore(props.player);
	if (playerStore === undefined) {
		throw `Expected to get player store for player: "${props.player.Name}" | Trading Final Offer`;
	}

	const petsToDisplay: Array<Pet> = [];
	for (const pet of playerStore.getState().pets) {
		if (props.offerData.pets.includes(pet.guid)) {
			petsToDisplay.push(pet);
		}
	}

	return (
		<>
			<BaseFrame
				Position={props.offerType === "Local" ? UDim2.fromScale(0.26, 0.34) : UDim2.fromScale(0.75, 0.34)}
				Size={props.offerType === "Local" ? UDim2.fromScale(0.46, 0.57) : UDim2.fromScale(0.46, 0.57)}
				BackgroundTransparency={1}
			>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Thickness: 4, Color: uiTextStrokeColor }} />
				<VirtualScroll
					pets={petsToDisplay}
					size={UDim2.fromScale(0.98, 0.765)}
					position={UDim2.fromScale(0.508, 0.52)}
					scrollBarImageColor={Color3.fromRGB(8, 82, 129)}
					fillDirectionMaxCells={4}
				/>
				{props.isConfirmed ? <ConfirmedNotice lower={true} /> : undefined}
			</BaseFrame>
			<StrokeTextLabel
				native={{
					AnchorPoint: new Vector2(0, 0),
					Position: props.offerType === "Local" ? UDim2.fromScale(0.085, 0) : UDim2.fromScale(0.585, 0),
					Size: UDim2.fromScale(0.35, 0.1),
					Text: props.offerType === "Local" ? "Your Offer" : "Their Offer",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
			<ConfirmedCurrencyDisplayed
				currency={props.offerData.currency?.type ?? "coins"}
				amount={props.offerData.currency?.amount ?? 0}
				offerType={props.offerType}
			/>
		</>
	);
};
