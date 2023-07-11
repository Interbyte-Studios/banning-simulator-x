import Roact from "@rbxts/roact";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { PlayerLeaderboardImage } from "./playerImage";

interface LeaderboardEntry {
	playerId: number;
	amount: number;
	position: number;
}

const LeaderboardCard = hooks((props: { entry: LeaderboardEntry }, { useState, useEffect }) => {
	const [playerName, setPlayerName] = useState("unknown");
	useEffect(() => {
		task.spawn(() => {
			const [success, result] = pcall((): string => Players.GetNameFromUserIdAsync(props.entry.playerId));

			if (success) {
				setPlayerName(result);
			}
		});
	}, []);

	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1.5, 0.125)} LayoutOrder={props.entry.position}>
			<uiaspectratioconstraint AspectRatio={7.5} />

			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(0, 185, 255)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
			>
				<uicorner CornerRadius={new UDim(0.12, 0)} />
				<BaseUIStroke native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 140, 251) }} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.075, 0.5)}
					Size={UDim2.fromScale(0.15, 1)}
					Font={font}
					Text={`#${props.entry.position}`}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<BaseUIStroke native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 140, 251) }} />
				</textlabel>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.425, 0.5)}
					Size={UDim2.fromScale(0.5, 0.8)}
					Font={font}
					Text={playerName}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 140, 251) }} />
				</textlabel>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.85, 0.5)}
					Size={UDim2.fromScale(0.25, 0.8)}
					Font={font}
					Text={statsAbbreviator.numberToString(props.entry.amount)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 2.5, Color: Color3.fromRGB(0, 140, 251) }} />
				</textlabel>
			</frame>
		</frame>
	);
});

export const EggLeaderboard = hooks((props: { adornee: BasePart }, { useState, useEffect, useValue }) => {
	const [leaderboardData, setLeaderboardData] = useState<Array<LeaderboardEntry>>([]);

	useEffect(() => {
		const newLeaderboardData: Array<LeaderboardEntry> = [];

		for (const configuration of ReplicatedStorage.leaderboards.eggs.GetChildren()) {
			const playerId = tonumber(configuration.Name);
			if (playerId === undefined) {
				warn(`Error while updating eggs leaderboards on client: Invalid player ID: ${configuration.Name}`);
				continue;
			}

			const amount = configuration.GetAttribute("amount") as number;
			if (amount === undefined) {
				warn(
					`Error while updating eggs leaderboards on client: Invalid amount: ${configuration.GetAttribute("amount")}`,
				);
				continue;
			}

			const position = configuration.GetAttribute("position") as number;
			if (position === undefined) {
				warn(
					`Error while updating eggs leaderboards on client: Invalid position: ${configuration.GetAttribute(
						"position",
					)}`,
				);
				continue;
			}

			newLeaderboardData.push({ playerId, amount, position });
		}

		setLeaderboardData(newLeaderboardData);

		const connection = ReplicatedStorage.leaderboards.timeUpdated.GetPropertyChangedSignal("Value").Connect(() => {
			task.wait(1);
			const newLeaderboardData: Array<LeaderboardEntry> = [];

			for (const configuration of ReplicatedStorage.leaderboards.eggs.GetChildren()) {
				const playerId = tonumber(configuration.Name);
				if (playerId === undefined) {
					warn(`Error while updating eggs leaderboards on client: Invalid player ID: ${configuration.Name}`);
					continue;
				}

				const amount = configuration.GetAttribute("amount") as number;
				if (amount === undefined) {
					warn(
						`Error while updating eggs leaderboards on client: Invalid amount: ${configuration.GetAttribute("amount")}`,
					);
					continue;
				}

				const position = configuration.GetAttribute("position") as number;
				if (position === undefined) {
					warn(
						`Error while updating eggs leaderboards on client: Invalid position: ${configuration.GetAttribute(
							"position",
						)}`,
					);
					continue;
				}

				newLeaderboardData.push({ playerId, amount, position });
			}

			setLeaderboardData(newLeaderboardData);
		});

		return (): void => connection.Disconnect();
	}, []);

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		if (uiListLayout === undefined) return;

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Egg Leaderboards ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Egg Leaderboards to have a ScrollingFrame.`);

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

	const positions: Array<Roact.Element> = [];
	leaderboardData.forEach((data) => {
		const position = data.position;

		if (position === 1 || position === 2 || position === 3) {
			const element = <PlayerLeaderboardImage position={position} playerId={data.playerId} />;
			positions.push(element);
		}
	});

	const leaderboards: Array<Roact.Element> = [];
	leaderboardData.forEach((data) => leaderboards.push(<LeaderboardCard entry={data} />));

	return (
		<surfacegui LightInfluence={0} Adornee={props.adornee} SizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud}>
			{positions}
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.615)}
				Size={UDim2.fromScale(0.95, 0.735)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				ScrollBarThickness={20}
				ScrollBarImageColor3={Color3.fromRGB(0, 185, 255)}
			>
				<uilistlayout Padding={new UDim(0.002, 0)} Ref={uiListLayoutRef.value} SortOrder={Enum.SortOrder.LayoutOrder} />
				{leaderboards}
			</RescalingScrollingFrame>
		</surfacegui>
	);
});
