// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Accolade, AccoladeCompletion } from "shared/configs/accolades";
import { BOOST_IMAGES } from "shared/configs/game";
import { ClaimAccoladeFailKind } from "shared/remotes/accolades/claimAccolade";
import { ValidBoostTime } from "shared/rodux/boosts";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/* eslint-disable jsdoc/require-jsdoc */
export const AccoladeCard = hooks(
	(
		props: {
			playerViewing: Player;
			ownsAccolade: boolean;
			accoladeProgress: AccoladeCompletion;
			accoladeData: Accolade;
		},
		hooks,
	) => {
		const { useContext } = hooks;
		const { claimAccolade } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		return (
			<BaseFrame BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.3)} LayoutOrder={props.accoladeData.id}>
				<uiaspectratioconstraint AspectRatio={7} />

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(33, 113, 159)}
					Size={UDim2.fromScale(0.99, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

					<BaseFrame
						BackgroundTransparency={0}
						Position={UDim2.fromScale(0.335, 0.75)}
						Size={UDim2.fromScale(0.65, 0.325)}
						BackgroundColor3={Color3.fromRGB(200, 124, 135)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

						<BaseFrame
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(
								props.accoladeProgress === true
									? 1
									: props.accoladeProgress.progress / props.accoladeProgress.maxProgress,
								1,
							)}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
							BackgroundTransparency={0}
							Visible={
								props.accoladeProgress !== true || false ? props.accoladeProgress.progress > 0 : props.accoladeProgress
							}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</BaseFrame>

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(1, 0.9),
								Text:
									props.accoladeProgress === true
										? "Completed"
										: `${props.accoladeProgress.progress} / ${
												props.accoladeProgress.maxProgress
										  } (${twoDpAbbreviator.numberToString(props.accoladeProgress.progressPercentage * 100)}%)`,
							}}
							stroke={{
								native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) },
							}}
						></StrokeTextLabel>
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.865, 0.85),
							Size: UDim2.fromScale(0.25, 0.225),
							Text:
								props.accoladeData.reward.rewardType === "coins" || props.accoladeData.reward.rewardType === "gems"
									? `${twoDpAbbreviator.numberToString(props.accoladeData.reward.amount)} Currency`
									: `${props.accoladeData.reward.rewardType} Boost`,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) } }}
					></StrokeTextLabel>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.325, 0.32),
							Size: UDim2.fromScale(0.6, 0.3),
							Text: props.accoladeData.name,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) } }}
					></StrokeTextLabel>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.825, 0.4),
							Image: assetIds.images.ui.index.Claim,
							ScaleType: Enum.ScaleType.Fit,
						}}
						events={{
							Activated: async (): Promise<void> => {
								playSFX(UIEngagement.MinorEngagement);
								if (props.playerViewing.UserId !== Players.LocalPlayer.UserId) {
									return;
								}

								if (props.accoladeProgress !== true) {
									addAnnouncement("You don't meet the requirements to claim that accolade.", AnnouncementType.Error);
									return;
								}

								const requestClaimedAccolade = await claimAccolade.CallServerAsync(props.accoladeData.id);
								if (requestClaimedAccolade.success) {
									addAnnouncement("You've claimed the accolade. Congratulations!", AnnouncementType.Announcement);
									return;
								} else {
									switch (requestClaimedAccolade.reason) {
										case ClaimAccoladeFailKind.AlreadyRedeemed: {
											addAnnouncement("You've already redeemed that accolade!", AnnouncementType.Error);
											return;
										}
										case ClaimAccoladeFailKind.NotEnoughProgress: {
											addAnnouncement(
												"You don't meet the requirements to claim that accolade.",
												AnnouncementType.Error,
											);
											return;
										}
									}
								}
							},
						}}
						size={{ maxSize: 0.6, minSize: 0.5 }}
					>
						<uiaspectratioconstraint AspectRatio={2} />

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.8, 0.8),
								Text: props.ownsAccolade
									? "Claimed"
									: props.playerViewing.UserId === Players.LocalPlayer.UserId
									? "Claim"
									: "Unclaimed",
							}}
							stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(91, 153, 79) } }}
						></StrokeTextLabel>
					</SpringImageButton>

					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.95, 0.375),
							Size: UDim2.fromScale(0.6, 0.6),
							Image:
								props.accoladeData.reward.rewardType === "coins"
									? assetIds.images.vectors.Coin
									: props.accoladeData.reward.rewardType === "gems"
									? assetIds.images.vectors.GemBag
									: BOOST_IMAGES[props.accoladeData.reward.rewardType][
											props.accoladeData.reward.amount as ValidBoostTime
									  ],
							ScaleType: Enum.ScaleType.Fit,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
