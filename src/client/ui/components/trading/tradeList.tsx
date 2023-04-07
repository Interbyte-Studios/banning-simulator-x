import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const TradeButton = hooks(
	(
		props: {
			player: Player;
			displayTradeWarning: (player: Player) => void;
			displaySentRequest: (player: Player) => void;
		},
		hooks,
	) => {
		const minimizedSize = 0.6;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.7;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const playerStore = retrieveStore(props.player);

		const { useContext } = hooks;
		const { requestTrading } = useContext(remoteContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.85, 0.5)}
				Size={binding.map((size) => UDim2.fromScale(size, size))}
				Image={assetIds.images.ui.index.Claim}
				ImageColor3={
					playerStore !== undefined && playerStore.getState().settings.privacy.tradesEnabled
						? Color3.fromRGB(255, 255, 255)
						: Color3.fromRGB(129, 129, 129)
				}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						if (playerStore !== undefined && !playerStore.getState().settings.privacy.tradesEnabled) {
							return;
						}

						const activelyTrading =
							ReplicatedStorage.activeTrades.FindFirstChild(props.player.Name) ??
							ReplicatedStorage.activeTrades.FindFirstChild(Players.LocalPlayer.Name);
						if (activelyTrading !== undefined) {
							props.displayTradeWarning(props.player);
							return;
						}

						props.displaySentRequest(props.player);
						requestTrading.SendToServer(props.player);
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Font={font}
					Text={"Trade"}
					TextColor3={
						playerStore !== undefined && playerStore.getState().settings.privacy.tradesEnabled
							? Color3.fromRGB(255, 255, 255)
							: Color3.fromRGB(175, 175, 175)
					}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(17, 150, 55) }} />
				</textlabel>
			</imagebutton>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

export const TradeCard = hooks(
	(props: {
		player: Player;
		displayTradeWarning: (player: Player) => void;
		displaySentRequest: (player: Player) => void;
	}) => {
		const thumbnailType = Enum.ThumbnailType.HeadShot;
		const thumbnailSize = Enum.ThumbnailSize.Size420x420;
		const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.95)}
			>
				<uiaspectratioconstraint AspectRatio={5.6} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 100, 163)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.975, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.3, 0)} />
					<frame
						AnchorPoint={vec2Middle}
						BackgroundColor3={Color3.fromRGB(44, 170, 249)}
						Position={UDim2.fromScale(0.09, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 75, 122) }} />
						<imagelabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.5, 0.5)}
							ScaleType={Enum.ScaleType.Fit}
							Image={isReady && content ? content : ""}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</imagelabel>
					</frame>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.425, 0.5)}
						Size={UDim2.fromScale(0.5, 0.6)}
						Font={font}
						Text={props.player.DisplayName}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(12, 134, 211) }} />
					</textlabel>
					<TradeButton
						player={props.player}
						displaySentRequest={props.displaySentRequest}
						displayTradeWarning={props.displayTradeWarning}
					/>
				</frame>
			</frame>
		);
	},
);

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
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.15)}
				TextScaled={true}
				Text={"There aren't any players in your lobby to trade :("}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textlabel>,
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
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.08)}
					Size={UDim2.fromScale(0.45, 0.15)}
					TextScaled={true}
					Text={"Trade List"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
				</textlabel>
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
			</frame>
		);
	},
);
