// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { ActiveTradeWarning } from "./tradeList/activeTradeWarning";
import { DeclinedTradeWarning } from "./tradeList/declinedTradeWarning";
import { SentTradeRequest } from "./tradeList/sentTradeRequest";
import { TradeList } from "./tradeList/tradeList";
import { TradeRequest } from "./tradeList/tradeRequest";

interface TradeListDisplayProps {
	hideMenu: () => void;
	activelyRequestingPlayer: Player | undefined;
	declineTrade: () => void;
	tradeWasDeclined: Player | undefined;
	resetTradeDeclined: () => void;
	tradeWasAccepted: Player | undefined;
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
		return <TradeRequest player={props.activelyRequestingPlayer} declineTrade={(): void => props.declineTrade()} />;
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

interface TradeProps extends TradeListDisplayProps {
	enabled: boolean;
	visible: boolean;
}

export const Trading = hooks((props: TradeProps, { useState }) => {
	if (!props.enabled || !props.visible) {
		return <></>;
	}

	const [isTrading, setIsTrading] = useState<Player | undefined>(undefined);

	if (isTrading === undefined) {
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
					tradeWasDeclined={props.tradeWasDeclined}
					resetTradeDeclined={props.resetTradeDeclined}
					tradeWasAccepted={props.tradeWasAccepted}
				/>
			</ImageLabel>
		);
	} else {
		return <></>;
	}
});
