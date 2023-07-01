import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
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
	const { useState, useEffect, useContext } = hooks;

	const [foreignPlayer, setForeignPlayer] = useState<Player | undefined>(props.tradingPlayer);
	const [tradeState, setTradeState] = useState(props.tradeActive ? TradeState.ActiveTrade : TradeState.Idle);

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	useEffect(() => {
		if (props.tradingPlayer !== foreignPlayer) {
			setForeignPlayer(props.tradingPlayer);
		}
	}, [props.tradingPlayer]);

	useEffect(() => {
		if (props.tradeActive) {
			setIsTrading(true);
		} else {
			setIsTrading(false);
		}
	}, [props.tradeActive]);

	useEffect(() => {
		if (!props.tradeActive) {
			return;
		}

		if (foreignPlayer === undefined) {
			return;
		}

		const connection = Players.PlayerRemoving.Connect((player) => {
			if (player.UserId === foreignPlayer?.UserId) {
				addAnnouncement("The other player has left the game.", AnnouncementType.Announcement);
				setIsTrading(false);
				setTradeState(TradeState.Idle);
				setForeignPlayer(undefined);
				props.hideMenu();
				props.setTradingPlayer(undefined);
				props.setActiveTrade(false);
			}
		});

		return (): void => connection.Disconnect();
	}, [foreignPlayer, props.tradeActive]);

	if (tradeState === TradeState.Idle) {
		return (
			<InactiveTrade
				isEnabled={props.isEnabled}
				foreignPlayer={foreignPlayer}
				setForeignPlayer={(player: Player | undefined): void => {
					setForeignPlayer(player);
					props.setTradingPlayer(player);
				}}
				setActiveTrade={(): void => {
					setTradeState(TradeState.ActiveTrade);
					props.setActiveTrade(true);
				}}
				setDeclinedTrade={(): void => setTradeState(TradeState.Idle)}
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
					addAnnouncement("The trade has either finished or been cancelled.", AnnouncementType.Announcement);
					setIsTrading(false);
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
