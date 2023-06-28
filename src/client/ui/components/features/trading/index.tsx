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
	hideMenu: () => void;

	// This "tradingPlayer" prop exists because since we only display the trading UI during an active trade,
	// it resets the tradeState in this component to default value where the trade state is idle,
	// so we need to refresh it's memory on who is being actively traded.
	tradingPlayer: Player | undefined;
	setTradingPlayer: (player: Player | undefined) => void;

	tradeActive: boolean;
	setActiveTrade: (value: boolean) => void;
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
	const { useState, useEffect } = hooks;

	const [foreignPlayer, setForeignPlayer] = useState<Player | undefined>(props.tradingPlayer);
	const [tradeState, setTradeState] = useState(props.tradeActive ? TradeState.ActiveTrade : TradeState.Idle);

	useEffect(() => {
		if (props.tradingPlayer !== foreignPlayer) {
			setForeignPlayer(props.tradingPlayer);
		}
	}, [props.tradingPlayer]);

	warn(`Rendering trade state. Foreign player: ${foreignPlayer}`);
	if (tradeState === TradeState.Idle) {
		return (
			<InactiveTrade
				isEnabled={props.isEnabled}
				foreignPlayer={foreignPlayer}
				setForeignPlayer={(player: Player): void => {
					warn(`Setting foreign player to ${player.Name}!`);
					setForeignPlayer(player);
					props.setTradingPlayer(player);
				}}
				setActiveTrade={(): void => {
					if (foreignPlayer === undefined) {
						warn(`Attempted to set active trade with undefined foreign player!`);
						return;
					}

					warn(`Setting active trade!`);
					setTradeState(TradeState.ActiveTrade);
					props.setActiveTrade(true);
				}}
				hideMenu={props.hideMenu}
			/>
		);
	} else if (tradeState === TradeState.ActiveTrade) {
		if (foreignPlayer === undefined) {
			return <></>;
		}

		return (
			<ActiveTrade
				targetPlayer={foreignPlayer}
				exitTrade={(): void => {
					setTradeState(TradeState.Idle);
					setForeignPlayer(undefined);
					props.hideMenu();
					props.setTradingPlayer(undefined);
					props.setActiveTrade(false);
				}}
			/>
		);
	}

	warn("Attempted to render an invalid trade state.");
	return <></>;
});
