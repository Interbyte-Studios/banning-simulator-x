import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { ActiveTrade } from "./active trade";
import { InactiveTrade } from "./inactive trade";

interface TradingProps {
	isEnabled: boolean;
	hideMenu: (displayAnnouncement: boolean, disableActiveTrade: boolean, resetForeignPlayer: boolean) => void;

	// This "tradingPlayer" prop exists because since we only display the trading UI during an active trade,
	// it resets the tradeState in this component to default value where the trade state is idle,
	// so we need to refresh it's memory on who is being actively traded.
	tradingPlayer: Player | undefined;
	setTradingPlayer: (player: Player | undefined) => void;

	tradeActive: boolean;
	setActiveTrade: (value: boolean) => void;

	displayTradeRequest: boolean;
	disableTradeRequest: () => void;
}

/**
 * Displays the trading UI.
 *
 * @param props The props for the component.
 * @param props.inactiveTradeMenusVisible Whether or not the inactive trade menus are visible.
 * @param props.setActiveTrade Sets whether or not the active trade menus are visible.
 * @returns The Roact element to render.
 */
export const Trading = hooks((props: TradingProps) => {
	if (props.tradeActive) {
		if (props.tradingPlayer === undefined) {
			return <></>;
		}

		return <ActiveTrade targetPlayer={props.tradingPlayer} exitTrade={(): void => props.hideMenu(true, true, true)} />;
	}

	return (
		<InactiveTrade
			isEnabled={props.isEnabled}
			tradingPlayer={props.tradingPlayer}
			setTradingPlayer={(player: Player | undefined): void => props.setTradingPlayer(player)}
			setActiveTrade={(): void => props.setActiveTrade(true)}
			hideMenu={(): void => props.hideMenu(false, false, false)}
			displayTradeRequest={props.displayTradeRequest}
			disableTradeRequest={props.disableTradeRequest}
		/>
	);
});
