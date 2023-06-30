import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { TradeList } from "./trade list";
import { SentTradeRequest } from "./trade requests/sentTradeRequest";
import { TradeRequest } from "./trade requests/tradeRequest";
import { DeclinedTradeWarning } from "./trade warnings/declinedTradeWarning";

enum TradeState {
	Idle, // Player can send trades
	WanderingIdle, // Player can't interact with any trades since they've got an open trade request, but they can still interact with the UI
	OutboundPending, // Player has sent a trade and is waiting for a response
	InboundPending, // Player has received a trade and is waiting for a response
	TradeAccepted, // Player's trade has been accepted
	TradeDeclined, // Player's trade has been declined
}

interface InactiveTradeProps {
	isEnabled: boolean;
	foreignPlayer: Player | undefined;
	setDeclinedTrade: () => void;
	setForeignPlayer: (player: Player | undefined) => void;
	setActiveTrade: () => void;
	hideMenu: () => void;
}

let inboundTradeRequest = false;

/**
 * Displays a notice that a trade has been completed.
 *
 * @returns The Roact element to render.
 */
export const InactiveTrade = hooks((props: InactiveTradeProps, hooks) => {
	const { useContext, useEffect, useState, useCallback, useValue } = hooks;
	const {
		tradeRequestAccepted,
		tradeRequestDeclined,
		acceptTradeRequest,
		declineTradeRequest,
		requestTrading,
		receiveTradeRequest,
		clientTradeError,
		abandonTradeAssertion,
	} = useContext(remoteContext);
	const [foreignPlayer, setForeignPlayer] = useState<Player | undefined>(props.foreignPlayer);
	const [tradeState, setTradeState] = useState<TradeState>(
		foreignPlayer && inboundTradeRequest
			? TradeState.InboundPending
			: foreignPlayer
			? TradeState.TradeAccepted
			: TradeState.Idle,
	);

	useEffect(() => {
		if (props.foreignPlayer !== foreignPlayer) {
			setForeignPlayer(props.foreignPlayer);
		}
	}, [props.foreignPlayer]);

	useEffect(() => {
		if (tradeState !== TradeState.InboundPending && inboundTradeRequest) {
			setTradeState(TradeState.InboundPending);
		}
	}, []);

	const trueTradeState = useValue(tradeState);
	const setTradeStateMemo = useCallback(
		(player: Player | undefined, newTradeState: TradeState, setPlayerBeforeState: boolean) => {
			if (setPlayerBeforeState) {
				if (player !== props.foreignPlayer) {
					props.setForeignPlayer(player);
					setForeignPlayer(player);
				}

				if (newTradeState !== tradeState) {
					setTradeState(newTradeState);
				}
			} else {
				if (newTradeState !== tradeState) {
					setTradeState(newTradeState);
				}

				if (player !== props.foreignPlayer) {
					props.setForeignPlayer(player);
					setForeignPlayer(player);
				}
			}
		},
		[props.foreignPlayer, tradeState],
	);

	warn(`Inactive trade rendering with trade state is ${tradeState}.`);
	/**
	 * Sends a trade request to the player.
	 *
	 * @param player The player to send the trade request to.
	 */
	const sendTrade = useCallback(
		(player: Player): void => {
			if (!ReplicatedStorage.events.trading.enabled.Value) {
				return;
			}

			if (
				trueTradeState.value !== TradeState.Idle ||
				Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE) !== undefined
			) {
				return;
			}

			if (player.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
				return;
			}

			setTradeStateMemo(player, TradeState.OutboundPending, true);
			requestTrading.SendToServer(player);
		},
		[tradeState],
	);

	/**
	 * A callback for when another player sends a trade request.
	 *
	 * @param player The player who sent the trade request.
	 */
	const receiveTrade = useCallback(
		(player: Player): void => {
			// we don't check player attributes here because when the other player created the request, the attributes were set for both players
			if (trueTradeState.value !== TradeState.Idle && trueTradeState.value !== TradeState.TradeDeclined) {
				return;
			}

			trueTradeState.value = TradeState.InboundPending;
			inboundTradeRequest = true;
			setTradeStateMemo(player, TradeState.InboundPending, true);
		},
		[tradeState],
	);

	/**
	 * A callback to accept an inbound trade request.
	 */
	const acceptTrade = useCallback((): void => {
		if (!ReplicatedStorage.events.trading.enabled.Value) {
			return;
		}

		if (trueTradeState.value !== TradeState.InboundPending) {
			return;
		}

		assert(foreignPlayer, `Failed to accept trade request from ${foreignPlayer}.`);

		trueTradeState.value = TradeState.TradeAccepted;
		inboundTradeRequest = false;
		setTradeState(TradeState.TradeAccepted);
		acceptTradeRequest.SendToServer(foreignPlayer);
		props.setActiveTrade();
	}, [tradeState, foreignPlayer]);

	/**
	 * A callback to decline an inbound trade request.
	 */
	const declineTrade = useCallback((): void => {
		if (trueTradeState.value !== TradeState.InboundPending) {
			warn(`Trade state was ${trueTradeState.value} when declining trade request.`);
			return;
		}

		if (foreignPlayer === undefined) {
			trueTradeState.value = TradeState.Idle;
			setTradeStateMemo(undefined, TradeState.Idle, false);
			clientTradeError.SendToServer();
			return;
		}

		const player = foreignPlayer;
		trueTradeState.value = TradeState.TradeDeclined;
		inboundTradeRequest = false;
		setTradeStateMemo(undefined, TradeState.TradeDeclined, true);
		props.setDeclinedTrade();
		declineTradeRequest.SendToServer(player);
	}, [tradeState, foreignPlayer]);

	// listens to incoming remote events
	useEffect(() => {
		const receiveTradeRequestConnection = receiveTradeRequest.Connect(receiveTrade);
		const tradeRequestAcceptedConnection = tradeRequestAccepted.Connect(() => {
			if (foreignPlayer === undefined) {
				return;
			}

			trueTradeState.value = TradeState.TradeAccepted;
			setTradeState(TradeState.TradeAccepted);
			props.setActiveTrade();
		});
		const tradeRequestDeclinedConnection = tradeRequestDeclined.Connect(() => {
			trueTradeState.value = TradeState.TradeDeclined;
			setTradeStateMemo(undefined, TradeState.TradeDeclined, true);
			props.setDeclinedTrade();
		});
		const abandonTradeAssertionConnection = abandonTradeAssertion.Connect(() => {
			trueTradeState.value = TradeState.Idle;
			setTradeStateMemo(undefined, TradeState.Idle, false);
		});

		const connections = [
			receiveTradeRequestConnection,
			tradeRequestAcceptedConnection,
			tradeRequestDeclinedConnection,
			abandonTradeAssertionConnection,
		];
		return (): void => connections.forEach((connection) => connection.Disconnect());
	});

	useEffect(() => {
		if (tradeState === TradeState.OutboundPending || tradeState === TradeState.InboundPending) {
			if (foreignPlayer === undefined) {
				setTradeStateMemo(undefined, TradeState.Idle, false);
				clientTradeError.SendToServer();
			}
		}

		if (tradeState === TradeState.InboundPending) {
			task.delay(10, (): void => {
				if (trueTradeState.value === TradeState.InboundPending && foreignPlayer !== undefined) {
					trueTradeState.value = TradeState.Idle;

					inboundTradeRequest = false;
					setTradeStateMemo(undefined, TradeState.Idle, true);
					declineTradeRequest.SendToServer(foreignPlayer);
				}
			});
		}
	}, [tradeState, foreignPlayer]);

	/**
	 * Decides which element to render based on the current trade state.
	 *
	 * @returns The Roact element to render.
	 */
	function renderInactiveTrade(): Roact.Element {
		let elementToRender: Roact.Element;
		switch (tradeState) {
			case TradeState.Idle:
			case TradeState.WanderingIdle:
				if (!props.isEnabled) {
					return <></>;
				}

				elementToRender = <TradeList hideMenu={props.hideMenu} sendTrade={sendTrade} />;
				break;
			case TradeState.OutboundPending:
				if (foreignPlayer === undefined) {
					return <></>;
				}

				elementToRender = (
					<SentTradeRequest player={foreignPlayer} hideMenu={(): void => setTradeState(TradeState.WanderingIdle)} />
				);
				break;
			case TradeState.InboundPending:
				if (foreignPlayer === undefined) {
					return <></>;
				}

				elementToRender = <TradeRequest player={foreignPlayer} acceptTrade={acceptTrade} declineTrade={declineTrade} />;
				break;
			case TradeState.TradeAccepted:
				return <></>;
			case TradeState.TradeDeclined:
				elementToRender = (
					<DeclinedTradeWarning
						player={foreignPlayer ?? Players.LocalPlayer}
						hideMenu={(): void => {
							trueTradeState.value = TradeState.Idle;
							setTradeStateMemo(undefined, TradeState.Idle, false);
						}}
					/>
				);
				break;
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.28, 0.4),
					Image: assetIds.images.ui.trading.playerSelection,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.2} />
				{elementToRender}
			</ImageLabel>
		);
	}

	return renderInactiveTrade();
});
