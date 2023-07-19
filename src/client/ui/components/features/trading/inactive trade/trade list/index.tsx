import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";

import { TradeCard } from "./tradeCard";

const NoPlayersWarning = (
	<StrokeTextLabel
		native={{
			Size: UDim2.fromScale(0.9, 0.15),
			Text: "There aren't any players in your lobby to trade :(",
		}}
		stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
	/>
);

/**
 * The trade list component.
 *
 * @param props The props for the trade list.
 * @param props.hideMenu A function that hides the trade list.
 * @param props.sendTrade A callback to send a trade to another player.
 * @returns A Roact element that represents the trade list.
 */
export const TradeList = hooks(
	(
		props: {
			hideMenu: () => void;
			sendTrade: (player: Player) => void;
		},
		{ useValue, useEffect, useState },
	) => {
		// state of the players in the game
		const [playersInGame, setPlayersInGame] = useState<Array<Player>>([]);

		// populates the initial state
		useEffect(() => {
			for (const player of Players.GetPlayers()) {
				if (player.UserId === Players.LocalPlayer.UserId) {
					continue;
				}

				let hasClickedPlay = player.FindFirstChild("HasClickedPlay") !== undefined;
				let roactMounted = player.FindFirstChild("RoactMounted") !== undefined;
				if (hasClickedPlay && roactMounted) {
					if (playersInGame.includes(player)) {
						return;
					}

					setPlayersInGame([...playersInGame, player]);
				}

				player.ChildAdded.Connect((child) => {
					if (playersInGame.includes(player)) {
						return;
					}

					if (!hasClickedPlay) {
						hasClickedPlay = child.Name === "HasClickedPlay";
					}

					if (!roactMounted) {
						roactMounted = child.Name === "RoactMounted";
					}

					if (hasClickedPlay && roactMounted) {
						setPlayersInGame([...playersInGame, player]);
					}
				});
			}

			const addedConnection = Players.PlayerAdded.Connect((player) => {
				let hasClickedPlay = player.FindFirstChild("HasClickedPlay") !== undefined;
				let roactMounted = player.FindFirstChild("RoactMounted") !== undefined;
				if (hasClickedPlay && roactMounted) {
					if (playersInGame.includes(player)) {
						return;
					}
					setPlayersInGame([...playersInGame, player]);
				}

				player.ChildAdded.Connect((child) => {
					if (playersInGame.includes(player)) {
						return;
					}

					if (!hasClickedPlay) {
						hasClickedPlay = child.Name === "HasClickedPlay";
					}

					if (!roactMounted) {
						roactMounted = child.Name === "RoactMounted";
					}

					if (hasClickedPlay && roactMounted) {
						setPlayersInGame([...playersInGame, player]);
					}
				});
			});

			const removedConnection = Players.PlayerRemoving.Connect(() => {
				const players: Array<Player> = [];
				for (const player of Players.GetPlayers()) {
					if (player !== Players.LocalPlayer) {
						const hasClickedPlay = player.FindFirstChild("HasClickedPlay") !== undefined;
						const roactMounted = player.FindFirstChild("RoactMounted") !== undefined;
						if (hasClickedPlay && roactMounted) {
							players.push(player);
						}
					}
				}
				setPlayersInGame(players);
			});

			return (): void => {
				addedConnection.Disconnect();
				removedConnection.Disconnect();
			};
		}, [playersInGame]);

		// scaling of the list
		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Trade Lists's UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Trade Lists ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Trade Lists to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((card) => {
				if (card.IsA("Frame")) {
					card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((card) => {
					if (card.IsA("Frame")) {
						card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});
			});

			return (): void => connection.Disconnect();
		});

		// the trading cards for each player
		const playerCards = playersInGame.map((player) => {
			return <TradeCard player={player} sendTrade={props.sendTrade} />;
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
					ScrollBarThickness={12}
				BorderSizePixel={0}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0.01, 0)}
						Ref={uiListLayoutRef.value}
					/>
					{playerCards}
				</RescalingScrollingFrame>

				{playerCards.size() === 0 && NoPlayersWarning}

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
