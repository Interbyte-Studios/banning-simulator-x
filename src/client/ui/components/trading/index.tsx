// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { ActiveTradeWarning } from "./activeTradeWarning";
import { SentTradeRequest } from "./sentTradeRequest";
import { TradeList } from "./tradeList";
import { TradeRequest } from "./tradeRequest";

interface TradeListDisplayProps {
	hideMenu: () => void;
	activelyRequestingPlayer: Player | undefined;
	declineTrade: () => void;
}

export const TradeListDisplay = hooks((props: TradeListDisplayProps, { useState }) => {
	const [sentTradeNotification, displaySentTradeNotification] = useState<Player | undefined>(undefined);
	const [activeTrade, setActiveTrade] = useState<Player | undefined>(undefined);

	if (sentTradeNotification) {
		return (
			<SentTradeRequest player={sentTradeNotification} hideMenu={(): void => displaySentTradeNotification(undefined)} />
		);
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
			/>
		);
	}
});

interface TradeProps {
	enabled: boolean;
	visible: boolean;
	hideMenu: () => void;
	activelyRequestingPlayer: Player | undefined;
	declineTrade: () => void;
}

export const Trading = hooks((props: TradeProps, { useState }) => {
	if (!props.enabled || !props.visible) {
		return <></>;
	}

	const [isTrading, setIsTrading] = useState(false);

	if (!isTrading) {
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
				/>
			</ImageLabel>
		);
	} else {
		return <></>;
	}
});
