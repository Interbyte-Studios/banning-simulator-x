import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiDarkStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { MAX_TRADE_OFFER_SIZE } from "shared/configs/game";
import { PlayerTradeItem } from "shared/configs/trading";
import { Pet } from "shared/rodux/pets";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

import { ActiveOfferConfirmed } from "./confirmed";
import { ActiveCurrencyOffer } from "./currency";
import { LocalSearch } from "./search";

interface ActiveTradeOfferProps {
	player: Player;
	otherPlayer: Player;
	currentOffer: PlayerTradeItem;
	setOffer: (offer: PlayerTradeItem) => void;
	confirmed: boolean;
	resetTrade: () => void; // for error handling, in case of abandoned trade
}

/**
 * Displays the headshot of the player.
 *
 * @param props The props of the component.
 * @param props.player The player to display the headshot of.
 * @returns The component.
 */
export const PlayerHeadshot = hooks((props: { player: Player }, { useState, useEffect }) => {
	const [content, setContent] = useState("");
	useEffect(() => {
		const thumbnailType = Enum.ThumbnailType.HeadShot;
		const thumbnailSize = Enum.ThumbnailSize.Size420x420;

		const threadConnection = task.spawn(() => {
			const [success, result] = pcall(() =>
				Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize),
			);
			if (success) {
				setContent(result);
			}
		});
		return (): void => task.cancel(threadConnection);
	}, [props.player]);

	const isLocalPlayer = props.player.UserId === Players.LocalPlayer.UserId;

	return (
		<>
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={uiTextStrokeColor}
				Position={isLocalPlayer ? UDim2.fromScale(0.03, 0) : UDim2.fromScale(0.97, 0)}
				Size={UDim2.fromScale(0.1, 0.1)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />

				<ImageLabel
					native={{
						Size: UDim2.fromScale(1, 1),
						Position: UDim2.fromScale(0.5, 0.5),
						Image: content,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
				</ImageLabel>
			</BaseFrame>
			<StrokeTextLabel
				native={{
					Position: isLocalPlayer ? UDim2.fromScale(0.175, 0) : UDim2.fromScale(0.825, 0),
					Size: UDim2.fromScale(0.2, 0.05),
					Text: props.player.Name,
					TextXAlignment: isLocalPlayer ? Enum.TextXAlignment.Left : Enum.TextXAlignment.Right,
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(12, 134, 211) } }}
			/>
		</>
	);
});

/**
 * The active trade offer component is the component that displays the offer of the player.
 *
 * @param props The props of the component.
 * @param props.player The player that is trading.
 * @param props.currentOffer The current offer of the player.
 * @param props.setOffer A function that sets the offer of the player.
 * @param props.confirmed Whether or not the player has confirmed their offer.
 * @param props.resetTrade A function that resets the trade (for error handling, in case of abandoned trade).
 * @returns The component.
 */
export const ActiveTradeOffer = hooks((props: ActiveTradeOfferProps, { useContext, useState }) => {
	const [currentSearch, setSearch] = useState("");
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	const isLocalPlayer = props.player.UserId === Players.LocalPlayer.UserId;

	const playerStore = retrieveStore(props.player);
	if (playerStore === undefined) {
		addAnnouncement("There was an issue with the trade. Please rejoin.", AnnouncementType.Error);

		props.resetTrade();
		return <></>;
	}

	const otherPlayerStore = retrieveStore(props.otherPlayer);
	if (otherPlayerStore === undefined) {
		addAnnouncement("There was an issue with the trade. Please rejoin.", AnnouncementType.Error);

		props.resetTrade();
		return <></>;
	}

	let pets: Array<Pet> = [];
	if (props.player.UserId === Players.LocalPlayer.UserId) {
		pets = playerStore.getState().pets;
	} else {
		for (const pet of playerStore.getState().pets) {
			if (props.currentOffer.pets.includes(pet.guid)) {
				pets.push(pet);
			}
		}
	}
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: isLocalPlayer ? UDim2.fromScale(0.275, 0.05) : UDim2.fromScale(0.76, 0.05),
					Size: isLocalPlayer ? UDim2.fromScale(0.35, 0.08) : UDim2.fromScale(0.35, 0.08),
					Text: isLocalPlayer ? "Your Offer" : "Their Offer",
					ZIndex: 2,
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<PlayerHeadshot player={Players.LocalPlayer} />
			<PlayerHeadshot player={props.player} />

			<BaseFrame
				Position={isLocalPlayer ? UDim2.fromScale(0.275, 0.45) : UDim2.fromScale(0.76, 0.375)}
				Size={isLocalPlayer ? UDim2.fromScale(0.485, 0.79) : UDim2.fromScale(0.43, 0.63)}
			>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Color: uiTextStrokeColor, Thickness: 4 }} />

				{isLocalPlayer && <LocalSearch updateSearch={(query: string): void => setSearch(query)} />}

				<VirtualScroll
					pets={pets}
					searchText={currentSearch}
					size={UDim2.fromScale(0.98, 0.765)}
					position={UDim2.fromScale(0.508, 0.52)}
					scrollBarThickness={12}
					scrollBarImageColor={Color3.fromRGB(8, 82, 129)}
					fillDirectionMaxCells={4}
					onActivated={(guid: string): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (!isLocalPlayer) {
							return;
						}

						if (props.currentOffer.pets.includes(guid)) {
							const newPets = [...props.currentOffer.pets];
							const petIndex = newPets.indexOf(guid);
							newPets.unorderedRemove(petIndex);

							const newOffer = { ...props.currentOffer, pets: newPets };
							props.setOffer(newOffer);
						} else {
							if (
								otherPlayerStore.getState().pets.size() + props.currentOffer.pets.size() >=
								getPetInventorySize(otherPlayerStore.getState().gamepasses)
							) {
								addAnnouncement(
									`The other player has a full inventory. You cannot give them pets!`,
									AnnouncementType.Error,
								);
								return;
							} else {
								print(
									otherPlayerStore.getState().pets.size(),
									getPetInventorySize(otherPlayerStore.getState().gamepasses),
								);
							}

							if (props.currentOffer.pets.size() >= MAX_TRADE_OFFER_SIZE) {
								addAnnouncement(`You can only offer ${MAX_TRADE_OFFER_SIZE} pets!`, AnnouncementType.Error);
								return;
							}

							const storedPetData = pets.find((pet) => pet.guid === guid);
							if (storedPetData === undefined) {
								addAnnouncement(`There was an issue adding that pet to the trade!`, AnnouncementType.Error);
								return;
							}

							if (storedPetData.equipped) {
								addAnnouncement(`You cannot trade an equipped pet!`, AnnouncementType.Error);
								return;
							}

							if (storedPetData.locked) {
								addAnnouncement(`You cannot trade a locked pet!`, AnnouncementType.Error);
								return;
							}

							if (storedPetData.tradeLocked) {
								addAnnouncement(`That pet cannot be traded. It's trade-locked.`, AnnouncementType.Error);
								return;
							}

							const newPets = [...props.currentOffer.pets];
							newPets.push(guid);

							const newOffer = { ...props.currentOffer, pets: newPets };
							props.setOffer(newOffer);
						}
					}}
					selectedPets={...props.currentOffer.pets}
				/>
				<ActiveCurrencyOffer
					player={props.player}
					currentOffer={props.currentOffer}
					setOffer={props.setOffer}
					resetTrade={props.resetTrade}
				/>
				{props.confirmed ? <ActiveOfferConfirmed player={props.player} /> : undefined}
			</BaseFrame>
		</>
	);
});
