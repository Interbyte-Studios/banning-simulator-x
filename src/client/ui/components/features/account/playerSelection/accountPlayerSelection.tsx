import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const AccountPlayerSelection = hooks(
	(props: { setPlayerViewed: (player: Player) => void; returnToSelection: () => void }, hooks) => {
		const { useState, useEffect } = hooks;

		const [playersInGame, setPlayersInGame] = useState<Array<Player>>(Players.GetPlayers());

		useEffect(() => {
			const addedConnection = Players.PlayerAdded.Connect(() => {
				setPlayersInGame(Players.GetPlayers());
			});

			const removedConnection = Players.PlayerRemoving.Connect(() => {
				setPlayersInGame(Players.GetPlayers());
			});

			return (): void => {
				addedConnection.Disconnect();
				removedConnection.Disconnect();
			};
		});

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(19, 81, 128)}
				Position={UDim2.fromScale(0.23, 0.565)}
				Size={UDim2.fromScale(0.425, 0.775)}
			>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					ScrollBarThickness={12}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout Padding={new UDim(0.02, 0)} HorizontalAlignment={Enum.HorizontalAlignment.Center} />

					{playersInGame.map((oPlayer) => {
						const minimizedSize = 0.8;
						const maximizedSize = 0.9;

						const thumbnailType = Enum.ThumbnailType.HeadShot;
						const thumbnailSize = Enum.ThumbnailSize.Size420x420;
						const [content, isReady] = Players.GetUserThumbnailAsync(oPlayer.UserId, thumbnailType, thumbnailSize);

						return (
							<BaseFrame
								BackgroundTransparency={0}
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(45, 167, 230)}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(1, 0.125)}
							>
								<uiaspectratioconstraint AspectRatio={7} />
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<BaseUIStroke native={{ Color: Color3.fromRGB(12, 52, 79), Thickness: 1.5 }} />

								<BaseFrame
									BackgroundTransparency={0}
									AnchorPoint={vec2Middle}
									BackgroundColor3={Color3.fromRGB(12, 52, 79)}
									Position={UDim2.fromScale(0.075, 0.5)}
									Size={UDim2.fromScale(0.9, 0.9)}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />

									<ImageLabel
										native={{
											Size: UDim2.fromScale(1, 1),
											ScaleType: Enum.ScaleType.Fit,
											Image: isReady && content ? content : "",
										}}
									>
										<uicorner CornerRadius={new UDim(1, 0)} />
									</ImageLabel>
								</BaseFrame>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.825, 0.5),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: minimizedSize, maxSize: maximizedSize }}
									events={{
										Activated: (): void => {
											playSFX(UIEngagement.MinorEngagement);
											props.setPlayerViewed(oPlayer);
											props.returnToSelection();
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Size: UDim2.fromScale(0.8, 0.8),
											Text: "View",
										}}
										stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(28, 162, 62) } }}
									/>
								</SpringImageButton>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.4, 0.5),
										Size: UDim2.fromScale(0.45, 0.9),
										Text: oPlayer.Name,
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(12, 52, 79) } }}
								/>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
				<uicorner CornerRadius={new UDim(0.075, 0)} />
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
