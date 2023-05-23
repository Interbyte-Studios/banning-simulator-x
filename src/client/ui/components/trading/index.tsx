import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { ActiveTrade } from "./active trade";
import { InactiveTrade } from "./inactive trade";

enum TradeState {
	Idle, // Player can send, receive, and interact with the trade system
	ActiveTrade, // Player is in an active trade
}

interface TradingProps {
	tradeMenusEnabled: boolean;
	tradeMenusVisible: boolean;
	setActiveTrade: (value: boolean) => void;
	hideMenu: () => void;
}

/**
 * Displays the trading UI.
 *
 * @param props The props for the component.
 * @param props.inactiveTradeMenusVisible Whether or not the inactive trade menus are visible.
 * @param props.setActiveTrade Sets whether or not the active trade menus are visible.
 * @returns The Roact element to render.
 */
export const Trading = hooks((props: TradingProps, hooks) => {
	const { useState } = hooks;

	const [foreignPlayer, setForeignPlayer] = useState<Player | undefined>(undefined);
	const [tradeState, setTradeState] = useState<TradeState>(TradeState.Idle);

	if (tradeState === TradeState.Idle) {
		return (
			<InactiveTrade
				tradeMenusEnabled={props.tradeMenusEnabled}
				tradeMenusVisible={props.tradeMenusVisible}
				setForeignPlayer={setForeignPlayer}
				setActiveTrade={(): void => {
					setTradeState(TradeState.ActiveTrade);
					props.setActiveTrade(true);
				}}
				hideMenu={props.hideMenu}
			/>
		);
	} else if (tradeState === TradeState.ActiveTrade) {
		if (foreignPlayer === undefined) {
			warn(`Attempted to render active trade without a foreign player.`);
			return <></>;
		}

		return (
			<ActiveTrade
				targetPlayer={foreignPlayer}
				exitTrade={(): void => {
					setForeignPlayer(undefined);
					setTradeState(TradeState.Idle);
					props.setActiveTrade(false);
				}}
			/>
		);
	}

	warn("Attempted to render an invalid trade state.");
	return <></>;
});
