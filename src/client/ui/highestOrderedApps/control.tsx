import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Lighting, Players, PolicyService, ReplicatedStorage } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { Store } from "shared/rodux";

import { Trading } from "../components/features/trading";
import { Leaderboards } from "../components/standalone/leaderboards";
import { AnnouncementContext, AnnouncementType } from "../context/AnnouncementsAPI";
import { hooks } from "../hooks";
import { remoteContext } from "../mocks/remoteContext";
import { ActiveTrial } from "./activeTrial";
import { Main } from "./main";

interface ControlProps {
	player: Player;
	store: Store;
}

/**
 * This is the highest ordered component in the game's UI.
 */
export const Control = hooks((props: ControlProps, { useState, useEffect, useContext }) => {
	const { player, store } = props;

	const [trialsEnabled, setTrialsEnabled] = useState(false);

	const [canTrade, setCanTrade] = useState(true);
	const [tradingEnabled, setTradingEnabled] = useState(false);
	const [tradingPlayer, setTradingPlayer] = useState<Player | undefined>(undefined);
	const [tradeActive, setActiveTrade] = useState(false);
	const [displayTradeRequest, setDisplayTradeRequest] = useState(false);

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	const {
		tradeRequestAccepted,
		tradeRequestDeclined,
		receiveTradeRequest,
		declineTradeRequest,
		tradeOfferDeclined,
		declineOffer,
	} = useContext(remoteContext);

	useEffect(() => {
		if (!canTrade) {
			return;
		}

		task.spawn(() => {
			const userRestrictions = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
			if (!userRestrictions.IsPaidItemTradingAllowed) {
				setCanTrade(false);
			}
		});
	}, []);

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

				setIsTrading(true);

				setDisplayTradeRequest(false);
				setActiveTrade(true);
				setTradingEnabled(true);
				addAnnouncement(`${receivingPlayer.Name} accepted your trade request.`, AnnouncementType.Announcement);
			}),
			tradeRequestDeclined.Connect((receivingPlayer) => {
				if (receivingPlayer !== Players.LocalPlayer) {
					if (tradingPlayer === undefined) {
						throw `Received a declined trade request from ${receivingPlayer.Name}, but the local player isn't in a trade.`;
					}

					if (tradingPlayer !== receivingPlayer) {
						throw `Received a declined trade request from ${receivingPlayer.Name}, but the local player is trading with ${tradingPlayer.Name}.`;
					}
				}
				setIsTrading(false);

				addAnnouncement(
					receivingPlayer === Players.LocalPlayer
						? `Trade cancelled because you took too long.`
						: `${receivingPlayer.Name} declined your trade request.`,
					AnnouncementType.Error,
				);

				setTradingEnabled(false);
				setTradingPlayer(undefined);
				setActiveTrade(false);
				setDisplayTradeRequest(false);
			}),
			receiveTradeRequest.Connect((playerWhoSent) => {
				if (tradeActive) {
					return;
				}

				if (!ReplicatedStorage.events.trading.enabled.Value) {
					declineTradeRequest.SendToServer(playerWhoSent);
					declineOffer.SendToServer();
					return;
				}

				if (!canTrade) {
					declineTradeRequest.SendToServer(playerWhoSent);
					declineOffer.SendToServer();
				}

				// we set trading enabled to true so that we can display only the trade request, and the player won't get distracted.
				setIsTrading(false);

				setTradingPlayer(playerWhoSent);
				setDisplayTradeRequest(true);
				setActiveTrade(false);
				setTradingEnabled(true);
			}),
			Players.PlayerRemoving.Connect((player) => {
				if (tradingPlayer === player) {
					setIsTrading(false);

					setTradingEnabled(false);
					setActiveTrade(false);
					setDisplayTradeRequest(false);
					setTradingPlayer(undefined);
					addAnnouncement(`The trade was cancelled because ${player.Name} left the game.`, AnnouncementType.Error);
				}
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

	if (trialsEnabled) {
		return (
			<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
				{
					<ActiveTrial
						stopTrial={(): void => {
							setTrialsEnabled(false);
							Lighting.Ambient = Color3.fromRGB(177, 177, 177);
							Lighting.ColorShift_Bottom = Color3.fromRGB(170, 255, 255);
							Lighting.ColorShift_Top = Color3.fromRGB(85, 0, 127);
							Lighting.ClockTime = store.getState().settings.visual.timeOfDay;
							Lighting.FogColor = Color3.fromRGB(0, 85, 255);
						}}
					/>
				}
			</screengui>
		);
	} else {
		return (
			<>
				<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
					{
						<Main
							player={player}
							store={store}
							tradingEnabled={tradingEnabled}
							setTradingEnabled={(): void => setTradingEnabled(true)}
							setTrialsEnabled={(value): void => setTrialsEnabled(value)}
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
								if (_resetForeignPlayer) {
									setDisplayTradeRequest(false);
									setTradingPlayer(undefined);
								}

								if (_disableActiveTrade) {
									setActiveTrade(false);
								}

								setTradingEnabled(false);
								if (dislpayAnnouncement) {
									addAnnouncement("The trade has either finished or been cancelled.", AnnouncementType.Announcement);
								}
							}}
							tradingPlayer={tradingPlayer}
							setTradingPlayer={(player: Player | undefined): void => setTradingPlayer(player)}
							tradeActive={tradeActive}
							setActiveTrade={(active: boolean): void => setActiveTrade(active)}
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
	}
});
