import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { TradeList } from "./trade list";
import { SentTradeRequest } from "./trade requests/sentTradeRequest";
import { TradeRequest } from "./trade requests/tradeRequest";

interface InactiveTradeProps {
	isEnabled: boolean;
	hideMenu: () => void;

	tradingPlayer: Player | undefined;
	setTradingPlayer: (player: Player | undefined) => void;

	setActiveTrade: () => void;

	displayTradeRequest: boolean;
	disableTradeRequest: () => void;
}

/**
 * Displays a notice that a trade has been completed.
 *
 * @returns The Roact element to render.
 */
export const InactiveTrade = hooks((props: InactiveTradeProps, hooks) => {
	const { useContext, useState, useEffect } = hooks;

	const [displaySendTradeRequest, setDisplaySentTradeRequest] = useState<Player | undefined>(undefined);
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	const { acceptTradeRequest, declineTradeRequest, requestTrading, tradeRequestDeclined } = useContext(remoteContext);

	useEffect(() => {
		const connection = tradeRequestDeclined.Connect((player) => {
			if (player === props.tradingPlayer) {
				setDisplaySentTradeRequest(undefined);
			}
		});

		return (): void => connection.Disconnect();
	}, [tradeRequestDeclined, props.tradingPlayer]);

	if (!props.isEnabled) {
		return <></>;
	} else {
		let elementToRender: Roact.Element | undefined;

		if (displaySendTradeRequest !== undefined) {
			elementToRender = (
				<SentTradeRequest
					player={displaySendTradeRequest}
					hideMenu={(): void => setDisplaySentTradeRequest(undefined)}
				/>
			);
		} else if (props.displayTradeRequest) {
			if (props.tradingPlayer === undefined) {
				throw `Attempted to render a trade request, but the trading player is undefined.`;
			}

			elementToRender = (
				<TradeRequest
					player={props.tradingPlayer}
					acceptTrade={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading has been disabled. Rejoin.`, AnnouncementType.Error);
							return;
						}

						if (props.tradingPlayer === undefined) {
							throw `Attempted to accept a trade request, but the trading player is undefined.`;
						}

						acceptTradeRequest.SendToServer(props.tradingPlayer);
						setIsTrading(true);
						props.setActiveTrade();
					}}
					declineTrade={(): void => {
						if (props.tradingPlayer === undefined) {
							throw `Attempted to decline a trade request, but the trading player is undefined.`;
						}

						declineTradeRequest.SendToServer(props.tradingPlayer);
						setIsTrading(false);
						props.disableTradeRequest();
						props.setTradingPlayer(undefined);
						addAnnouncement(`You declined ${props.tradingPlayer}'s trade request.`, AnnouncementType.Error);
					}}
				/>
			);
		} else {
			elementToRender = (
				<TradeList
					sendTrade={(player: Player): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement("Trading is currently disabled.", AnnouncementType.Error);
							return;
						}

						if (Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
							addAnnouncement(`You already have an outgoing trade. Please wait.`, AnnouncementType.Error);
							return;
						}

						if (player.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
							addAnnouncement(`That player is already in a trade. Please wait.`, AnnouncementType.Error);
							return;
						}

						setDisplaySentTradeRequest(player);
						props.setTradingPlayer(player);
						requestTrading.SendToServer(player);
					}}
					hideMenu={props.hideMenu}
				/>
			);
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.28, 0.4),
					Image: assetIds.images.ui.trading.playerSelection,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.2} />
				{elementToRender}
			</ImageLabel>
		);
	}
});
