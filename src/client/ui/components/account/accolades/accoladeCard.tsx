import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
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

		const minimizedSize = 0.5;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.6;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = useBindingMotor(hooks, maximizedSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.3)}
				LayoutOrder={props.accoladeData.id}
			>
				<uiaspectratioconstraint AspectRatio={7} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(33, 113, 159)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.99, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

					<frame
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.335, 0.75)}
						Size={UDim2.fromScale(0.65, 0.325)}
						BackgroundColor3={Color3.fromRGB(200, 124, 135)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

						<frame
							Size={UDim2.fromScale(
								props.accoladeProgress === true
									? 1
									: props.accoladeProgress.progress / props.accoladeProgress.maxProgress,
								1,
							)}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</frame>

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 0.9)}
							Font={font}
							Text={
								props.accoladeProgress === true
									? "Completed"
									: `${props.accoladeProgress.progress} / ${
											props.accoladeProgress.maxProgress
									  } (${twoDpAbbreviator.numberToString(props.accoladeProgress.progressPercentage * 100)}%)`
							}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
						</textlabel>
					</frame>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.865, 0.85)}
						Size={UDim2.fromScale(0.25, 0.225)}
						Font={font}
						Text={
							props.accoladeData.reward.rewardType === "coins" || props.accoladeData.reward.rewardType === "gems"
								? `${twoDpAbbreviator.numberToString(props.accoladeData.reward.amount)} Currency`
								: `${props.accoladeData.reward.rewardType} Boost`
						}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
					</textlabel>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.325, 0.32)}
						Size={UDim2.fromScale(0.6, 0.3)}
						Font={font}
						Text={props.accoladeData.name}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.825, 0.4)}
						Size={motor.binding.map((value) => {
							return UDim2.fromScale(1, value);
						})}
						Image={assetIds.images.ui.index.Claim}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
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
							MouseEnter: (): void => motor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.8, 0.8)}
							Font={font}
							Text={
								props.ownsAccolade
									? "Claimed"
									: props.playerViewing.UserId === Players.LocalPlayer.UserId
									? "Claim"
									: "Unclaimed"
							}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(91, 153, 79) }} />
						</textlabel>
					</imagebutton>

					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.95, 0.375)}
						Size={UDim2.fromScale(0.6, 0.6)}
						Image={
							props.accoladeData.reward.rewardType === "coins"
								? assetIds.images.vectors.Coin
								: props.accoladeData.reward.rewardType === "gems"
								? assetIds.images.vectors.GemBag
								: BOOST_IMAGES[props.accoladeData.reward.rewardType][props.accoladeData.reward.amount as ValidBoostTime]
						}
						ScaleType={Enum.ScaleType.Fit}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagelabel>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
