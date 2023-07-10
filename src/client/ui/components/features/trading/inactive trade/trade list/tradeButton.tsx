import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

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
		const { useContext, useEffect, useState } = hooks;
		const [canTrade, setCanTrade] = useState(false);

		const playerStore = retrieveStore(props.player);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			const tradingEnabled = ReplicatedStorage.events.trading.enabled.Value;

			const hasPrivateTrader =
				!props.tradesEnabled || (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled);

			const hasSentTrade = Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE);
			const otherPlayerHasSentTrade = props.player.GetAttribute(TRADING_ATTRIBUTE);

			setCanTrade(
				tradingEnabled && !hasPrivateTrader && hasSentTrade === undefined && otherPlayerHasSentTrade === undefined,
			);

			const connections = [
				ReplicatedStorage.events.trading.enabled.Changed.Connect(() => {
					const tradingEnabled = ReplicatedStorage.events.trading.enabled.Value;

					const hasPrivateTrader =
						!props.tradesEnabled ||
						(playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled);

					const hasSentTrade = Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE);
					const otherPlayerHasSentTrade = props.player.GetAttribute(TRADING_ATTRIBUTE);

					setCanTrade(
						tradingEnabled && !hasPrivateTrader && hasSentTrade === undefined && otherPlayerHasSentTrade === undefined,
					);
				}),
				Players.LocalPlayer.GetAttributeChangedSignal(TRADING_ATTRIBUTE).Connect(() => {
					const tradingEnabled = ReplicatedStorage.events.trading.enabled.Value;

					const hasPrivateTrader =
						!props.tradesEnabled ||
						(playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled);

					const hasSentTrade = Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE);
					const otherPlayerHasSentTrade = props.player.GetAttribute(TRADING_ATTRIBUTE);

					setCanTrade(
						tradingEnabled && !hasPrivateTrader && hasSentTrade === undefined && otherPlayerHasSentTrade === undefined,
					);
				}),
				props.player.GetAttributeChangedSignal(TRADING_ATTRIBUTE).Connect(() => {
					const tradingEnabled = ReplicatedStorage.events.trading.enabled.Value;

					const hasPrivateTrader =
						!props.tradesEnabled ||
						(playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled);

					const hasSentTrade = Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE);
					const otherPlayerHasSentTrade = props.player.GetAttribute(TRADING_ATTRIBUTE);

					setCanTrade(
						tradingEnabled && !hasPrivateTrader && hasSentTrade === undefined && otherPlayerHasSentTrade === undefined,
					);
				}),
			];

			return (): void => connections.forEach((connection) => connection.Disconnect());
		}, [props.tradesEnabled]);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.85, 0.5),
					Image: assetIds.images.ui.index.Claim,
					ImageColor3: canTrade ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(129, 129, 129),
				}}
				size={{ maxSize: 0.7, minSize: 0.6 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						if (!props.tradesEnabled) {
							addAnnouncement("Your trades are currently disabled.", AnnouncementType.Announcement);
							return;
						}

						if (playerStore === undefined) {
							addAnnouncement("There was an issue with your trades. Please rejoin.", AnnouncementType.Error);
							return;
						}

						if (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled) {
							addAnnouncement(`${props.player.Name}'s trades are currently disabled.`, AnnouncementType.Announcement);
							return;
						}

						if (Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
							addAnnouncement("You already have a sent trade.", AnnouncementType.Announcement);
							return;
						}

						if (props.player.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
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
						TextColor3: canTrade ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(175, 175, 175),
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>
		);
	}),
);
