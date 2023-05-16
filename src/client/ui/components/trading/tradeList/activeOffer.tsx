// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { setIsTrading } from "client/modules/isTradingCache";
import {
	font,
	uiClaimButtonStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
	vec2Middle,
} from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { MAX_TRADE_OFFER_SIZE } from "shared/configs/game";
import { PlayerTradeItem } from "shared/configs/trading";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { Pet, PetsState } from "shared/rodux/pets";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * Searches for specific pets.
 *
 * @param props The props for the component.
 * @param props.updateSearch The function to update the search.
 * @returns The Roact element to render.
 */
export const LocalSearch = (props: { updateSearch: (query: string) => void }): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.5, 0.09)}
			Size={UDim2.fromScale(0.95, 0.07)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

			<textbox
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.9)}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={""}
				TextScaled={true}
				PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
				PlaceholderText={"Search..."}
				Change={{
					/**
					 * Called when the textbox is changed.
					 *
					 * @param textBox The textbox that was changed.
					 * @returns A callback to update the current search query state.
					 */
					Text: (textBox): void => props.updateSearch(textBox.Text),
				}}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
			</textbox>
		</BaseFrame>
	);
};

/**
 * Shows that the local player has confirmed their offer.
 *
 * @returns The Roact element to render.
 */
export const LocalConfirmed = (): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.5, 0.965)}
			Size={UDim2.fromScale(0.85, 0.08)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(14, 112, 173) }} />

			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Text: "Confirmed",
					TextColor3: Color3.fromRGB(85, 255, 127),
				}}
				stroke={{ native: { Color: Color3.fromRGB(45, 136, 66), Thickness: 2 } }}
			/>
		</BaseFrame>
	);
};

/**
 * Shows that the other player has confirmed their offer.
 *
 * @returns The Roact element to render.
 */
export const TheirConfirmed = (): Roact.Element => {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.8),
				Size: UDim2.fromScale(0.8, 0.1),
				Text: "Confirmed",
				TextColor3: Color3.fromRGB(85, 255, 127),
			}}
			stroke={{ native: { Color: Color3.fromRGB(45, 136, 66), Thickness: 2 } }}
		/>
	);
};

interface LocalCurrencyProps extends LocalCurrencyMappedProps {
	pets: Array<string>;
	changedOffer: () => void;
	setOffer: (offer: PlayerTradeItem) => void;
}

interface LocalCurrencyMappedProps {
	currencies: CurrenciesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapCurrencyStateToProps(state: StoreState): LocalCurrencyMappedProps {
	return {
		currencies: state.currencies,
	};
}

/**
 * Displays the offer for the currency being traded.
 *
 * @returns The Roact element to render.
 */
export const LocalCurrencyOffer = RoactRodux.connect(mapCurrencyStateToProps)(
	hooks((props: LocalCurrencyProps, hooks) => {
		const { useState, useContext, useEffect } = hooks;

		const [updateTime, setUpdateTime] = useState(0);
		const [offeredCurrencyType, setOfferedCurrencyType] = useState<Currency>("coins");
		const [offeredCurrency, setOfferedCurrency] = useState(0);

		const modifyOfferRemote = useContext(remoteContext).modifyOffer;

		useEffect(() => {
			if (offeredCurrency > props.currencies[offeredCurrencyType]) {
				setOfferedCurrency(props.currencies[offeredCurrencyType]);
			}
		}, [offeredCurrency]);

		useEffect(() => {
			const newOffer = {
				pets: props.pets,
				currency: {
					type: offeredCurrencyType,
					amount: offeredCurrency,
				},
			};
			modifyOfferRemote.SendToServer(newOffer);
			props.setOffer(newOffer);
			props.changedOffer();
		}, [updateTime, offeredCurrencyType]);

		const isMax = offeredCurrency >= props.currencies[offeredCurrencyType];

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				Position={UDim2.fromScale(0.5, 1.08)}
				Size={UDim2.fromScale(1, 0.115)}
			>
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

				<textbox
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.55, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={""}
					TextScaled={true}
					PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
					PlaceholderText={
						offeredCurrency === 0
							? isMax
								? `${statsAbbreviator.numberToString(offeredCurrency)} (Max)`
								: `${statsAbbreviator.numberToString(offeredCurrency)}`
							: "Enter amount: (Ex: 500k)"
					}
					TextXAlignment={Enum.TextXAlignment.Left}
					Change={{
						/**
						 * Called when the textbox is changed.
						 *
						 * @param textBox The textbox that was changed.
						 */
						Text: (textBox): void => {
							const textAmount = textBox.Text;
							if (textAmount === "") {
								return;
							}

							const amount = tonumber(textAmount);
							if (amount === undefined) {
								return;
							}

							if (amount < 0) {
								return;
							}

							if (amount > props.currencies[offeredCurrencyType]) {
								setOfferedCurrency(props.currencies[offeredCurrencyType]);
								return;
							}

							setOfferedCurrency(amount);
						},
					}}
					Event={{
						/**
						 * Called when the textbox is no longer focused.
						 *
						 * @param textBox The textbox that was changed.
						 */
						FocusLost: (textBox): void => {
							textBox.Text = isMax
								? `${statsAbbreviator.numberToString(offeredCurrency)} (Max)`
								: `${statsAbbreviator.numberToString(offeredCurrency)}`;

							if (offeredCurrency < 0) {
								return;
							}

							setUpdateTime(time());
						},
					}}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
				</textbox>

				<CurrencyIcon
					anchorPoint={vec2Middle}
					position={UDim2.fromScale(0.065, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					currency={offeredCurrencyType}
					events={{
						/**
						 * Called when the currency icon is activated.
						 */
						Activated: (): void => {
							if (offeredCurrencyType === "coins") {
								setOfferedCurrencyType("gems");
							} else if (offeredCurrencyType === "gems") {
								setOfferedCurrencyType("coins");
							}
						},
					}}
				/>
			</BaseFrame>
		);
	}),
);

/**
 * Displays the offer for the currency being traded.
 *
 * @param props The props for the component.
 * @param props.offer The offer to display.
 * @returns The Roact element to render.
 */
export const TheirCurrencyOffer = (props: { offer: PlayerTradeItem }): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.5, 0.915)}
			Size={UDim2.fromScale(0.9, 0.1)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.55, 0.5),
					Size: UDim2.fromScale(0.8, 0.8),
					Text: props.offer.currency !== undefined ? statsAbbreviator.numberToString(props.offer.currency.amount) : "",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<CurrencyIcon
				anchorPoint={vec2Middle}
				position={UDim2.fromScale(0.065, 0.5)}
				size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				currency={props.offer.currency !== undefined ? props.offer.currency.type : "coins"}
			/>
		</BaseFrame>
	);
};

interface LocalOfferProps extends LocalOfferMappedProps {
	confirmed: boolean;
	resetConfirmation: () => void;
	changedOffer: () => void;
	offerData: PlayerTradeItem;
	setOffer: (offer: PlayerTradeItem) => void;
}

interface LocalOfferMappedProps {
	pets: PetsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): LocalOfferMappedProps {
	return {
		pets: state.pets,
	};
}

/**
 * Displays the offer for the local player.
 *
 * @returns The Roact element to render.
 */
export const LocalOffer = RoactRodux.connect(mapStateToProps)(
	hooks((props: LocalOfferProps, { useContext, useState, useEffect }) => {
		const [currentSearch, setSearch] = useState("");
		const modifyOfferRemote = useContext(remoteContext).modifyOffer;
		const offerModified = useContext(remoteContext).offerChanged;
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			// Something failed so we need to rest our previously made offer
			const connection = offerModified.Connect((localPlayer, newOffer) => {
				if (localPlayer.UserId === Players.LocalPlayer.UserId) {
					props.setOffer(newOffer);
				}
			});
			return (): void => connection.Disconnect();
		}, [offerModified]);

		return (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.275, 0.05),
						Size: UDim2.fromScale(0.35, 0.1),
						Text: "Your Offer",
						ZIndex: 2,
					}}
					stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
				/>

				<BaseFrame Position={UDim2.fromScale(0.275, 0.45)} Size={UDim2.fromScale(0.485, 0.79)}>
					<uicorner CornerRadius={new UDim(0.125, 0)} />
					<BaseUIStroke native={{ Color: uiTextStrokeColor, Thickness: 4 }} />

					<LocalSearch updateSearch={(query: string): void => setSearch(query)} />

					<VirtualScroll
						pets={props.pets}
						searchText={currentSearch}
						size={UDim2.fromScale(0.98, 0.765)}
						position={UDim2.fromScale(0.508, 0.52)}
						scrollBarImageColor={Color3.fromRGB(8, 82, 129)}
						fillDirectionMaxCells={4}
						onActivated={(guid: string): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.offerData.pets.includes(guid)) {
								const newPets = [...props.offerData.pets];
								const petIndex = newPets.indexOf(guid);
								newPets.unorderedRemove(petIndex);

								const newOffer = { ...props.offerData, pets: newPets };

								modifyOfferRemote.SendToServer(newOffer);
								props.setOffer(newOffer);
								props.changedOffer();
							} else {
								if (props.offerData.pets.size() >= MAX_TRADE_OFFER_SIZE) {
									addAnnouncement(`You can only offer ${MAX_TRADE_OFFER_SIZE} pets!`, AnnouncementType.Error);
									return;
								}

								const storedPetData = props.pets.find((pet) => pet.guid === guid);
								if (storedPetData === undefined) {
									addAnnouncement(`There was an issue adding that pet to the trade!	`, AnnouncementType.Error);
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

								const newPets = [...props.offerData.pets];
								newPets.push(guid);

								const newOffer = { ...props.offerData, pets: newPets };

								modifyOfferRemote.SendToServer(newOffer);
								props.setOffer(newOffer);
								props.changedOffer();
							}
						}}
						selectedPets={...props.offerData.pets}
					/>
					<LocalCurrencyOffer pets={props.offerData.pets} changedOffer={props.changedOffer} setOffer={props.setOffer} />
					{props.confirmed ? <LocalConfirmed /> : undefined}
				</BaseFrame>
			</>
		);
	}),
);

interface TheirOfferProps {
	player: Player;
	confirmed: boolean;
	offerData: PlayerTradeItem;
	setOffer: (offer: PlayerTradeItem) => void;
}

/**
 * Displays the offer for the other player.
 *
 * @param props The props for the component.
 * @param props.otherPlayer The other player in the trade.
 * @param props.confirmed Whether or not the other player has confirmed their offer.
 * @returns The Roact element to render.
 */
export const TheirOffer = hooks((props: TheirOfferProps, { useContext, useEffect }) => {
	const offerModified = useContext(remoteContext).offerChanged;
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	useEffect(() => {
		const connection = offerModified.Connect((otherPlayer, newOffer) => {
			if (otherPlayer.UserId === props.player.UserId) {
				props.setOffer(newOffer);
			}
		});
		return (): void => connection.Disconnect();
	}, [offerModified]);

	const playerStore = retrieveStore(props.player);
	if (playerStore === undefined) {
		addAnnouncement(`There was an issue with trading ${props.player.Name}!`, AnnouncementType.Error);
		throw `Failed to get store for player ${props.player.Name}!`;
	}

	const pets: Array<Pet> = [];
	for (const pet of playerStore.getState().pets) {
		if (props.offerData.pets.includes(pet.guid)) {
			pets.push(pet);
		}
	}

	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.76, 0.05),
					Size: UDim2.fromScale(0.35, 0.1),
					Text: "Their Offer",
					ZIndex: 2,
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<BaseFrame Position={UDim2.fromScale(0.76, 0.375)} Size={UDim2.fromScale(0.43, 0.63)}>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Thickness: 4, Color: uiTextStrokeColor }} />

				<VirtualScroll
					pets={pets}
					size={UDim2.fromScale(0.99, 0.915)}
					position={UDim2.fromScale(0.5, 0.52)}
					scrollBarThickness={12}
					scrollBarImageColor={Color3.fromRGB(8, 82, 129)}
					fillDirectionMaxCells={4}
				/>
				<TheirCurrencyOffer offer={props.offerData} />
				{props.confirmed ? <TheirConfirmed /> : undefined}
			</BaseFrame>
		</>
	);
});

/**
 * Displays the active offer.
 *
 * @param props The props for the component.
 * @param props.otherPlayer The other player in the trade.
 * @param props.resetTradeAccepted Resets the trade accepted state.
 * @returns The Roact element to render.
 */
export const ActiveOffer = hooks(
	(
		props: {
			otherPlayer: Player;
			resetTradeAccepted: (player?: Player) => void;
			bothConfirmed: (localOffer: PlayerTradeItem, theirOffer: PlayerTradeItem) => void;
			resetConfirmed: boolean;
		},
		hooks,
	) => {
		const { useState, useContext, useEffect } = hooks;

		const [isLocalConfirmed, setLocalConfirmed] = useState(false);
		const [isTheirConfirmed, setTheirConfirmed] = useState(false);

		const [localOffer, setLocalOffer] = useState<PlayerTradeItem>({
			currency: {
				type: "coins",
				amount: 0,
			},
			pets: [],
		});

		const [otherOffer, setOtherOffer] = useState<PlayerTradeItem>({
			currency: {
				type: "coins",
				amount: 0,
			},
			pets: [],
		});

		const { offerChanged, confirmOffer, declineOffer, tradeOfferConfirmed, tradeOfferDeclined } =
			useContext(remoteContext);

		useEffect(() => {
			const connection = offerChanged.Connect(() => {
				warn("Other played changed offer!");

				if (isLocalConfirmed) {
					setLocalConfirmed(false);
				}

				if (isTheirConfirmed) {
					setTheirConfirmed(false);
				}
			});

			return (): void => connection.Disconnect();
		}, [offerChanged, isLocalConfirmed, isTheirConfirmed]);

		useEffect(() => {
			const connection = tradeOfferConfirmed.Connect(() => setTheirConfirmed(true));

			return (): void => connection.Disconnect();
		}, [tradeOfferConfirmed]);

		useEffect(() => {
			const connection = tradeOfferDeclined.Connect(() => {
				props.resetTradeAccepted(props.otherPlayer);
				setIsTrading(false);
				setLocalConfirmed(false);
			});

			return (): void => connection.Disconnect();
		}, [tradeOfferDeclined]);

		useEffect(() => {
			if (isLocalConfirmed && isTheirConfirmed) {
				props.bothConfirmed(localOffer, otherOffer);
			}
		}, [isLocalConfirmed, isTheirConfirmed]);

		useEffect(() => {
			if (props.resetConfirmed) {
				setLocalConfirmed(false);
				setTheirConfirmed(false);
			}
		}, [props.resetConfirmed]);

		return (
			<BaseFrame Size={UDim2.fromScale(1, 1)}>
				<LocalOffer
					confirmed={isLocalConfirmed}
					resetConfirmation={(): void => {
						setLocalConfirmed(false);
						setTheirConfirmed(false);
					}}
					changedOffer={(): void => {
						setLocalConfirmed(false);
						setTheirConfirmed(false);
					}}
					offerData={localOffer}
					setOffer={(offerData: PlayerTradeItem): void => setLocalOffer(offerData)}
				/>
				<TheirOffer
					player={props.otherPlayer}
					confirmed={isTheirConfirmed}
					offerData={otherOffer}
					setOffer={(offerData: PlayerTradeItem): void => setOtherOffer(offerData)}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.765, 0.755),
						Size: UDim2.fromScale(0.44, 0.1),
						Text: "All trades are final. Be careful and mindful when trading others.",
					}}
					stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.88, 0.89),
						Size: UDim2.fromScale(0.2, 0.2),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
					events={{
						/**
						 * Called when the button is activated.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (isLocalConfirmed) {
								return;
							}

							confirmOffer.SendToServer();
							setLocalConfirmed(true);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Confirm",
						}}
						stroke={{ native: { Color: uiClaimButtonStrokeColor, Thickness: 2 } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.65, 0.89),
						Size: UDim2.fromScale(0.2, 0.2),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
					events={{
						/**
						 * Called when the button is activated.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							declineOffer.SendToServer();
							props.resetTradeAccepted(Players.LocalPlayer);
							setIsTrading(false);
							setLocalConfirmed(false);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Cancel",
						}}
						stroke={{ native: { Color: uiOffButtonStrokeColor, Thickness: 2 } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	},
);
