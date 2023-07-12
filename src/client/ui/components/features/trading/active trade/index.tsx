import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { PlayerTradeItem } from "shared/configs/trading";

import { CompletedTradeNotice } from "../inactive trade/trade warnings/completedTrade";
import { ActiveOffer } from "./active offer";
import { FinalizedTradeOffer } from "./finalized offer";

enum TradeState {
	Offering,
	ViewingFinalizedOffer,
	Completed,
}

const defaultOffer: PlayerTradeItem = {
	pets: [],
	currency: {
		type: "coins",
		amount: 0,
	},
};

/**
 * Highest order component for active trades.
 */
export const ActiveTrade = hooks((props: { targetPlayer: Player; exitTrade: () => void }, hooks) => {
	const { useState, useContext, useEffect } = hooks;
	const {
		modifyOffer,
		confirmOffer,
		declineOffer,
		confirmFinalizedTrade,
		declineFinalizedTrade,
		offerChanged,
		tradeOfferConfirmed,
		tradeOfferDeclined,
		finalizedTradeConfirmed,
		finalizedTradeDeclined,
	} = useContext(remoteContext);
	// manages the state of the active trade
	const [tradeState, setTradeState] = useState<TradeState>(TradeState.Offering);

	// state to cache trade offers
	const [localOffer, setLocalOffer] = useState<PlayerTradeItem>(defaultOffer);
	const [foreignOffer, setForeignOffer] = useState<PlayerTradeItem>(defaultOffer);

	// state that logs a player's offer confirmation status
	const [localReady, setLocalReady] = useState(false);
	const [foreignReady, setForeignReady] = useState(false);
	const [canReady, setCanReady] = useState(false);

	// state that logs a player's final offer confirmation statusghfjdkslghvd
	const [localConfirmed, setLocalConfirmed] = useState(false);
	const [foreignConfirmed, setForeignConfirmed] = useState(false);

	/**
	 * Sets the local offer.
	 *
	 * @param offerData The offer data to get the offer from.
	 */
	function setOffer(offerData: PlayerTradeItem): void {
		setLocalOffer(offerData);
		setLocalReady(false);
		setForeignReady(false);
		modifyOffer.SendToServer(offerData);
	}

	/**
	 * Registers the player as ready to view over the finalized trade.
	 */
	function setReady(): void {
		setLocalReady(true);

		if (foreignReady) {
			setTradeState(TradeState.ViewingFinalizedOffer);
		}

		confirmOffer.SendToServer();
	}

	/**
	 * Declines the finalized trade.
	 */
	function declineTradeOffer(): void {
		declineOffer.SendToServer();
		props.exitTrade();

		setLocalOffer(defaultOffer);
		setForeignOffer(defaultOffer);

		setLocalReady(false);
		setForeignReady(false);

		setLocalConfirmed(false);
		setForeignConfirmed(false);
	}

	/**
	 * Confirms the finalized trade.
	 */
	function setFinalConfirmation(): void {
		setLocalConfirmed(true);

		if (foreignConfirmed) {
			setTradeState(TradeState.Completed);
		}

		confirmFinalizedTrade.SendToServer();
	}

	/**
	 * Declines the finalized offer, sending both players back to the offer window.
	 */
	function declineFinalConfirmation(): void {
		setLocalReady(false);
		setForeignReady(false);

		setLocalConfirmed(false);
		setForeignConfirmed(false);

		setTradeState(TradeState.Offering);
		declineFinalizedTrade.SendToServer();
	}

	/**
	 * Completes the trade, removing both players from the trade.
	 */
	function finishTrade(): void {
		setLocalOffer(defaultOffer);
		setForeignOffer(defaultOffer);

		setLocalReady(false);
		setForeignReady(false);

		setLocalConfirmed(false);
		setForeignConfirmed(false);

		setTradeState(TradeState.Offering);
		props.exitTrade();
	}

	/**
	 * Determines which element to render based on the current trade state.
	 *
	 * @returns The Roact element to render.
	 */
	function renderActiveTradeUI(): Roact.Element {
		switch (tradeState) {
			case TradeState.Offering:
				return (
					<ActiveOffer
						local={{
							tradeOffer: localOffer,
							confirmed: localReady,
						}}
						foreign={{
							player: props.targetPlayer,
							tradeOffer: foreignOffer,
							confirmed: foreignReady,
						}}
						setOffer={(offerData: PlayerTradeItem): void => {
							setOffer(offerData);
							setCanReady(false);

							if (localReady) {
								setLocalReady(false);
							}

							if (foreignReady) {
								setForeignReady(false);
							}

							if (localConfirmed) {
								setLocalConfirmed(false);
							}

							if (foreignConfirmed) {
								setForeignConfirmed(false);
							}

							if (tradeState !== TradeState.Offering) {
								setTradeState(TradeState.Offering);
							}
						}}
						setConfirmation={(value: boolean): void => {
							if (value) {
								if (!canReady) {
									return;
								}

								setReady();
							} else {
								declineTradeOffer();
							}
						}}
						resetTrade={(): void => {
							finishTrade();
							props.exitTrade();
						}}
					/>
				);
			case TradeState.ViewingFinalizedOffer:
				return (
					<FinalizedTradeOffer
						local={{
							offer: localOffer,
							confirmed: localConfirmed,
						}}
						foreign={{
							player: props.targetPlayer,
							offer: foreignOffer,
							confirmed: foreignConfirmed,
						}}
						setConfirmed={(value): void => {
							if (value) {
								setFinalConfirmation();
							} else {
								declineFinalConfirmation();
							}
						}}
						resetTrade={(): void => {
							finishTrade();
							props.exitTrade();
						}}
					/>
				);
			case TradeState.Completed:
				return (
					<CompletedTradeNotice
						finishTrade={(): void => {
							setIsTrading(false);
							finishTrade();
							props.exitTrade();
						}}
					/>
				);
		}
	}

	/**
	 * Evaluates an evaluated offer against an origin offer.
	 *
	 * @param originOffer The origin offer.
	 * @param evaluatedOffer The offer to evaluate.
	 * @returns Whether or not the evaluated offer is valid.
	 */
	function evaluateOffers(originOffer: PlayerTradeItem, evaluatedOffer: PlayerTradeItem): boolean {
		if (originOffer.currency !== undefined) {
			if (evaluatedOffer.currency === undefined) {
				return false;
			}

			if (originOffer.currency.type !== evaluatedOffer.currency.type) {
				return false;
			}

			if (originOffer.currency.amount !== evaluatedOffer.currency.amount) {
				return false;
			}
		} else {
			if (evaluatedOffer.currency !== undefined) {
				return false;
			}
		}

		if (originOffer.pets.size() !== evaluatedOffer.pets.size()) {
			return false;
		}

		for (const pet of originOffer.pets) {
			if (!evaluatedOffer.pets.includes(pet)) {
				return false;
			}
		}

		return true;
	}

	// listens to incoming remotes
	useEffect(() => {
		const offerChangedConnection = offerChanged.Connect((player: Player, newOffer: PlayerTradeItem) => {
			if (player.UserId === Players.LocalPlayer.UserId) {
				setLocalOffer(newOffer);
			} else if (player.UserId === props.targetPlayer.UserId) {
				setForeignOffer(newOffer);
			}

			if (localReady) {
				setLocalReady(false);
			}

			if (foreignReady) {
				setForeignReady(false);
			}

			if (localConfirmed) {
				setLocalConfirmed(false);
			}

			if (foreignConfirmed) {
				setForeignConfirmed(false);
			}

			if (tradeState !== TradeState.Offering) {
				setTradeState(TradeState.Offering);
			}

			setCanReady(true);
		});

		const tradeOfferConfirmedConnection = tradeOfferConfirmed.Connect(
			(player: Player, confirmedOffer: PlayerTradeItem) => {
				print(`${player.UserId} has confirmed offer`);
				if (player.UserId === Players.LocalPlayer.UserId) {
					warn(`Received trade offer confirmed remote from local player. This should never happen.`);
					return;
				} else if (player.UserId === props.targetPlayer.UserId) {
					if (!evaluateOffers(foreignOffer, confirmedOffer)) {
						setForeignOffer(confirmedOffer);
					}
					setForeignReady(true);
				}
			},
		);

		const tradeOfferDeclinedConnection = tradeOfferDeclined.Connect((player: Player) => {
			if (player.UserId === Players.LocalPlayer.UserId) {
				warn(`Received trade offer declined remote from local player. This should never happen.`);
				return;
			} else if (player.UserId === props.targetPlayer.UserId) {
				props.exitTrade();

				setLocalOffer(defaultOffer);
				setForeignOffer(defaultOffer);

				setLocalReady(false);
				setForeignReady(false);

				setLocalConfirmed(false);
				setForeignConfirmed(false);

				setTradeState(TradeState.Offering);
			} else {
				warn(`Received trade offer declined remote from unknown player. This should never happen.`);
				return;
			}
		});

		const finalizedTradeConfirmedConnection = finalizedTradeConfirmed.Connect(
			(player: Player, finalizedOffer: PlayerTradeItem) => {
				if (player.UserId === Players.LocalPlayer.UserId) {
					warn(`Received finalized trade confirmed remote from local player. This should never happen.`);
					return;
				} else if (player.UserId === props.targetPlayer.UserId) {
					if (!evaluateOffers(foreignOffer, finalizedOffer)) {
						setForeignOffer(finalizedOffer);
					}
					setForeignConfirmed(true);
				}
			},
		);

		const finalizedTradeDeclinedConnection = finalizedTradeDeclined.Connect((player: Player) => {
			if (player.UserId === Players.LocalPlayer.UserId) {
				warn(`Received finalized trade declined remote from local player. This should never happen.`);
				return;
			} else if (player.UserId === props.targetPlayer.UserId) {
				setLocalReady(false);
				setForeignReady(false);

				setLocalConfirmed(false);
				setForeignConfirmed(false);

				setTradeState(TradeState.Offering);
			} else {
				warn(`Received finalized trade declined remote from unknown player. This should never happen.`);
				return;
			}
		});

		const connections: Array<RBXScriptConnection> = [
			offerChangedConnection,
			tradeOfferConfirmedConnection,
			tradeOfferDeclinedConnection,
			finalizedTradeConfirmedConnection,
			finalizedTradeDeclinedConnection,
		];
		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [
		offerChanged,
		tradeOfferConfirmed,
		tradeOfferDeclined,
		finalizedTradeConfirmed,
		finalizedTradeDeclined,
		localOffer,
		foreignOffer,
		localReady,
		foreignReady,
		localConfirmed,
		foreignConfirmed,
		tradeState,
	]);

	// Properly respond to ready state changes
	useEffect(() => {
		if (localReady && foreignReady) {
			setTradeState(TradeState.ViewingFinalizedOffer);
		}
	}, [localReady, foreignReady]);

	// Properly respond to confirm state changes
	useEffect(() => {
		if (localConfirmed && foreignConfirmed) {
			setTradeState(TradeState.Completed);
		}
	}, [localConfirmed, foreignConfirmed]);

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.7, 0.7),
				Image: assetIds.images.ui.trading.TradeBackground,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1.36} />
			{renderActiveTradeUI()}
		</ImageLabel>
	);
});
