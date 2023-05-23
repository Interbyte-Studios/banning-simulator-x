import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
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
		abandonTradeAssertion,
		clientTradeError,
	} = useContext(remoteContext);
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	// manages the state of the active trade
	const [tradeState, setTradeState] = useState<TradeState>(TradeState.Offering);

	// state to cache trade offers
	const [localOffer, setLocalOffer] = useState<PlayerTradeItem>(defaultOffer);
	const [foreignOffer, setForeignOffer] = useState<PlayerTradeItem>(defaultOffer);

	// state that logs a player's offer confirmation status
	const [localReady, setLocalReady] = useState(false);
	const [foreignReady, setForeignReady] = useState(false);

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
		addAnnouncement(`You have cancelled your trade with ${props.targetPlayer.Name}.`, AnnouncementType.Announcement);

		setLocalOffer(defaultOffer);
		setForeignOffer(defaultOffer);

		setLocalReady(false);
		setForeignReady(false);

		setLocalConfirmed(false);
		setForeignConfirmed(false);

		declineOffer.SendToServer();
		props.exitTrade();
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
						setOffer={setOffer}
						setConfirmation={(value: boolean): void => {
							if (value) {
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
					/>
				);
			case TradeState.Completed:
				return <CompletedTradeNotice finishTrade={(): void => finishTrade()} />;
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
				addAnnouncement(`There was an issue. Your trade offer has been updated.`, AnnouncementType.Announcement);
				setLocalOffer(newOffer);
			} else if (player.UserId === props.targetPlayer.UserId) {
				warn(
					`Received offer changed | Currency Type: ${newOffer.currency?.type} | Currency Amount: ${newOffer.currency?.amount}`,
				);
				setForeignOffer(newOffer);
				setLocalReady(false);
				setForeignReady(false);
			} else {
				addAnnouncement(`There was an error with the trade. Try again later. [I-9]`, AnnouncementType.Error);

				setLocalOffer(defaultOffer);
				setForeignOffer(defaultOffer);

				setLocalReady(false);
				setForeignReady(false);

				setLocalConfirmed(false);
				setForeignConfirmed(false);

				setTradeState(TradeState.Offering);

				props.exitTrade();

				clientTradeError.SendToServer();
				return;
			}

			setLocalReady(false);
			setForeignReady(false);
		});

		const tradeOfferConfirmedConnection = tradeOfferConfirmed.Connect(
			(player: Player, confirmedOffer: PlayerTradeItem) => {
				if (player.UserId === Players.LocalPlayer.UserId) {
					warn(`Received trade offer confirmed remote from local player. This should never happen.`);
					return;
				} else if (player.UserId === props.targetPlayer.UserId) {
					warn("Received Offer Confirmation");

					setForeignReady(true);

					if (!evaluateOffers(foreignOffer, confirmedOffer)) {
						addAnnouncement(
							`${props.targetPlayer.Name}'s trade was innacurate, and has been updated.`,
							AnnouncementType.Announcement,
						);
						setForeignOffer(confirmedOffer);
					}

					if (localReady) {
						setTradeState(TradeState.ViewingFinalizedOffer);
					}
				} else {
					addAnnouncement(`There was an error with the trade. Try again later. [I-10]`, AnnouncementType.Error);

					setLocalOffer(defaultOffer);
					setForeignOffer(defaultOffer);

					setLocalReady(false);
					setForeignReady(false);

					setLocalConfirmed(false);
					setForeignConfirmed(false);

					setTradeState(TradeState.Offering);

					props.exitTrade();

					clientTradeError.SendToServer();
					return;
				}
			},
		);

		const tradeOfferDeclinedConnection = tradeOfferDeclined.Connect((player: Player) => {
			if (player.UserId === Players.LocalPlayer.UserId) {
				warn(`Received trade offer declined remote from local player. This should never happen.`);
				return;
			} else if (player.UserId === props.targetPlayer.UserId) {
				addAnnouncement(`${props.targetPlayer.Name} has cancelled the trade.`, AnnouncementType.Announcement);

				setLocalOffer(defaultOffer);
				setForeignOffer(defaultOffer);

				setLocalReady(false);
				setForeignReady(false);

				setLocalConfirmed(false);
				setForeignConfirmed(false);

				setTradeState(TradeState.Offering);

				props.exitTrade();
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
					setForeignConfirmed(true);

					if (!evaluateOffers(foreignOffer, finalizedOffer)) {
						addAnnouncement(
							`${props.targetPlayer.Name}'s trade was innacurate, and has been updated.`,
							AnnouncementType.Announcement,
						);
						setForeignOffer(finalizedOffer);
					}

					if (localConfirmed) {
						setTradeState(TradeState.Completed);
					}
				} else {
					addAnnouncement(`There was an error with the trade. Try again later. [I-11]`, AnnouncementType.Error);

					setLocalOffer(defaultOffer);
					setForeignOffer(defaultOffer);

					setLocalReady(false);
					setForeignReady(false);

					setLocalConfirmed(false);
					setForeignConfirmed(false);

					setTradeState(TradeState.Offering);

					props.exitTrade();

					clientTradeError.SendToServer();
					return;
				}
			},
		);

		const finalizedTradeDeclinedConnection = finalizedTradeDeclined.Connect((player: Player) => {
			if (player.UserId === Players.LocalPlayer.UserId) {
				warn(`Received finalized trade declined remote from local player. This should never happen.`);
				return;
			} else if (player.UserId === props.targetPlayer.UserId) {
				addAnnouncement(
					`${props.targetPlayer.Name} has declined the finalized offer. Try another offer.`,
					AnnouncementType.Announcement,
				);

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

		const abandonTradeAssertionConnection = abandonTradeAssertion.Connect(() => {
			addAnnouncement(`There was an error with the trade. Try again later. [I-12]`, AnnouncementType.Error);

			setLocalOffer(defaultOffer);
			setForeignOffer(defaultOffer);

			setLocalReady(false);
			setForeignReady(false);

			setLocalConfirmed(false);
			setForeignConfirmed(false);

			setTradeState(TradeState.Offering);

			props.exitTrade();
		});

		const connections: Array<RBXScriptConnection> = [
			offerChangedConnection,
			tradeOfferConfirmedConnection,
			tradeOfferDeclinedConnection,
			finalizedTradeConfirmedConnection,
			finalizedTradeDeclinedConnection,
			abandonTradeAssertionConnection,
		];
		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [
		offerChanged,
		tradeOfferConfirmed,
		tradeOfferDeclined,
		finalizedTradeConfirmed,
		finalizedTradeDeclined,
		clientTradeError,
		abandonTradeAssertion,
		localReady,
		localConfirmed,
	]);

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
