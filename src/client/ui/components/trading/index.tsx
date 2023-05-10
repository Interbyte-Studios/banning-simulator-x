// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";

import { ActiveOffer } from "./tradeList/activeOffer";
import { ActiveTradeWarning } from "./tradeList/activeTradeWarning";
import { DeclinedTradeWarning } from "./tradeList/declinedTradeWarning";
import { SentTradeRequest } from "./tradeList/sentTradeRequest";
import { TradeList } from "./tradeList/tradeList";
import { TradeRequest } from "./tradeList/tradeRequest";

export interface PlayerTradeItem {
	/**
	 * All the IDs of pets that are on offer.
	 */
	pets: Array<string>;
	/**
	 * The currency the player has put on trade.
	 */
	currency?: {
		type: Currency;
		amount: number;
	};
}

interface TradeAcceptedProps {
	tradeWasAccepted: Player | undefined;
	resetTradeAccepted: () => void;
}

interface TradeListDisplayProps {
	hideMenu: () => void;
	activelyRequestingPlayer: Player | undefined;
	declineTrade: () => void;
	acceptTrade: () => void;
	tradeWasDeclined: Player | undefined;
	resetTradeDeclined: () => void;
}

export const TradeListDisplay = hooks((props: TradeListDisplayProps, { useState }) => {
	const [sentTradeNotification, displaySentTradeNotification] = useState<Player | undefined>(undefined);
	const [activeTrade, setActiveTrade] = useState<Player | undefined>(undefined);
	const [localActiveTrade, setLocalActiveTrade] = useState(false);

	if (sentTradeNotification) {
		return (
			<SentTradeRequest player={sentTradeNotification} hideMenu={(): void => displaySentTradeNotification(undefined)} />
		);
	} else if (props.tradeWasDeclined) {
		return <DeclinedTradeWarning player={props.tradeWasDeclined} hideMenu={(): void => props.resetTradeDeclined()} />;
	} else if (localActiveTrade) {
		return <ActiveTradeWarning player={Players.LocalPlayer} hideMenu={(): void => setActiveTrade(undefined)} />;
	} else if (props.activelyRequestingPlayer) {
		return (
			<TradeRequest
				player={props.activelyRequestingPlayer}
				declineTrade={(): void => props.declineTrade()}
				acceptTrade={props.acceptTrade}
			/>
		);
	} else if (activeTrade) {
		return <ActiveTradeWarning player={activeTrade} hideMenu={(): void => setActiveTrade(undefined)} />;
	} else {
		return (
			<TradeList
				hideMenu={props.hideMenu}
				displayTradeWarning={(player: Player): void => setActiveTrade(player)}
				displaySentRequest={(player: Player): void => displaySentTradeNotification(player)}
				displayLocalActiveTradeWarning={(): void => setLocalActiveTrade(true)}
			/>
		);
	}
});

interface TradeProps extends TradeListDisplayProps, TradeAcceptedProps {
	enabled: boolean;
	visible: boolean;
}

/**
 * A component that displays the trading menu or various trading options.
 */
export const Trading = hooks((props: TradeProps) => {
	if (!props.enabled || !props.visible) {
		return <></>;
	}

	if (props.tradeWasAccepted === undefined) {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.28, 0.4),
					Image: assetIds.images.ui.trading.playerSelection,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.2} />

				<TradeListDisplay
					hideMenu={props.hideMenu}
					activelyRequestingPlayer={props.activelyRequestingPlayer}
					declineTrade={props.declineTrade}
					acceptTrade={props.acceptTrade}
					tradeWasDeclined={props.tradeWasDeclined}
					resetTradeDeclined={props.resetTradeDeclined}
				/>
			</ImageLabel>
		);
	} else {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.7, 0.7),
					Image: assetIds.images.ui.trading.TradeBackground,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.36} />

				<ActiveOffer otherPlayer={props.tradeWasAccepted} />
			</ImageLabel>
		);
	}
});
