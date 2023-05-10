// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { retrieveStore } from "client/clientStores";
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
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { MAX_TRADE_OFFER_SIZE } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";

import { PlayerTradeItem } from "..";

/**
 * Displays the offer for the currency being traded.
 *
 * @returns The Roact element to render.
 */
export const CurrencyOffer = (): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.275, 0.915)}
			Size={UDim2.fromScale(0.5, 0.09)}
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
				PlaceholderText={"Enter amount: (Ex: 500k)"}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
			</textbox>

			<CurrencyIcon
				anchorPoint={vec2Middle}
				position={UDim2.fromScale(0.065, 0.5)}
				size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				currency={"coins"}
			/>
		</BaseFrame>
	);
};

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
	hooks((props: LocalOfferMappedProps, { useContext, useState, useEffect }) => {
		const [currentOffer, setOffer] = useState<PlayerTradeItem>({
			currency: {
				type: "coins",
				amount: 0,
			},
			pets: [],
		});
		const modifyOfferRemote = useContext(remoteContext).modifyOffer;
		const offerModified = useContext(remoteContext).offerChanged;
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			// Something failed so we need to rest our previously made offer
			const connection = offerModified.Connect((localPlayer, newOffer) => setOffer(newOffer));
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

					<VirtualScroll
						pets={props.pets}
						size={UDim2.fromScale(0.98, 0.915)}
						position={UDim2.fromScale(0.508, 0.52)}
						scrollBarImageColor={Color3.fromRGB(8, 82, 129)}
						nativeFrame={{
							/**
							 * Adds/removes a pet from the offer.
							 *
							 * @param guid The guid of the pet.
							 */
							onActivated: (guid: string): void => {
								if (currentOffer.pets.includes(guid)) {
									warn("Removing from offer");
									const newOffer = { ...currentOffer };

									const petIndex = newOffer.pets.indexOf(guid);
									newOffer.pets.unorderedRemove(petIndex);

									modifyOfferRemote.SendToServer(newOffer);
									setOffer(newOffer);
								} else {
									print("Adding to offer");
									if (currentOffer.pets.size() >= MAX_TRADE_OFFER_SIZE) {
										addAnnouncement(`You can only offer ${MAX_TRADE_OFFER_SIZE} pets!`, AnnouncementType.Error);
										return;
									}

									const newOffer = { ...currentOffer };
									newOffer.pets.push(guid);

									modifyOfferRemote.SendToServer(newOffer);
									setOffer(newOffer);
								}
							},
							selectedPets: currentOffer.pets,
						}}
					/>
				</BaseFrame>
			</>
		);
	}),
);

/**
 * Displays the offer for the other player.
 *
 * @returns The Roact element to render.
 */
export const TheirOffer = hooks((props: { otherPlayer: Player }, { useContext, useState, useEffect }) => {
	const [currentOffer, setOffer] = useState<PlayerTradeItem>({
		currency: {
			type: "coins",
			amount: 0,
		},
		pets: [],
	});
	const offerModified = useContext(remoteContext).offerChanged;
	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	useEffect(() => {
		const connection = offerModified.Connect((otherPlayer, newOffer) => {
			setOffer(newOffer);
		});
		return (): void => connection.Disconnect();
	}, [offerModified]);

	const playerStore = retrieveStore(props.otherPlayer);
	if (playerStore === undefined) {
		addAnnouncement(`There was an issue with trading ${props.otherPlayer.Name}!`, AnnouncementType.Error);
		throw `Failed to get store for player ${props.otherPlayer.Name}!`;
	}

	const pets: Array<Pet> = [];
	for (const pet of playerStore.getState().pets) {
		if (currentOffer.pets.includes(pet.guid)) {
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
				/>
			</BaseFrame>
		</>
	);
});

/**
 * Displays the active offer.
 *
 * @param props The props for the component.
 * @param props.otherPlayer The other player in the trade.
 * @returns The Roact element to render.
 */
export const ActiveOffer = (props: { otherPlayer: Player }): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(1, 1)}>
			<CurrencyOffer />
			<LocalOffer />
			<TheirOffer otherPlayer={props.otherPlayer} />

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.765, 0.755),
					Size: UDim2.fromScale(0.44, 0.1),
					Text: "All trades are final. Be careful and mindful when trading others.",
				}}
				stroke={{ native: { Color: uiTextStrokeColor, Thickness: 2 } }}
			/>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.88, 0.89),
					Size: UDim2.fromScale(0.2, 0.2),
					Image: assetIds.images.ui.index.Claim,
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
			</ImageButton>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.65, 0.89),
					Size: UDim2.fromScale(0.2, 0.2),
					Image: assetIds.images.ui.index.Off,
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
			</ImageButton>
		</BaseFrame>
	);
};
