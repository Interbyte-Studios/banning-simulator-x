import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

export const TradeButton = hooks(
	(
		props: {
			player: Player;
			displayTradeWarning: (player: Player) => void;
			displaySentRequest: (player: Player) => void;
		},
		hooks,
	) => {
		const playerStore = retrieveStore(props.player);

		const { useContext } = hooks;
		const { requestTrading } = useContext(remoteContext);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.85, 0.5),
					Image: assetIds.images.ui.index.Claim,
					ImageColor3:
						playerStore !== undefined && playerStore.getState().settings.privacy.tradesEnabled
							? Color3.fromRGB(255, 255, 255)
							: Color3.fromRGB(129, 129, 129),
				}}
				size={{ maxSize: 0.7, minSize: 0.6 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						if (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled) {
							return;
						}

						const isActivelyTrading =
							props.player.GetAttribute(TRADING_ATTRIBUTE) !== undefined ||
							Players.LocalPlayer.GetAttribute(TRADING_ATTRIBUTE) !== undefined;
						if (isActivelyTrading) {
							props.displayTradeWarning(props.player);
							return;
						}

						props.displaySentRequest(props.player);
						requestTrading.SendToServer(props.player);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.5),
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Trade",
						TextColor3:
							playerStore !== undefined && playerStore.getState().settings.privacy.tradesEnabled
								? Color3.fromRGB(255, 255, 255)
								: Color3.fromRGB(175, 175, 175),
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>
		);
	},
);

/**
 * A card that displays a player's name and avatar.
 *
 * @param props The props for the component.
 * @param props.player The player to display.
 * @param props.displayTradeWarning A function that displays a warning when the player is already trading with someone.
 * @param props.displaySentRequest A function that displays a message when a trade request has been sent.
 * @returns The element.
 */
export const TradeCard = (props: {
	player: Player;
	displayTradeWarning: (player: Player) => void;
	displaySentRequest: (player: Player) => void;
}): Roact.Element => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

	return (
		<BaseFrame Size={UDim2.fromScale(1, 0.95)}>
			<uiaspectratioconstraint AspectRatio={5.6} />

			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 100, 163)}
				Size={UDim2.fromScale(0.975, 0.95)}
			>
				<uicorner CornerRadius={new UDim(0.3, 0)} />

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(44, 170, 249)}
					Position={UDim2.fromScale(0.09, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />

					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.5, 0.5),
							Image: isReady && content ? content : "",
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				</BaseFrame>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.425, 0.5),
						Size: UDim2.fromScale(0.5, 0.6),
						Text: props.player.DisplayName,
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
				/>

				<TradeButton
					player={props.player}
					displaySentRequest={props.displaySentRequest}
					displayTradeWarning={props.displayTradeWarning}
				/>
			</BaseFrame>
		</BaseFrame>
	);
};

export const TradeList = hooks(
	(
		props: {
			hideMenu: () => void;
			displayTradeWarning: (player: Player) => void;
			displaySentRequest: (player: Player) => void;
		},
		{ useValue, useEffect, useState },
	) => {
		const [playersInGame, setPlayersInGame] = useState<Array<Player>>(
			Players.GetPlayers().filter((player) => player !== Players.LocalPlayer),
		);

		useEffect(() => {
			const addedConnection = Players.PlayerAdded.Connect(() =>
				setPlayersInGame(Players.GetPlayers().filter((player) => player !== Players.LocalPlayer)),
			);

			const removedConnection = Players.PlayerRemoving.Connect(() =>
				setPlayersInGame(Players.GetPlayers().filter((player) => player !== Players.LocalPlayer)),
			);

			return (): void => {
				addedConnection.Disconnect();
				removedConnection.Disconnect();
			};
		});

		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Trade Lists's UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Trade Lists ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Trade Lists to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((teleportationCard) => {
				if (teleportationCard.IsA("Frame")) {
					teleportationCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((teleportationCard) => {
					if (teleportationCard.IsA("Frame")) {
						teleportationCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});
			});

			return (): void => connection.Disconnect();
		});

		const noPlayersWarning: Array<Roact.Element> = [
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.15),
					Text: "There aren't any players in your lobby to trade :(",
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>,
		];

		const playerCards = playersInGame.map((player) => {
			return (
				<TradeCard
					player={player}
					displayTradeWarning={props.displayTradeWarning}
					displaySentRequest={props.displaySentRequest}
				/>
			);
		});

		return (
			<BaseFrame Size={UDim2.fromScale(1, 1)}>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.08),
						Size: UDim2.fromScale(0.45, 0.15),
						Text: "Trade List",
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>

				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.975, 0.795)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0.01, 0)}
						Ref={uiListLayoutRef.value}
					/>
					{playerCards}
				</RescalingScrollingFrame>

				{playerCards.size() === 0 && noPlayersWarning}

				<ExitButton
					Position={UDim2.fromScale(0.975, 0.025)}
					minimizedSize={0.095}
					maximizedSize={0.11}
					onClosed={(): void => props.hideMenu()}
				/>
			</BaseFrame>
		);
	},
);
