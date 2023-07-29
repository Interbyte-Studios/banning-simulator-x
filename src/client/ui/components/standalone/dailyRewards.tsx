import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RunService } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { formatTime } from "client/util/formatTime";
import { getEggImage } from "client/util/getEggImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { BOOST_IMAGES, LIMITED_EGG } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { DailyRewardCacheType, DailyRewardsState } from "shared/rodux/dailyRewards";

interface DailyRewardsProps {
	hideMenu: () => void;
}

interface DailyRewardProps extends DailyRewardMappedProps {
	day: number;
}

interface DailyRewardMappedProps {
	dailyRewards: DailyRewardsState;
}

/**
 * Maps the rodux store state to the props that should be passed to the DailyRewards component.
 *
 * @param state The rodux store state.
 * @returns The props that should be passed to the DailyRewards component.
 */
const mapStateToProps = (state: StoreState): DailyRewardMappedProps => {
	return {
		dailyRewards: state.dailyRewards,
	};
};

/**
 * The last time the daily rewards were checked.
 */
let lastCheck = os.time();

/**
 * The DailyReward component.
 *
 * @param props The props that should be passed to the DailyReward component.
 * @param props.day The day of the daily reward.
 * @returns The DailyReward component.
 */
export const DailyReward = RoactRodux.connect(mapStateToProps)(
	hooks((props: DailyRewardProps, { useContext, useState, useEffect }) => {
		const [time, setTime] = useState(0);
		const { claimDailyRewards } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			const connection = RunService.RenderStepped.Connect(() => {
				if (
					props.dailyRewards.daysClaimed.includes(props.day as DailyRewardCacheType) ||
					props.day >= props.dailyRewards.daysClaimed.size() + 2
				) {
					return;
				}

				const now = os.time();
				if (now - lastCheck < 1) {
					return;
				}
				lastCheck = now;
				setTime(os.time());
			});
			return (): void => connection.Disconnect();
		}, [props.dailyRewards, props.day]);

		let highestClaimedDay = 0;
		for (const dayClaimed of props.dailyRewards.daysClaimed) {
			if (dayClaimed > highestClaimedDay) {
				highestClaimedDay = dayClaimed;
			}
		}
		const isNextDay = props.day === highestClaimedDay + 1;

		let rewardDesc = "Bag of Coins";
		let image = assetIds.images.vectors.currencies.CoinBag;
		switch (props.day) {
			case 1: {
				rewardDesc = "Coin Bag";
				image = assetIds.images.vectors.currencies.CoinBag;
				break;
			}
			case 2: {
				rewardDesc = "Currency Boost [2H]";
				image = BOOST_IMAGES["x2 Currency"][120];
				break;
			}
			case 3: {
				rewardDesc = "Robux Egg";
				image = getEggImage(LIMITED_EGG);
				break;
			}
			case 4: {
				rewardDesc = "Luck Boost [2H]";
				image = BOOST_IMAGES["x2 Hatching Luck"][120];
				break;
			}
			case 5: {
				rewardDesc = "Pet XP [2H]";
				image = BOOST_IMAGES["x2 Pet Experience"][120];
				break;
			}
			case 6: {
				rewardDesc = "Coin Chest";
				image = assetIds.images.vectors.currencies.CoinChest;
				break;
			}
			case 7: {
				rewardDesc = "Robux Egg";
				image = getEggImage(LIMITED_EGG);
				break;
			}
		}

		const timeTillClaim = time - props.dailyRewards.lastClaimed;
		const canClaim = timeTillClaim > 86400;
		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(34, 160, 239)}
				Size={UDim2.fromScale(0.825, 0.825)}
				LayoutOrder={props.day}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(15, 104, 159) }} />

				<ImageLabel
					native={{
						Image: image,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.874),
						Image: assetIds.images.ui.index.Claim,
						ImageColor3: canClaim && isNextDay ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(100, 100, 100),
					}}
					size={{ minSize: 0.45, maxSize: 0.5 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

							if (!(canClaim && isNextDay)) {
								addAnnouncement(
									`You can claim your daily reward in ${formatTime(86400 - timeTillClaim)}`,
									AnnouncementType.Error,
								);
								return;
							}

							addAnnouncement(`Reward claimed!`, AnnouncementType.Announcement);
							claimDailyRewards.SendToServer();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Claim",
							TextColor3: canClaim && isNextDay ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(100, 100, 100),
						}}
						stroke={{
							native: {
								Thickness: 2,
								Color: canClaim && isNextDay ? uiClaimButtonStrokeColor : Color3.fromRGB(13, 79, 30),
							},
						}}
					/>

					{isNextDay && !canClaim && (
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, -0.061),
								Size: UDim2.fromScale(0.9, 0.573),
								Text: formatTime(86400 - timeTillClaim),
							}}
							stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(135, 95, 96) } }}
						/>
					)}
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, -0.05),
						Size: UDim2.fromScale(1, 0.162),
						Text: `Day ${props.day}`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.08),
						Size: UDim2.fromScale(1, 0.162),
						Text: rewardDesc,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
			</BaseFrame>
		);
	}),
);

/**
 * The DailyRewards component.
 *
 * @param props The props that should be passed to the DailyRewards component.
 * @returns The DailyRewards component.
 */
export const DailyRewards = (props: DailyRewardsProps): Roact.Element => {
	const dailyRewards: Array<Roact.Element> = [];
	for (let i = 1; i <= 7; i++) {
		dailyRewards.push(<DailyReward day={i} />);
	}

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.4, 0.4),
				Image: assetIds.images.ui.codes.background,
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.1} />
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.125),
					Size: UDim2.fromScale(0.425, 0.165),
					Text: "Daily Rewards",
				}}
				stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
			/>
			<scrollingframe
				AnchorPoint={vec2Middle}
				BorderSizePixel={0}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.595)}
				Size={UDim2.fromScale(0.965, 0.675)}
				CanvasSize={UDim2.fromScale(2, 0)}
				ScrollBarImageColor3={Color3.fromRGB(0, 47, 76)}
				ScrollingDirection={Enum.ScrollingDirection.X}
			>
				<uilistlayout
					Padding={new UDim(0.01, 0)}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{dailyRewards}
			</scrollingframe>
			<ExitButton
				Position={UDim2.fromScale(0.975, 0.135)}
				minimizedSize={0.1}
				maximizedSize={0.15}
				onClosed={(): void => props.hideMenu()}
			/>
		</ImageLabel>
	);
};
