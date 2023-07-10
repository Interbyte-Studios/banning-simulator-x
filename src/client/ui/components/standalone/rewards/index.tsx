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
		const [groupClaimTime, setGroupClaimTime] = useState(0);
		const [clubClaimTime, setClubClaimTime] = useState(0);
		const [vipClaimTime, setVIPClaimTime] = useState(0);

		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const { claimVIPReward, claimClubReward, claimGroupReward } = useContext(remoteContext);

		useEffect(() => {
			const connection = RunService.Heartbeat.Connect(() => {
				const now = DateTime.now();

				if (props.gamepasses.VIP) {
					if (now.UnixTimestamp - props.index.vipRewardClaimed.lastClaimed > 86400) {
						if (vipClaimTime !== 0) {
							setVIPClaimTime(0);
						}
					} else {
						const timeUntilClaim = 86400 - (now.UnixTimestamp - props.index.vipRewardClaimed.lastClaimed);
						setVIPClaimTime(timeUntilClaim);
					}
				}

				if (props.index.groupRank !== undefined) {
					const timeSinceGroupClaim = now.UnixTimestamp - props.index.groupRewardClaimed.lastClaimed;
					const timeSinceClubClaim = now.UnixTimestamp - props.index.clubRewardClaimed.lastClaimed;

					if (timeSinceClubClaim > 86400) {
						if (clubClaimTime !== 0) {
							setClubClaimTime(0);
						}
					} else if (timeSinceGroupClaim > 86400) {
						if (groupClaimTime !== 0) {
							setGroupClaimTime(0);
						}
					} else {
						if (timeSinceClubClaim < timeSinceGroupClaim) {
							const timeUntilClaim = 86400 - timeSinceClubClaim;
							setClubClaimTime(timeUntilClaim);
						} else {
							const timeUntilClaim = 86400 - timeSinceGroupClaim;
							setGroupClaimTime(timeUntilClaim);
						}
					}
				}

				task.wait(1);
			});

			return (): void => connection.Disconnect();
		}, [props.index]);

		if (rewards.isEmpty()) {
			return (
				<>
					{Workspace.interactions.chests.group.GetChildren().map((interaction) => {
						if (!interaction.IsA("BasePart")) {
							return <></>;
						}

						let claimText = "";
						if (clubClaimTime > 0) {
							claimText = `Claim in ${formatTime(clubClaimTime)}`;
						} else if (groupClaimTime > 0) {
							claimText = `Claim in ${formatTime(groupClaimTime)}`;
						} else {
							if (clubClaimTime < groupClaimTime) {
								claimText = "Claim Club Reward";
							} else {
								claimText = "Claim Group Reward";
							}
						}

						return (
							<billboardgui
								Active={true}
								AlwaysOnTop={true}
								LightInfluence={0}
								Size={UDim2.fromScale(12, 10)}
								StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
								MaxDistance={80}
								Adornee={interaction}
							>
								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.5, 0.2),
										Image: assetIds.images.vectors.GemBag,
									}}
									size={{ minSize: 0.4, maxSize: 0.5 }}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</SpringImageButton>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.5),
										Size: UDim2.fromScale(1.5, 0.25),
										FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
										Text: `Group Rewards`,
										TextColor3: Color3.fromRGB(255, 255, 255),
									}}
									stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
								>
									<uigradient
										Rotation={90}
										Color={
											new ColorSequence([
												new ColorSequenceKeypoint(0, Color3.fromRGB(255, 224, 101)),
												new ColorSequenceKeypoint(1, Color3.fromRGB(255, 143, 0)),
											])
										}
									/>
								</StrokeTextLabel>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.7),
										Size: UDim2.fromScale(1.1, 0.2),
										FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
										Text: claimText,
									}}
									stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
								/>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.5, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.4, maxSize: 0.5 }}
									events={{
										/**
										 *
										 */
										Activated: async (): Promise<void> => {
											if (props.index.groupRank === undefined) {
												addAnnouncement(
													"You are not in our group! Join to claim rewards. :)",
													AnnouncementType.Announcement,
												);
												return;
											}

											const now = DateTime.now();
											const timeStamp = now.UnixTimestamp;

											const newItems: RewardsCache = [];

											const claimGroup = timeStamp - props.index.groupRewardClaimed.lastClaimed;
											const claimClub = timeStamp - props.index.clubRewardClaimed.lastClaimed;

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
									}}
								>
									<StrokeTextLabel
										native={{
											Size: UDim2.fromScale(0.8, 0.8),
											Text: "Open",
										}}
										stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
									/>
									<uiaspectratioconstraint AspectRatio={2} />
								</SpringImageButton>
							</billboardgui>
						);
					})}
					{Workspace.interactions.chests.vip.GetChildren().map((interaction) => {
						if (!interaction.IsA("BasePart")) {
							return <></>;
						}

						let claimText = "";
						if (vipClaimTime > 0) {
							claimText = `Claim in ${formatTime(vipClaimTime)}`;
						} else {
							claimText = "Claim VIP Rewards";
						}

						return (
							<billboardgui
								Active={true}
								AlwaysOnTop={true}
								LightInfluence={0}
								Size={UDim2.fromScale(12, 10)}
								StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
								MaxDistance={80}
								Adornee={interaction}
							>
								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.5, 0.2),
										Image: assetIds.images.decals.gamepasses.VIP,
									}}
									size={{ minSize: 0.4, maxSize: 0.5 }}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</SpringImageButton>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.5),
										Size: UDim2.fromScale(1.5, 0.25),
										FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
										Text: `VIP Rewards`,
										TextColor3: Color3.fromRGB(255, 255, 255),
									}}
									stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
								>
									<uigradient
										Rotation={90}
										Color={
											new ColorSequence([
												new ColorSequenceKeypoint(0, Color3.fromRGB(255, 224, 101)),
												new ColorSequenceKeypoint(1, Color3.fromRGB(255, 143, 0)),
											])
										}
									/>
								</StrokeTextLabel>
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.7),
										Size: UDim2.fromScale(1.1, 0.2),
										FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
										Text: claimText,
									}}
									stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
								/>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.5, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.4, maxSize: 0.5 }}
									events={{
										/**
										 *
										 */
										Activated: async (): Promise<void> => {
											if (!props.gamepasses.VIP) {
												addAnnouncement("You don't own the VIP gamepass.", AnnouncementType.Error);
												MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASSES.VIP);
												return;
											}

											const now = DateTime.now();
											const timeStamp = now.UnixTimestamp;

											const newItems: RewardsCache = [];

											const canClaimVIP = timeStamp - props.index.vipRewardClaimed.lastClaimed > 86400;
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
									}}
								>
									<StrokeTextLabel
										native={{
											Size: UDim2.fromScale(0.8, 0.8),
											Text: "Open",
										}}
										stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
									/>
									<uiaspectratioconstraint AspectRatio={2} />
								</SpringImageButton>
							</billboardgui>
						);
					})}
				</>
			);
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
