import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";

interface TradeButtonProps extends TradeButtonMappedProps {
	player: Player;
	sendTrade: (player: Player) => void;
}

interface TradeButtonMappedProps {
	tradesEnabled: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TradeButtonMappedProps {
	return {
		tradesEnabled: state.settings.privacy.tradesEnabled,
	};
}

/**
 * A button that allows a player to trade with another player.
 *
 * @param props The props to render the button with.
 * @param props.player The player to trade with.
 * @param props.sendTrade A callback to send a trade to another player.
 * @returns The rendered button.
 */
export const TradeButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: TradeButtonProps, hooks) => {
		const playerStore = retrieveStore(props.player);

		const { useContext } = hooks;
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		const hasPrivateTrader =
			!props.tradesEnabled || (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled);

		const hasSentTrade = Players.LocalPlayer.GetAttribute("tradingPair");
		const otherPlayerHasSentTrade = props.player.GetAttribute("tradingPair");

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.85, 0.5),
					Image: assetIds.images.ui.index.Claim,
					ImageColor3:
						!hasPrivateTrader && hasSentTrade === undefined && otherPlayerHasSentTrade === undefined
							? Color3.fromRGB(255, 255, 255)
							: Color3.fromRGB(129, 129, 129),
				}}
				size={{ maxSize: 0.7, minSize: 0.6 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						if (!props.tradesEnabled) {
							addAnnouncement("Your trades are currently disabled.", AnnouncementType.Announcement);
							return;
						}

						if (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled) {
							addAnnouncement(`${props.player.Name}'s trades are currently disabled.`, AnnouncementType.Announcement);
							return;
						}

						if (hasSentTrade !== undefined) {
							addAnnouncement("You already have a sent trade.", AnnouncementType.Announcement);
							return;
						}

						if (otherPlayerHasSentTrade !== undefined) {
							addAnnouncement(`${props.player.Name} is in a trade.`, AnnouncementType.Announcement);
							return;
						}

						// request a sent trade
						props.sendTrade(props.player);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.5),
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Trade",
						TextColor3: !hasPrivateTrader ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(175, 175, 175),
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>
		);
	}),
);
