import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService, Workspace } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
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
import { getPetDecal } from "client/util/getPetDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { BOOST_IMAGES, BoostProduct, GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PlayerIndexState } from "shared/rodux/playerIndex";

interface SpinWheelMappedProps {
	index: PlayerIndexState;
	gamepasses: GamepassesState;
}

/**
 *
 * @param state The current state of the store.
 * @returns Mapped props.
 */
function mapStateToProps(state: StoreState): SpinWheelMappedProps {
	return {
		index: state.index,
		gamepasses: state.gamepasses,
	};
}

type RewardsCache = Array<{ rewardType: "Pet" | "Boost"; identifier: number | BoostProduct }>;

/**
 * Rewards component.
 */
export const Rewards = RoactRodux.connect(mapStateToProps)(
	hooks((props: SpinWheelMappedProps, { useState, useContext, useEffect }) => {
		const [rewards, setRewards] = useState<RewardsCache>([]);

		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const { claimVIPReward, claimClubReward, claimGroupReward } = useContext(remoteContext);

		useEffect(() => {
			const groupInteraction = Workspace.interactions.GroupChest.interact.ProximityPrompt.Triggered.Connect(
				async () => {
					if (props.index.groupRank === undefined) {
						addAnnouncement("You are not in our group! Join to claim rewards. :)", AnnouncementType.Announcement);
						return;
					}

					const now = DateTime.now().UnixTimestamp;

					const newItems: RewardsCache = [];

					const claimGroup = now - props.index.groupRewards.lastClaimed.UnixTimestamp;
					const claimClub = now - props.index.clubRewards.lastClaimed.UnixTimestamp;

					const canClaimGroup = claimGroup > 86400;

					if (canClaimGroup) {
						const result = await claimGroupReward.CallServerAsync();
						if (result.success) {
							if (result.petId !== undefined) {
								newItems.push({ rewardType: "Pet", identifier: result.petId });
							}

							if (result.boost !== undefined) {
								newItems.push({ rewardType: "Boost", identifier: result.boost.name });
							}
							warn(`Added group rewards to display rewards`);
						}
					}

					if (props.index.groupRank >= 247) {
						const canClaimClubReward = claimClub > 86400;
						if (canClaimClubReward) {
							const result = await claimClubReward.CallServerAsync();
							if (result.success) {
								if (result.petId !== undefined) {
									newItems.push({ rewardType: "Pet", identifier: result.petId });
								}

								if (result.boost !== undefined) {
									newItems.push({ rewardType: "Boost", identifier: result.boost.name });
								}
								warn(`Added club rewards to display rewards`);
							}
						}
					}

					if (newItems.size() < 1) {
						if (claimClub < claimGroup) {
							addAnnouncement(
								`You have ${formatTime(86400 - claimClub)} until you can claim again.`,
								AnnouncementType.Announcement,
							);
							return;
						} else if (claimGroup < claimClub) {
							addAnnouncement(
								`You have ${formatTime(86400 - claimGroup)} until you can claim again.`,
								AnnouncementType.Announcement,
							);
							return;
						} else {
							addAnnouncement("You have no rewards to claim right now.", AnnouncementType.Announcement);
							return;
						}
					}

					setRewards(newItems);
				},
			);

			const vipInteraction = Workspace.interactions["VIP Chest"].interact.ProximityPrompt.Triggered.Connect(
				async () => {
					if (!props.gamepasses.VIP) {
						addAnnouncement("You don't own the VIP gamepass.", AnnouncementType.Error);
						MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASSES.VIP);
						return;
					}

					const now = DateTime.now();

					const newItems: RewardsCache = [];

					const canClaimVIP = now.UnixTimestamp - props.index.vipRewards.lastClaimed.UnixTimestamp > 86400;
					if (canClaimVIP) {
						const result = await claimVIPReward.CallServerAsync();
						if (result.success) {
							if (result.petId !== undefined) {
								newItems.push({ rewardType: "Pet", identifier: result.petId });
							}

							if (result.boost !== undefined) {
								newItems.push({ rewardType: "Boost", identifier: result.boost.name });
							}
						}
					}

					if (newItems.size() < 1) {
						addAnnouncement("You have no rewards to claim right now.", AnnouncementType.Announcement);
						return;
					}

					setRewards(newItems);
				},
			);

			return (): void => {
				groupInteraction.Disconnect();
				vipInteraction.Disconnect();
			};
		});

		useEffect(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				const now = DateTime.now();

				if (props.gamepasses.VIP) {
					if (now.UnixTimestamp - props.index.vipRewards.lastClaimed.UnixTimestamp > 86400) {
						Workspace.interactions["VIP Chest"].interact.ProximityPrompt.ActionText = "Claim VIP Reward";
					} else {
						const timeUntilClaim = 86400 - (now.UnixTimestamp - props.index.vipRewards.lastClaimed.UnixTimestamp);
						Workspace.interactions["VIP Chest"].interact.ProximityPrompt.ActionText = `Claim in ${formatTime(
							timeUntilClaim,
						)}`;
					}
				}

				if (props.index.groupRank !== undefined) {
					const timeSinceGroupClaim = now.UnixTimestamp - props.index.groupRewards.lastClaimed.UnixTimestamp;
					const timeSinceClubClaim = now.UnixTimestamp - props.index.clubRewards.lastClaimed.UnixTimestamp;

					if (timeSinceClubClaim > 86400) {
						Workspace.interactions.GroupChest.interact.ProximityPrompt.ActionText = "Claim Club Reward";
					} else if (timeSinceGroupClaim > 86400) {
						Workspace.interactions.GroupChest.interact.ProximityPrompt.ActionText = "Claim Group Reward";
					} else {
						if (timeSinceClubClaim < timeSinceGroupClaim) {
							const timeUntilClaim = 86400 - timeSinceClubClaim;
							Workspace.interactions.GroupChest.interact.ProximityPrompt.ActionText = `Claim in ${formatTime(
								timeUntilClaim,
							)}`;
						} else {
							const timeUntilClaim = 86400 - timeSinceGroupClaim;
							Workspace.interactions.GroupChest.interact.ProximityPrompt.ActionText = `Claim in ${formatTime(
								timeUntilClaim,
							)}`;
						}
					}
				}

				task.wait(1);
			});

			return (): void => connection.Disconnect();
		}, []);

		if (rewards.isEmpty()) {
			return <></>;
		} else {
			const cellSize =
				rewards.size() <= 2
					? UDim2.fromScale(0.5, 0.6)
					: rewards.size() <= 4
					? UDim2.fromScale(0.4, 0.45)
					: UDim2.fromScale(0.3, 0.4);

			return (
				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.28, 0.4),
						Image: assetIds.images.ui.trading.playerSelection,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.2} />
					<BaseFrame Position={UDim2.fromScale(0.5, 0.45)} Size={UDim2.fromScale(0.9, 0.575)}>
						<uigridlayout
							CellPadding={UDim2.fromScale(0, 0.1)}
							CellSize={cellSize}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>
						{rewards.map((reward) => {
							let decal: string | undefined;
							if (reward.rewardType === "Pet") {
								decal = getPetDecal(reward.identifier as number, "regular");
							} else {
								decal = BOOST_IMAGES[reward.identifier as BoostProduct][15];
							}

							if (decal === undefined) {
								warn(`[Rewards] Decal for ${reward.rewardType} ${reward.identifier} is undefined!`);
								return <></>;
							}

							return (
								<BaseFrame BackgroundTransparency={0} BackgroundColor3={uiTextStrokeColor}>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />

									<ImageLabel
										native={{
											Size: UDim2.fromScale(0.85, 0.85),
											Position: UDim2.fromScale(0.45, 0.5),
											Image: decal,
										}}
									/>
									{reward.rewardType === "Boost" && (
										<StrokeTextLabel
											native={{
												Position: UDim2.fromScale(0.5, 0.9),
												Size: UDim2.fromScale(1, 0.4),
												Text: reward.identifier as BoostProduct,
											}}
											stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
										/>
									)}
								</BaseFrame>
							);
						})}
					</BaseFrame>
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.85),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.25, maxSize: 0.3 }}
						events={{
							/**
							 * When the button is activated.
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								addAnnouncement("You have claimed your rewards!", AnnouncementType.Announcement);
								setRewards([]);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.8, 0.8),
								Text: "Claim!",
							}}
							stroke={{ native: { Thickness: 1.5, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.5, 0.15),
							Text: "Rewards!",
						}}
						stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
					/>
					<ExitButton
						Position={UDim2.fromScale(0.975, 0.025)}
						minimizedSize={0.095}
						maximizedSize={0.11}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);
							setRewards([]);
						}}
					/>
				</ImageLabel>
			);
		}
	}),
);
