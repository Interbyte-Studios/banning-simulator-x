import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService, Workspace } from "@rbxts/services";
import { font, uiDarkStrokeColor, uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

const player = Players.LocalPlayer;

interface RankUpgradeMappedProps {
	currentRank: number;
	currencies: CurrenciesState;
	experience: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): RankUpgradeMappedProps {
	return {
		currentRank: state.rank,
		currencies: state.currencies,
		experience: state.experience,
	};
}

/**
 * A UI to upgrade a player's rank.
 */
export const RankUpgrade = RoactRodux.connect(mapStateToProps)(
	hooks((props: RankUpgradeMappedProps, hooks) => {
		const { useState, useValue, useEffect, useContext } = hooks;
		const { unlockRank } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const [isVisible, setVisibility] = useState(false);
		const [withinRange, setWithinRange] = useState(false);

		useEffect(() => {
			if (isVisible) {
				return;
			}

			let lastInteraction = 0;
			const interactionDebounce = 1;
			const connection = RunService.Heartbeat.Connect(() => {
				debug.profilebegin("rankUpgrade");
				if (isVisible) {
					return;
				}

				const now = time();
				if (now - lastInteraction < interactionDebounce) {
					return;
				}
				lastInteraction = now;

				const rankInteraction = Workspace.interactions.rankUpgrade.FindFirstChild("teleport") as BasePart;
				if (rankInteraction === undefined) {
					return;
				}

				const character = player.Character;
				if (character === undefined) {
					return;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					return;
				}

				const magnitude = humanoidRootPart.Position.sub(rankInteraction.Position).Magnitude;
				if (magnitude > 15) {
					if (withinRange) {
						setWithinRange(false);
					}
					return;
				}

				setVisibility(true);
				setWithinRange(true);
				debug.profileend();
			});

			return (): void => {
				connection.Disconnect();
			};
		}, [isVisible, withinRange]);

		if (!isVisible) {
			return <></>;
		}

		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get pet mastery UIGridLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get pet mastery ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected pet mastery to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((petCard) => {
				if (petCard.IsA("Frame")) {
					petCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 5);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((petCard) => {
					if (petCard.IsA("Frame")) {
						petCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 5);
					}
				});
			});

			return (): void => connection.Disconnect();
		});

		const exitButton: Roact.Element = (
			<ExitButton
				Position={UDim2.fromScale(0.985, 0.09)}
				minimizedSize={0.06}
				maximizedSize={0.075}
				onClosed={(): void => {
					playSFX(UIEngagement.MinorEngagement);

					setVisibility(false);
				}}
			/>
		);

		const ranksUIs: Array<Roact.Element> = RANKS.map((rankData) => {
			const progressToRank =
				rankData.id > props.currentRank + 1
					? 0
					: props.currentRank >= rankData.id
					? 1
					: rankData.id === 1
					? 1
					: props.experience < rankData.requiredExperience
					? props.experience / rankData.requiredExperience
					: 1;

			return (
				<BaseFrame Size={UDim2.fromScale(1, 0.3)} LayoutOrder={rankData.id}>
					<uiaspectratioconstraint AspectRatio={4.7} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(1, 109, 177)}
						Position={UDim2.fromScale(0, 0.5)}
						Size={UDim2.fromScale(0.99, 0.95)}
					>
						<uiaspectratioconstraint AspectRatio={5} />
						<uicorner CornerRadius={new UDim(0.07, 0)} />

						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

						<RankIcon
							position={UDim2.fromScale(0.1, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
							rank={rankData.id}
						/>

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.575, 0.15),
								Size: UDim2.fromScale(0.7, 0.3),
								Text: rankData.name,
								TextXAlignment: Enum.TextXAlignment.Left,
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.575, 0.4),
								Size: UDim2.fromScale(0.7, 0.2),
								Text: `Required Exp: ${twoDpAbbreviator.numberToString(rankData.requiredExperience)} (${math.floor(
									progressToRank * 100,
								)}%)`,
								TextXAlignment: Enum.TextXAlignment.Left,
							}}
							stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
						/>

						<BaseFrame
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(255, 144, 144)}
							Position={UDim2.fromScale(0.475, 0.85)}
							Size={UDim2.fromScale(0.5, 0.2)}
						>
							<uicorner CornerRadius={new UDim(0.5)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

							<BaseFrame
								AnchorPoint={new Vector2(0, 0)}
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(85, 255, 127)}
								Position={UDim2.fromScale(0, 0)}
								Size={UDim2.fromScale(progressToRank, 1)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
							</BaseFrame>

							<StrokeTextLabel
								native={{
									Size: UDim2.fromScale(0.95, 0.95),
									Text: `${math.floor(progressToRank * 100)}%`,
								}}
								stroke={{ native: { Thickness: 2 } }}
							/>
						</BaseFrame>

						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.875, 0.7),
								Image: progressToRank === 1 ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
							}}
							size={{ maxSize: 0.5, minSize: 0.45 }}
							events={{
								/* eslint-disable jsdoc/require-jsdoc */
								Activated: (): void => {
									playSFX(UIEngagement.MinorEngagement);

									// check to be sure this is the next rank
									if (rankData.id > props.currentRank + 1) {
										addAnnouncement("That rank is too high to upgrade to!", AnnouncementType.Error);
										return;
									}

									// not enough experience to unlock rank
									if (props.experience < rankData.requiredExperience) {
										addAnnouncement("Not enough experience to upgrade.", AnnouncementType.Error);
										return;
									}

									// not enough currency to unlock rank
									if (props.currencies[rankData.cost.currency] < rankData.cost.amount) {
										addAnnouncement("Not enough currency to upgrade.", AnnouncementType.Error);
										return;
									}

									unlockRank.SendToServer();
								},
								/* eslint-enable jsdoc/require-jsdoc */
							}}
						>
							<uiaspectratioconstraint AspectRatio={2} />
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.95, 0.95)}
								Font={font}
								Text={progressToRank === 1 ? (props.currentRank >= rankData.id ? "Owned" : "Purchase") : "Unavailable"}
								TextScaled={true}
								TextColor3={Color3.fromRGB(255, 255, 255)}
							>
								<BaseUIStroke
									native={{
										Thickness: 2,
										Color: progressToRank === 1 ? Color3.fromRGB(44, 126, 102) : Color3.fromRGB(152, 54, 54),
									}}
								/>
							</textlabel>
						</SpringImageButton>

						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.905, 0.225),
								Size: UDim2.fromScale(0.125, 0.3),
								Text: twoDpAbbreviator.numberToString(rankData.cost.amount),
								TextXAlignment: Enum.TextXAlignment.Left,
							}}
							stroke={{
								native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) },
								currencyGradient: rankData.cost.currency,
							}}
						>
							<CurrencyIcon
								anchorPoint={new Vector2(1, 0.5)}
								position={UDim2.fromScale(-0.03, 0.5)}
								size={{ minimizedSize: 0.9, maximizedSize: 1 }}
								currency={rankData.cost.currency}
							/>
						</StrokeTextLabel>
					</BaseFrame>
				</BaseFrame>
			);
		});

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.75),
					Image: assetIds.images.ui["rank upgrade"].background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.058),
						Size: UDim2.fromScale(0.4, 0.1),
						Text: "Ranks",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.95, 0.835)}
					ScrollBarThickness={12}
					BorderSizePixel={0}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
					{ranksUIs}
				</RescalingScrollingFrame>
				{withinRange && exitButton}
			</ImageLabel>
		);
	}),
);
