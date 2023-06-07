// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

import { ActiveTradeOffer } from "./offer";

/**
 * Displays the active offer.
 *
 * @param props The props for the component.
 * @param props.otherPlayer The other player in the trade.
 * @param props.resetTradeAccepted Resets the trade accepted state.
 * @returns The Roact element to render.
 */
export const ActiveOffer = hooks(
	(props: {
		local: {
			tradeOffer: PlayerTradeItem;
			confirmed: boolean;
		};
		foreign: {
			player: Player;
			tradeOffer: PlayerTradeItem;
			confirmed: boolean;
		};
		setOffer: (offerData: PlayerTradeItem) => void;
		setConfirmation: (value: boolean) => void;
		resetTrade: () => void;
	}) => {
		return (
			<BaseFrame Size={UDim2.fromScale(1, 1)}>
				<ActiveTradeOffer
					player={Players.LocalPlayer}
					currentOffer={props.local.tradeOffer}
					confirmed={props.local.confirmed}
					setOffer={props.setOffer}
					resetTrade={props.resetTrade}
				/>

				<ActiveTradeOffer
					player={props.foreign.player}
					currentOffer={props.foreign.tradeOffer}
					confirmed={props.foreign.confirmed}
					setOffer={props.setOffer}
					resetTrade={props.resetTrade}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.765, 0.755),
						Size: UDim2.fromScale(0.44, 0.1),
						Text: "All trades are final. Be careful and mindful when trading others.",
					}}
					stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.88, 0.89),
						Size: UDim2.fromScale(0.2, 0.2),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
					events={{
						/**
						 * Called when the button is activated.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.local.confirmed) {
								return;
							}

							props.setConfirmation(true);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Confirm",
						}}
						stroke={{ native: { Color: uiClaimButtonStrokeColor, Thickness: 2 } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.65, 0.89),
						Size: UDim2.fromScale(0.2, 0.2),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
					events={{
						/**
						 * Called when the button is activated.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.setConfirmation(false);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Cancel",
						}}
						stroke={{ native: { Color: uiOffButtonStrokeColor, Thickness: 2 } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	},
);
