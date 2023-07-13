import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiClaimButtonStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { VirtualScroll } from "client/ui/elements/petUtility/virtualScroll";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { PET_LEVEL_REQUIREMENTS } from "shared/configs/pets";
import { SavedTrade, SavedTradePet } from "shared/rodux/tradeLogs";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { FullComponentHeader } from "../util/fullComponentHeader";

interface TradeHistoryProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * A player's image.
 *
 * @param props The props for the player image.
 * @param props.playerId The player's id.
 * @param props.position The component's position.
 * @param props.size The component's size.
 * @returns The player's image.
 */
const PlayerImage = hooks((props: { playerId: number; position: UDim2; size: UDim2 }, { useState, useEffect }) => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;

	const [content, setContent] = useState("");
	useEffect(() => {
		task.spawn(() => {
			const [content, isReady] = Players.GetUserThumbnailAsync(props.playerId, thumbnailType, thumbnailSize);
			if (isReady && content) {
				setContent(content);
			}
		});
	}, [props.playerId]);

	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(38, 166, 247)}
			Position={props.position}
			Size={props.size}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Color: Color3.fromRGB(5, 56, 88), Thickness: 2 }} />

			<ImageLabel
				native={{
					Image: content,
				}}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</ImageLabel>
		</BaseFrame>
	);
});

/**
 * A player pet offer.
 *
 * @param props The props for the player pet offer.
 * @param props.pets The pets the player is offering.
 * @param props.position The component's position.
 * @param props.size The component's size.
 * @param props.displayBackground Whether to display the background.
 * @returns The player pet offer.
 */
const PlayerPetOffer = (props: {
	pets: Array<SavedTradePet>;
	position: UDim2;
	size: UDim2;
	displayBackground: boolean;
}): Roact.Element => {
	const randomSeed = new Random();
	const fakeStoredData = props.pets.map((pet) => {
		return {
			...pet,
			bans: PET_LEVEL_REQUIREMENTS[pet.variant] * pet.level,
			guid: tostring(randomSeed.NextNumber(0, 100000)),
			equipped: false,
			locked: false,
			tradeLocked: false,
		};
	});

	return (
		<BaseFrame
			BackgroundTransparency={props.displayBackground ? 0 : 1}
			BackgroundColor3={uiTextStrokeColor}
			Position={props.position}
			Size={props.size}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(5, 56, 88) }} />

			<VirtualScroll
				pets={fakeStoredData}
				size={UDim2.fromScale(0.99, 0.915)}
				position={UDim2.fromScale(0.5, 0.52)}
				scrollBarThickness={12}
				fillDirectionMaxCells={4}
				noToolTipDispay={props.displayBackground}
			/>
		</BaseFrame>
	);
};

/**
 * A player currency offer.
 *
 * @param props The props for the player currency offer.
 * @param props.isLocal Whether the player is the local player.
 * @param props.currencyType The currency type.
 * @param props.amount The amount of currency.
 * @param props.isFocused Whether the component is focused.
 * @returns The player currency offer.
 */
const PlayerCurrencyOffer = (props: {
	isLocal: boolean;
	currencyType: Currency;
	amount: number;
	isFocused: boolean;
}): Roact.Element => {
	return (
		<>
			<CurrencyIcon
				anchorPoint={vec2Middle}
				position={
					props.isLocal
						? props.isFocused
							? UDim2.fromScale(0.15, 0.19)
							: UDim2.fromScale(0.13, 0.375)
						: props.isFocused
						? UDim2.fromScale(0.85, 0.19)
						: UDim2.fromScale(0.87, 0.375)
				}
				size={{ minimizedSize: props.isFocused ? 0.075 : 0.15, maximizedSize: props.isFocused ? 0.1 : 0.2 }}
				currency={props.currencyType}
			/>
			<StrokeTextLabel
				native={{
					Position: props.isLocal
						? props.isFocused
							? UDim2.fromScale(0.28, 0.19)
							: UDim2.fromScale(0.26, 0.375)
						: props.isFocused
						? UDim2.fromScale(0.72, 0.19)
						: UDim2.fromScale(0.74, 0.375),
					Size: props.isFocused ? UDim2.fromScale(0.2, 0.1) : UDim2.fromScale(0.2, 0.2),
					Text: statsAbbreviator.numberToString(props.amount),
					TextXAlignment: props.isLocal ? Enum.TextXAlignment.Left : Enum.TextXAlignment.Right,
				}}
				stroke={{
					native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) },
					currencyGradient: props.currencyType,
				}}
			/>
		</>
	);
};

/**
 * A trade card displaying a trade log.
 */
const TradeCard = hooks(
	(props: { playerViewing: Player; tradeLog: SavedTrade; viewTrade: () => void }, { useState, useEffect }) => {
		const [otherPlayerName, setOtherPlayerName] = useState("unknown");
		useEffect(() => {
			if (otherPlayerName !== "unknown") {
				return;
			}

			task.spawn((): void => {
				const [success, result] = pcall(() => Players.GetNameFromUserIdAsync(props.tradeLog.otherPlayerId));
				if (success) {
					setOtherPlayerName(result);
				}
			});
		}, [otherPlayerName]);

		return (
			<BaseFrame Size={UDim2.fromScale(1, 0.5)}>
				<uiaspectratioconstraint AspectRatio={4.1} />
				<BaseFrame
					BackgroundColor3={uiTextStrokeColor}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.99, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<BaseUIStroke native={{ Color: Color3.fromRGB(5, 56, 88), Thickness: 2 }} />

					<PlayerImage
						playerId={props.playerViewing.UserId}
						position={UDim2.fromScale(0.055, 0.25)}
						size={UDim2.fromScale(0.4, 0.4)}
					/>

					<PlayerImage
						playerId={props.tradeLog.otherPlayerId}
						position={UDim2.fromScale(0.945, 0.25)}
						size={UDim2.fromScale(0.4, 0.4)}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.215, 0.15),
							Size: UDim2.fromScale(0.2, 0.25),
							Text: props.playerViewing.Name,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.785, 0.15),
							Size: UDim2.fromScale(0.2, 0.25),
							Text: otherPlayerName,
							TextXAlignment: Enum.TextXAlignment.Right,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<PlayerPetOffer
						pets={props.tradeLog.localOffer.pets}
						position={UDim2.fromScale(0.215, 0.735)}
						size={UDim2.fromScale(0.4, 0.45)}
						displayBackground={true}
					/>

					<PlayerPetOffer
						pets={props.tradeLog.otherOffer.pets}
						position={UDim2.fromScale(0.785, 0.735)}
						size={UDim2.fromScale(0.4, 0.45)}
						displayBackground={true}
					/>

					<PlayerCurrencyOffer
						isLocal={true}
						currencyType={props.tradeLog.localOffer.currency.currencyType}
						amount={props.tradeLog.localOffer.currency.amount}
						isFocused={false}
					/>

					<PlayerCurrencyOffer
						isLocal={false}
						currencyType={props.tradeLog.otherOffer.currency.currencyType}
						amount={props.tradeLog.otherOffer.currency.amount}
						isFocused={false}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.115),
							Size: UDim2.fromScale(0.225, 0.2),
							Text: props.tradeLog.timestamp.FormatLocalTime("LL", "en-us"),
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.3),
							Size: UDim2.fromScale(0.225, 0.2),
							Text: props.tradeLog.timestamp.FormatLocalTime("LT", "en-us"),
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.78),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.25, maxSize: 0.3 }}
						events={{
							/**
							 * View the trade.
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.viewTrade();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.8, 0.8),
								Text: "View",
							}}
							stroke={{ native: { Thickness: 1.5, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>
				</BaseFrame>
			</BaseFrame>
		);
	},
);

/**
 * Displays a players trade history.
 */
export const TradeHistory = hooks((props: TradeHistoryProps, { useEffect, useValue, useState }) => {
	const store = retrieveStore(props.playerViewing);
	if (store === undefined) {
		return (
			<FullComponentHeader
				storeFound={false}
				headerText={`Error: No data found for ${props.playerViewing.Name}.`}
				displayReturn={true}
				returnToSelection={props.returnToSelection}
			/>
		);
	}

	const state = store.getState();
	if (!state.settings.privacy.publicTradeHistory) {
		return (
			<FullComponentHeader
				storeFound={false}
				headerText={`Error: ${props.playerViewing.Name} does not have public trade logs.`}
				displayReturn={true}
				returnToSelection={props.returnToSelection}
			/>
		);
	}

	const [viewedTrade, setViewedTrade] = useState<SavedTrade | undefined>(undefined);
	const [otherPlayerName, setOtherPlayerName] = useState("unknown");
	useEffect(() => {
		if (viewedTrade === undefined) {
			return;
		}

		task.spawn((): void => {
			const [success, result] = pcall(() => Players.GetNameFromUserIdAsync(viewedTrade.otherPlayerId));
			if (success) {
				warn(`Viewing trades for ${result}`);
				setOtherPlayerName(result);
			} else warn(`Failed to get username for ${viewedTrade.otherPlayerId}`);
		});
	}, [viewedTrade]);

	if (viewedTrade === undefined) {
		const listRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = listRef.value.getValue();
			assert(uiListLayout, `Failed to get Trade Offers UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Trade Offers ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Trade Offers to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((card) => {
				if (card.IsA("Frame")) {
					card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});

		const tradeLogs = state.tradeLogs;
		const tradeLogElements: Array<Roact.Element> = tradeLogs.map((tradeLog) => (
			<TradeCard
				playerViewing={props.playerViewing}
				tradeLog={tradeLog}
				viewTrade={(): void => setViewedTrade(tradeLog)}
			/>
		));

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`${props.playerViewing.Name}'s Trades`}
					returnToSelection={props.returnToSelection}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.615)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarImageColor3={Color3.fromRGB(0, 108, 176)}
				>
					<uilistlayout
						Padding={new UDim(0, 0)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Ref={listRef.value}
					/>
					{tradeLogElements}
				</RescalingScrollingFrame>
			</>
		);
	} else {
		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`${props.playerViewing.Name}'s Trades`}
					returnToSelection={(): void => setViewedTrade(undefined)}
					displayReturn={true}
				/>
				<BaseFrame
					Size={UDim2.fromScale(0.95, 0.705)}
					Position={UDim2.fromScale(0.5, 0.615)}
					BackgroundTransparency={0}
					BackgroundColor3={uiTextStrokeColor}
				>
					<uicorner CornerRadius={new UDim(0.15, 0)} />
					<BaseUIStroke native={{ Color: Color3.fromRGB(5, 56, 88), Thickness: 2 }} />

					<PlayerImage
						playerId={Players.LocalPlayer.UserId}
						position={UDim2.fromScale(0.07, 0.135)}
						size={UDim2.fromScale(0.115, 0.225)}
					/>

					<PlayerImage
						playerId={viewedTrade.otherPlayerId}
						position={UDim2.fromScale(0.93, 0.135)}
						size={UDim2.fromScale(0.115, 0.225)}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.255, 0.07),
							Size: UDim2.fromScale(0.24, 0.095),
							Text: Players.LocalPlayer.Name,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.745, 0.07),
							Size: UDim2.fromScale(0.24, 0.095),
							Text: otherPlayerName,
							TextXAlignment: Enum.TextXAlignment.Right,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<PlayerPetOffer
						pets={viewedTrade.localOffer.pets}
						position={UDim2.fromScale(0.245, 0.63)}
						size={UDim2.fromScale(0.475, 0.7)}
						displayBackground={false}
					/>

					<PlayerPetOffer
						pets={viewedTrade.otherOffer.pets}
						position={UDim2.fromScale(0.755, 0.63)}
						size={UDim2.fromScale(0.475, 0.7)}
						displayBackground={false}
					/>

					<PlayerCurrencyOffer
						isLocal={true}
						currencyType={viewedTrade.localOffer.currency.currencyType}
						amount={viewedTrade.localOffer.currency.amount}
						isFocused={true}
					/>

					<PlayerCurrencyOffer
						isLocal={false}
						currencyType={viewedTrade.otherOffer.currency.currencyType}
						amount={viewedTrade.otherOffer.currency.amount}
						isFocused={true}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.065),
							Size: UDim2.fromScale(0.225, 0.1),
							Text: viewedTrade.timestamp.FormatLocalTime("LL", "en-us"),
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.175),
							Size: UDim2.fromScale(0.225, 0.1),
							Text: viewedTrade.timestamp.FormatLocalTime("LT", "en-us"),
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 56, 88) } }}
					/>
				</BaseFrame>
			</>
		);
	}
});
