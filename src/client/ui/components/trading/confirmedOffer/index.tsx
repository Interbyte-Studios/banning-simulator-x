import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiOffButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PlayerTradeItem } from "shared/configs/trading";

import { Offer } from "./confirmedOfferUtil/offer";

interface ConfirmedOfferProps {
	otherPlayer: Player;
	backToTrade: () => void;
	localOffer: PlayerTradeItem;
	otherOffer: PlayerTradeItem;
	finishTrade: () => void;
}

/**
 * This component is the confirmed offer section of the trade window.
 *
 * @returns A Roact element that represents the confirmed offer component.
 */
export const ConfirmedOffer = hooks((props: ConfirmedOfferProps, { useContext, useEffect, useState }) => {
	const [locallyConfirmed, setLocallyConfirmed] = useState(false);
	const [otherConfirmed, setOtherConfirmed] = useState(false);

	const { finalizedTradeDeclined, declineFinalizedTrade, finalizedTradeConfirmed, confirmFinalizedTrade } =
		useContext(remoteContext);

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	useEffect(() => {
		const connection = finalizedTradeDeclined.Connect(() => props.backToTrade());
		return (): void => connection.Disconnect();
	}, [finalizedTradeDeclined]);

	useEffect(() => {
		const connection = finalizedTradeConfirmed.Connect(() => setOtherConfirmed(true));
		return (): void => connection.Disconnect();
	}, [finalizedTradeConfirmed]);

	useEffect(() => {
		if (locallyConfirmed && otherConfirmed) {
			props.finishTrade();
		}
	}, [locallyConfirmed, otherConfirmed]);

	return (
		<>
			<BaseFrame Position={UDim2.fromScale(0.5, 0.5)} Size={UDim2.fromScale(1, 1)}>
				<Offer
					player={Players.LocalPlayer}
					offerType={"Local"}
					isConfirmed={locallyConfirmed}
					offerData={props.localOffer}
				/>
				<Offer
					player={props.otherPlayer}
					offerType={"Foreign"}
					isConfirmed={otherConfirmed}
					offerData={props.otherOffer}
				/>

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

							if (locallyConfirmed) {
								return;
							}

							setLocallyConfirmed(true);
							confirmFinalizedTrade.SendToServer();
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

							if (locallyConfirmed) {
								addAnnouncement(
									"You've already finalized the trade. You can't modify or cancel.",
									AnnouncementType.Error,
								);
								return;
							}

							setLocallyConfirmed(false);
							setOtherConfirmed(false);
							declineFinalizedTrade.SendToServer();
							props.backToTrade();
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
});
