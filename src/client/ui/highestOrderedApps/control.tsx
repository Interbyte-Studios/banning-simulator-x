import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { Store } from "shared/rodux";

import { Trading } from "../components/features/trading";
import { Leaderboards } from "../components/standalone/leaderboards";
import { AnnouncementContext, AnnouncementType } from "../context/AnnouncementsAPI";
import { hooks } from "../hooks";
import { remoteContext } from "../mocks/remoteContext";
import { Main } from "./main";

interface ControlProps {
	player: Player;
	store: Store;
}

/**
 * This is the highest ordered component in the game's UI.
 */
export const Control = hooks((props: ControlProps, { useState, useEffect, useContext, useValue }) => {
	const { player, store } = props;

	const [tradingEnabled, setTradingEnabled] = useState(false);
	const [tradingPlayer, setTradingPlayer] = useState<Player | undefined>(undefined);
	const [tradeActive, setActiveTrade] = useState(false);
	const [displayTradeRequest, setDisplayTradeRequest] = useState(false);

	const tradeDeclined = useValue(false);
	const tradeAccepted = useValue(false);
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	warn(`Trade Active: ${tradeActive}`);

	const {
		tradeRequestAccepted,
		tradeRequestDeclined,
		receiveTradeRequest,
		declineTradeRequest,
		tradeOfferDeclined,
		declineOffer,
	} = useContext(remoteContext);
	useEffect(() => {
		const connections = [
			tradeOfferDeclined.Connect((receivingPlayer) => {
				if (tradingPlayer === undefined) {
					throw `Received a declined trade offer from ${receivingPlayer.Name}, but the local player isn't in a trade.`;
				}

				if (tradingPlayer !== receivingPlayer) {
					throw `Received a declined trade offer from ${receivingPlayer.Name}, but the local player is trading with ${tradingPlayer.Name}.`;
				}

				addAnnouncement(`${receivingPlayer.Name} declined your trade.`, AnnouncementType.Error);

				tradeAccepted.value = false;
				tradeDeclined.value = false;
				setIsTrading(false);

				setTradingEnabled(false);
				setDisplayTradeRequest(false);
				setActiveTrade(false);
				setTradingPlayer(undefined);
			}),
			tradeRequestAccepted.Connect((receivingPlayer) => {
				if (tradingPlayer === undefined) {
					throw `Received an accepted trade request from ${receivingPlayer.Name}, but the local player isn't in a trade.`;
				}

				if (tradingPlayer !== receivingPlayer) {
					throw `Received an accepted trade request from ${receivingPlayer.Name}, but the local player is trading with ${tradingPlayer.Name}.`;
				}

				if (!ReplicatedStorage.events.trading.enabled.Value) {
					addAnnouncement(`Trading has been disabled. Try again later.`, AnnouncementType.Error);
					declineOffer.SendToServer();
					return;
				}

				addAnnouncement(`${receivingPlayer.Name} accepted your trade request.`, AnnouncementType.Announcement);

				tradeAccepted.value = false;
				tradeDeclined.value = false;
				setIsTrading(true);

				setDisplayTradeRequest(false);
				setActiveTrade(true);
				setTradingEnabled(true);
			}),
			tradeRequestDeclined.Connect((receivingPlayer) => {
				if (tradingPlayer === undefined) {
					throw `Received a declined trade request from ${receivingPlayer.Name}, but the local player isn't in a trade.`;
				}

				if (tradingPlayer !== receivingPlayer) {
					throw `Received a declined trade request from ${receivingPlayer.Name}, but the local player is trading with ${tradingPlayer.Name}.`;
				}

				addAnnouncement(`${receivingPlayer.Name} declined your trade request.`, AnnouncementType.Error);

				tradeAccepted.value = false;
				tradeDeclined.value = true;
				setIsTrading(false);

				setTradingEnabled(false);
				setDisplayTradeRequest(false);
				setActiveTrade(false);
				setTradingPlayer(undefined);
			}),
			receiveTradeRequest.Connect((playerWhoSent) => {
				if (tradeActive) {
					warn(`Received a trade request from ${playerWhoSent.Name}, but there is an active trade. `);
					return;
				}

				if (!ReplicatedStorage.events.trading.enabled.Value) {
					declineTradeRequest.SendToServer(playerWhoSent);
					declineOffer.SendToServer();
					return;
				}

				// we set trading enabled to true so that we can display only the trade request, and the player won't get distracted.
				tradeAccepted.value = false;
				tradeDeclined.value = false;
				setIsTrading(false);

				setTradingPlayer(playerWhoSent);
				setDisplayTradeRequest(true);
				setActiveTrade(false);
				setTradingEnabled(true);

				let amountWaited = 0;
				// eslint-disable-next-line no-constant-condition
				while (true) {
					if (tradeAccepted.value || tradeDeclined.value) {
						break;
					}

					amountWaited += 1;

					// we're giving an additional second here, so 11 instead of 10, specifically to let the timer in the lower component
					// catch up and update it's state.
					// if this client is faster than the other players client... the clients will become unsynced and it will result in issues.
					// in the event that this happens, implement this feature on the server instead.
					if (amountWaited === 11) {
						addAnnouncement(`You declined a trade because you too too long.`, AnnouncementType.Error);
						setIsTrading(false);

						tradeAccepted.value = false;
						tradeDeclined.value = false;

						setTradingEnabled(false);
						setDisplayTradeRequest(false);
						setActiveTrade(false);
						setTradingPlayer(undefined);
						declineTradeRequest.SendToServer(playerWhoSent);
					}
					task.wait(1);
				}
			}),
			Players.PlayerRemoving.Connect((player) => {
				if (tradingPlayer === player) {
					addAnnouncement(`The trade was cancelled because ${player.Name} left the game.`, AnnouncementType.Error);
					warn(`Player ${player.Name} left the game, cancelling the trade.`);

					setIsTrading(false);

					tradeAccepted.value = false;
					tradeDeclined.value = false;

					setTradingEnabled(false);
					setActiveTrade(false);
					setDisplayTradeRequest(false);
					setTradingPlayer(undefined);
				} else warn(`Player ${player.Name} left the game, but they weren't trading with the local player.`);
			}),
		];

		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [
		tradeRequestAccepted,
		tradeRequestDeclined,
		receiveTradeRequest,
		declineTradeRequest,
		tradeOfferDeclined,
		tradingPlayer,
		tradeActive,
	]);

	return (
		<>
			<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
				{
					<Main
						player={player}
						store={store}
						tradingEnabled={tradingEnabled}
						setTradingEnabled={(): void => setTradingEnabled(true)}
					/>
				}
			</screengui>
			<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
				<RoactRodux.StoreProvider store={store}>
					<Trading
						isEnabled={tradingEnabled}
						hideMenu={(
							dislpayAnnouncement: boolean,
							_disableActiveTrade: boolean,
							_resetForeignPlayer: boolean,
						): void => {
							if (dislpayAnnouncement) {
								addAnnouncement("The trade has either finished or been cancelled.", AnnouncementType.Announcement);
							}

							if (_resetForeignPlayer) {
								setDisplayTradeRequest(false);
								setTradingPlayer(undefined);
							}

							if (_disableActiveTrade) {
								setActiveTrade(false);
							}

							setTradingEnabled(false);
						}}
						tradingPlayer={tradingPlayer}
						setTradingPlayer={(player: Player | undefined): void => setTradingPlayer(player)}
						tradeActive={tradeActive}
						setActiveTrade={(active: boolean): void => {
							warn(`Setting active trade to ${active}`);
							tradeAccepted.value = active;
							setActiveTrade(active);
						}}
						displayTradeRequest={displayTradeRequest}
						disableTradeRequest={(): void => setDisplayTradeRequest(false)}
					/>
				</RoactRodux.StoreProvider>
			</screengui>
			<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
				<RoactRodux.StoreProvider store={store}>
					<Leaderboards />
				</RoactRodux.StoreProvider>
			</screengui>
		</>
	);
});
