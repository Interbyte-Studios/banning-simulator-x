import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { ActiveTradeWarning } from "./activeTradeWarning";
import { SentTradeRequest } from "./sentTradeRequest";
import { TradeList } from "./tradeList";
import { TradeRequest } from "./tradeRequest";

export const TradeListDisplay = hooks((props: { hideMenu: () => void }, { useState }) => {
	const [sentTradeNotification, displaySentTradeNotification] = useState<Player | undefined>(undefined);
	const [receivedTradeNotification, displayReceivedTradeNotification] = useState<Player | undefined>(undefined);
	const [activeTrade, setActiveTrade] = useState<Player | undefined>(undefined);

	if (sentTradeNotification) {
		return (
			<SentTradeRequest
				player={sentTradeNotification}
				hideMenu={(): void => displayReceivedTradeNotification(undefined)}
			/>
		);
	} else if (receivedTradeNotification) {
		return (
			<TradeRequest player={receivedTradeNotification} hideMenu={(): void => displaySentTradeNotification(undefined)} />
		);
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

export const Trading = hooks((props: { enabled: boolean; visible: boolean; hideMenu: () => void }, { useState }) => {
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

				<TradeListDisplay hideMenu={props.hideMenu} />
			</ImageLabel>
		);
	} else {
		return <></>;
	}
});
