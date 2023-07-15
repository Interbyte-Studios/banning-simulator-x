import Roact from "@rbxts/roact";
import { MarketplaceService, Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { GAMEPASS_GIFTS, Gamepasses } from "shared/configs/game";
import { StoreState } from "shared/rodux";

export const GiftGamepass = hooks(
	(props: { gamepassName: Gamepasses; returnToShop: () => void }, { useState, useValue, useEffect, useContext }) => {
		const [playerToGift, setPlayerToGift] = useState<Player | undefined>(undefined);
		const [giftSuccessful, setGiftSuccessful] = useState(false);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const { useGamepassGift } = useContext(remoteContext);

		useEffect(() => {
			const connection = MarketplaceService.PromptProductPurchaseFinished.Connect((userId, productId, isPurchased) => {
				if (userId !== Players.LocalPlayer.UserId) {
					return;
				}

				if (productId !== GAMEPASS_GIFTS[props.gamepassName]) {
					return;
				}

				if (!isPurchased) {
					return;
				}

				if (playerToGift === undefined) {
					addAnnouncement(
						`There was an issue gifting that player. Please contact a developer immediately.`,
						AnnouncementType.Error,
					);
					setPlayerToGift(undefined);
					setGiftSuccessful(false);
					return;
				}

				useGamepassGift.SendToServer(props.gamepassName, playerToGift);
				setGiftSuccessful(true);
			});

			return (): void => connection.Disconnect();
		});

		if (giftSuccessful) {
			return (
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.28, 0.4),
						Image: assetIds.images.ui.trading.playerSelection,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.2} />
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.2),
							Size: UDim2.fromScale(0.4, 0.4),
							Image: assetIds.images.decals.gamepasses[props.gamepassName],
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.575),
							Size: UDim2.fromScale(0.95, 0.2),
							Text:
								playerToGift !== undefined
									? `You successfully gifted "${playerToGift.Name}"`
									: "Your gift was sent successfully.",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.85),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.2, maxSize: 0.3 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.returnToShop();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.8, 0.8),
								Text: "Ok!",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>
					<ExitButton
						Position={UDim2.fromScale(0.975, 0.025)}
						minimizedSize={0.095}
						maximizedSize={0.11}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.returnToShop();
						}}
					/>
				</ImageLabel>
			);
		} else if (playerToGift !== undefined) {
			return (
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.28, 0.4),
						Image: assetIds.images.ui.trading.playerSelection,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.2} />
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.2),
							Size: UDim2.fromScale(0.4, 0.4),
							Image: assetIds.images.decals.gamepasses[props.gamepassName],
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.55),
							Size: UDim2.fromScale(0.95, 0.3),
							Text: `Are you sure you want to gift ${props.gamepassName} to ${playerToGift.Name} (You are buying this for someone else, not for yourself)?`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.85),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.2, maxSize: 0.3 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASS_GIFTS[props.gamepassName]);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.8, 0.8),
								Text: "Gift",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>
					<ExitButton
						Position={UDim2.fromScale(0.975, 0.025)}
						minimizedSize={0.095}
						maximizedSize={0.11}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);
							setPlayerToGift(undefined);
						}}
					/>
				</ImageLabel>
			);
		} else {
			const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
			useEffect(() => {
				const uiListLayout = uiListLayoutRef.value.getValue();
				assert(uiListLayout, `Failed to get Gamepass Gifting's UIListLayout.`);

				const scrollingFrame = uiListLayout.Parent;
				assert(scrollingFrame, `Failed to get Gamepass Gifting ScrollingFrame.`);
				assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Gamepass Gifting to have a ScrollingFrame.`);

				scrollingFrame.GetChildren().forEach((card) => {
					if (card.IsA("Frame")) {
						card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});
			}, [uiListLayoutRef]);

			return (
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.28, 0.4),
						Image: assetIds.images.ui.trading.playerSelection,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.8, 0.15),
							Text: "Select a Player to Gift",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<RescalingScrollingFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.55)}
						Size={UDim2.fromScale(0.95, 0.75)}
						ScrollBarThickness={12}
						BorderSizePixel={0}
						ScrollingDirection={Enum.ScrollingDirection.Y}
						ScrollBarImageColor3={uiDarkStrokeColor}
					>
						<uilistlayout
							Padding={new UDim(0.01, 0)}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							Ref={uiListLayoutRef.value}
						/>
						{Players.GetPlayers().map((player) => {
							if (player.UserId === Players.LocalPlayer.UserId) {
								return <></>;
							}

							let playerStore: StoreState | undefined;
							const [success, dataOrError] = pcall(() => retrieveStore(player));
							if (success) {
								if (dataOrError !== undefined) {
									playerStore = dataOrError.getState();
								}
							}

							return (
								<BaseFrame Size={UDim2.fromScale(0.95, 0.08)}>
									<uiaspectratioconstraint AspectRatio={6.9} />
									<BaseFrame
										BackgroundColor3={Color3.fromRGB(12, 134, 211)}
										BackgroundTransparency={0}
										Size={UDim2.fromScale(0.95, 0.95)}
									>
										<uiaspectratioconstraint AspectRatio={6.9} />
										<uicorner CornerRadius={new UDim(0.2, 0)} />
										<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

										<StrokeTextLabel
											native={{
												Position: UDim2.fromScale(0.325, 0.5),
												Size: UDim2.fromScale(0.6, 1),
												TextXAlignment: Enum.TextXAlignment.Left,
												Text: player.Name,
											}}
											stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
										/>

										<SpringImageButton
											native={{
												Position: UDim2.fromScale(0.85, 0.5),
												Image: assetIds.images.ui.index.Claim,
											}}
											size={{ minSize: 0.7, maxSize: 0.8 }}
											events={{
												/**
												 *
												 */
												Activated: (): void => {
													playSFX(UIEngagement.MajorEngagement);

													if (playerStore !== undefined) {
														if (playerStore.gamepasses[props.gamepassName]) {
															addAnnouncement(`They already own the gamepass.`, AnnouncementType.Error);
															return;
														} else {
															setPlayerToGift(player);
														}
													} else {
														addAnnouncement(`There was an issue gifting that player!`, AnnouncementType.Error);
														return;
													}
												},
											}}
										>
											<uiaspectratioconstraint AspectRatio={2} />
											<StrokeTextLabel
												native={{
													Size: UDim2.fromScale(0.9, 0.9),
													Text: "Select",
												}}
												stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
											/>
										</SpringImageButton>
									</BaseFrame>
								</BaseFrame>
							);
						})}
					</RescalingScrollingFrame>
					<ExitButton
						Position={UDim2.fromScale(0.975, 0.025)}
						minimizedSize={0.095}
						maximizedSize={0.11}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.returnToShop();
						}}
					/>
				</ImageLabel>
			);
		}
	},
);
