import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { ActiveTrade } from "./active trade";
import { InactiveTrade } from "./inactive trade";

enum TradeState {
	Idle, // Player can send, receive, and interact with the trade system
	ActiveTrade, // Player is in an active trade
}

interface TradingProps {
	isEnabled: boolean;
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

	const [tradeState, setTradeState] = useState<{
		foreignPlayer: Player | undefined;
		tradeState: TradeState;
	}>({
		foreignPlayer: undefined,
		tradeState: TradeState.Idle,
	});

	if (tradeState.tradeState === TradeState.Idle) {
		return (
			<InactiveTrade
				isEnabled={props.isEnabled}
				setForeignPlayer={(player: Player): void =>
					setTradeState({
						foreignPlayer: player,
						tradeState: TradeState.Idle,
					})
				}
				setActiveTrade={(): void => {
					setTradeState({ foreignPlayer: tradeState.foreignPlayer, tradeState: TradeState.ActiveTrade });
					props.setActiveTrade(true);
				}}
				hideMenu={props.hideMenu}
			/>
		);
	} else if (tradeState.tradeState === TradeState.ActiveTrade) {
		if (tradeState.foreignPlayer === undefined) {
			return <></>;
		}

		return (
			<ActiveTrade
				targetPlayer={tradeState.foreignPlayer}
				exitTrade={(): void => {
					setTradeState({
						foreignPlayer: undefined,
						tradeState: TradeState.Idle,
					});
					props.hideMenu();
					props.setActiveTrade(false);
				}}
			/>
		);
	}

	warn("Attempted to render an invalid trade state.");
	return <></>;
});
