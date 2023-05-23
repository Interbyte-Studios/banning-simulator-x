import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
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
	tradeMenusEnabled: boolean;
	tradeMenusVisible: boolean;
	setForeignPlayer: (player: Player) => void;
	setActiveTrade: () => void;
	hideMenu: () => void;
}

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
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	const [tradeState, setTradeState] = useState<TradeState>(TradeState.Idle);
	const [interactingPlayer, setInteractingPlayer] = useState<Player | undefined>(undefined);

	const trueTradeState = useValue(tradeState);

	/**
	 * Sends a trade request to the player.
	 *
	 * @param player The player to send the trade request to.
	 */
	const sendTrade = useCallback(
		(player: Player): void => {
			if (
				trueTradeState.value !== TradeState.Idle ||
				Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE) !== undefined
			) {
				addAnnouncement("You already have a trade active, or an outgoing request.", AnnouncementType.Error);
				return;
			}

			if (player.GetAttribute(TRADING_ATTRIBUTE) !== undefined) {
				addAnnouncement("The other player is currently in a trade.", AnnouncementType.Error);
				return;
			}

			setInteractingPlayer(player);
			setTradeState(TradeState.OutboundPending);
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
				warn(`Trade state is ${tradeState}`);
				addAnnouncement("You received a trade, but you already have a trade open.", AnnouncementType.Error);
				return;
			}

			setInteractingPlayer(player);
			setTradeState(TradeState.InboundPending);
			trueTradeState.value = TradeState.InboundPending;
			warn("Set state to inbound pending");
		},
		[tradeState],
	);

	/**
	 * A callback to accept an inbound trade request.
	 */
	const acceptTrade = useCallback((): void => {
		if (trueTradeState.value !== TradeState.InboundPending) {
			addAnnouncement("There was an issue accepting the trade. [I-3]", AnnouncementType.Error);
			return;
		}

		if (interactingPlayer === undefined) {
			setTradeState(TradeState.Idle);
			setInteractingPlayer(undefined);
			trueTradeState.value = TradeState.Idle;
			clientTradeError.SendToServer();
			return;
		}

		setTradeState(TradeState.TradeAccepted);
		trueTradeState.value = TradeState.TradeAccepted;
		acceptTradeRequest.SendToServer(interactingPlayer);
	}, [tradeState, interactingPlayer]);

	/**
	 * A callback to decline an inbound trade request.
	 */
	const declineTrade = useCallback((): void => {
		if (trueTradeState.value !== TradeState.InboundPending) {
			addAnnouncement("There was an issue declining the trade. [I-4]", AnnouncementType.Error);
			return;
		}

		if (interactingPlayer === undefined) {
			setTradeState(TradeState.Idle);
			setInteractingPlayer(undefined);
			trueTradeState.value = TradeState.Idle;
			clientTradeError.SendToServer();
			return;
		}

		setInteractingPlayer(undefined);
		setTradeState(TradeState.TradeDeclined);
		trueTradeState.value = TradeState.TradeDeclined;
		declineTradeRequest.SendToServer(interactingPlayer);
	}, [tradeState, interactingPlayer]);

	// listens to incoming remote events
	useEffect(() => {
		const receiveTradeRequestConnection = receiveTradeRequest.Connect(receiveTrade);
		const tradeRequestAcceptedConnection = tradeRequestAccepted.Connect(() => {
			addAnnouncement(`${interactingPlayer} accepted your trade request!`, AnnouncementType.Announcement);
			setTradeState(TradeState.TradeAccepted);
			trueTradeState.value = TradeState.TradeAccepted;
		});
		const tradeRequestDeclinedConnection = tradeRequestDeclined.Connect(() => setTradeState(TradeState.TradeDeclined));
		const abandonTradeAssertionConnection = abandonTradeAssertion.Connect(() => {
			addAnnouncement("Something has gone wrong with your trade. Try again later. [I:6]", AnnouncementType.Error);

			setTradeState(TradeState.Idle);
			setInteractingPlayer(undefined);
			trueTradeState.value = TradeState.Idle;
		});

		const connections = [
			receiveTradeRequestConnection,
			tradeRequestAcceptedConnection,
			tradeRequestDeclinedConnection,
			abandonTradeAssertionConnection,
		];
		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [receiveTradeRequest, tradeRequestAccepted, tradeRequestDeclined, abandonTradeAssertion, interactingPlayer]);

	useEffect(() => {
		if (interactingPlayer === undefined) {
			return;
		}

		props.setForeignPlayer(interactingPlayer);
	}, [interactingPlayer]);

	useEffect(() => {
		if (tradeState === TradeState.OutboundPending || tradeState === TradeState.InboundPending) {
			if (interactingPlayer === undefined) {
				addAnnouncement("Something has gone wrong with your trade. Try again later. [I:1]", AnnouncementType.Error);

				setTradeState(TradeState.Idle);
				setInteractingPlayer(undefined);
				clientTradeError.SendToServer();
			}
		}
	}, [tradeState]);

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
				if (!props.tradeMenusEnabled || !props.tradeMenusVisible) {
					return <></>;
				}

				elementToRender = <TradeList hideMenu={props.hideMenu} sendTrade={sendTrade} />;
				break;
			case TradeState.OutboundPending:
				if (interactingPlayer === undefined) {
					warn(`Error with ${interactingPlayer} in renderInactiveTrade() during trade state ${tradeState}.`);
					elementToRender = <></>;
				} else {
					elementToRender = (
						<SentTradeRequest
							player={interactingPlayer}
							hideMenu={(): void => setTradeState(TradeState.WanderingIdle)}
						/>
					);
				}
				break;
			case TradeState.InboundPending:
				if (interactingPlayer === undefined) {
					warn(`Error with ${interactingPlayer} in renderInactiveTrade() during trade state ${tradeState}.`);
					elementToRender = <></>;
				} else {
					elementToRender = (
						<TradeRequest player={interactingPlayer} acceptTrade={acceptTrade} declineTrade={declineTrade} />
					);
				}
				break;
			case TradeState.TradeAccepted:
				props.setActiveTrade();
				return <></>;
			case TradeState.TradeDeclined:
				elementToRender = (
					<DeclinedTradeWarning
						player={interactingPlayer ?? Players.LocalPlayer}
						hideMenu={(): void => {
							setTradeState(TradeState.Idle);
							setInteractingPlayer(undefined);
							trueTradeState.value = TradeState.Idle;
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
