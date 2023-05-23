import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiOffButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PlayerTradeItem } from "shared/configs/trading";

import { PlayerHeadshot } from "../active offer/offer";
import { Offer } from "./confirmedOfferUtil/offer";

/**
 * This component is the confirmed offer section of the trade window.
 *
 * @returns A Roact element that represents the confirmed offer component.
 */
export const FinalizedTradeOffer = hooks(
	(props: {
		local: {
			offer: PlayerTradeItem;
			confirmed: boolean;
		};
		foreign: {
			player: Player;
			offer: PlayerTradeItem;
			confirmed: boolean;
		};
		setConfirmed: (value: boolean) => void;
	}) => {
		return (
			<>
				<BaseFrame Position={UDim2.fromScale(0.5, 0.5)} Size={UDim2.fromScale(1, 1)}>
					<Offer player={Players.LocalPlayer} confirmed={props.local.confirmed} offerData={props.local.offer} />
					<Offer player={props.foreign.player} confirmed={props.foreign.confirmed} offerData={props.foreign.offer} />

					<PlayerHeadshot player={Players.LocalPlayer} />
					<PlayerHeadshot player={props.foreign.player} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.785),
							Size: UDim2.fromScale(0.96, 0.048),
							Text: "Once you click Confirm, the trade is final! You cannot undo a trade. Careful!",
						}}
						stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.615, 0.89),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.175, maxSize: 0.2 }}
						events={{
							/**
							 * When the button is clicked, confirm the offer.
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);

								if (props.local.confirmed) {
									return;
								}

								props.setConfirmed(true);
							},
						}}
					>
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Confirm",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.384, 0.89),
							Image: assetIds.images.ui.index.Off,
						}}
						size={{ minSize: 0.175, maxSize: 0.2 }}
						events={{
							/**
							 * When the button is clicked, hide the menu.
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.setConfirmed(false);
							},
						}}
					>
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Cancel",
							}}
							stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
						/>
					</SpringImageButton>
				</BaseFrame>
			</>
		);
	},
);
