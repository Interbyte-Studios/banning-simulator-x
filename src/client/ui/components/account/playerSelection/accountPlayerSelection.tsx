import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
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
			<frame
				AnchorPoint={vec2Middle}
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
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout Padding={new UDim(0.02, 0)} HorizontalAlignment={Enum.HorizontalAlignment.Center} />

					{playersInGame.map((oPlayer) => {
						const minimizedSize = 0.8;
						const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

						const maximizedSize = 0.9;
						const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

						const { motor, binding } = useBindingMotor(hooks, maximizedSize);

						const thumbnailType = Enum.ThumbnailType.HeadShot;
						const thumbnailSize = Enum.ThumbnailSize.Size420x420;
						const [content, isReady] = Players.GetUserThumbnailAsync(oPlayer.UserId, thumbnailType, thumbnailSize);

						return (
							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(45, 167, 230)}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(1, 0.125)}
							>
								<uiaspectratioconstraint AspectRatio={7} />
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<BaseUIStroke native={{ Color: Color3.fromRGB(12, 52, 79), Thickness: 1.5 }} />

								<frame
									AnchorPoint={vec2Middle}
									BackgroundColor3={Color3.fromRGB(12, 52, 79)}
									Position={UDim2.fromScale(0.075, 0.5)}
									Size={UDim2.fromScale(0.9, 0.9)}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />

									<imagelabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.5, 0.5)}
										Size={UDim2.fromScale(1, 1)}
										Image={isReady && content ? content : ""}
										ScaleType={Enum.ScaleType.Fit}
									>
										<uicorner CornerRadius={new UDim(1, 0)} />
									</imagelabel>
								</frame>

								<imagebutton
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.825, 0.5)}
									Size={binding.map((value) => {
										return UDim2.fromScale(0.3, value);
									})}
									Image={assetIds.images.ui.index.Claim}
									ScaleType={Enum.ScaleType.Fit}
									Event={{
										Activated: (): void => {
											playSFX(UIEngagement.MinorEngagement);
											props.setPlayerViewed(oPlayer);
											props.returnToSelection();
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
										Text={"View"}
										TextColor3={Color3.fromRGB(255, 255, 255)}
										TextScaled={true}
									>
										<BaseUIStroke native={{ Color: Color3.fromRGB(28, 162, 62), Thickness: 1.5 }} />
									</textlabel>
								</imagebutton>

								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.4, 0.5)}
									Size={UDim2.fromScale(0.45, 0.9)}
									Font={font}
									Text={oPlayer.Name}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Color: Color3.fromRGB(12, 52, 79), Thickness: 1.5 }} />
								</textlabel>
							</frame>
						);
					})}
				</RescalingScrollingFrame>
				<uicorner CornerRadius={new UDim(0.075, 0)} />
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
