import Roact from "@rbxts/roact";
import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
	uiHeaderStrokeColor,
	uiOffButtonStrokeColor,
	vec2Middle,
} from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";

import { PrestigeCard } from "./prestigeCard";

/**
 * A component allowing the user to purchase and claim rewards via world prestige.
 */
export const WorldPrestigePath = hooks(
	(
		props: { worldName: WorldName; setVisibility: (value: boolean) => void },
		{ useState, useValue, useEffect, useContext },
	) => {
		const [prestigeVerification, setPrestigeVerification] = useState(false);
		const { claimPrestige } = useContext(remoteContext);

		if (prestigeVerification) {
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
							Text: "Prestige",
						}}
						stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
					/>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.75, 0.9),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.2, maxSize: 0.25 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								claimPrestige.SendToServer(props.worldName);
								props.setVisibility(false);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.85, 0.85),
								Text: "Continue",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.25, 0.9),
							Image: assetIds.images.ui.index.Off,
						}}
						size={{ minSize: 0.2, maxSize: 0.25 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								setPrestigeVerification(false);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.85, 0.85),
								Text: "Exit",
							}}
							stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.225),
							Size: UDim2.fromScale(0.95, 0.185),
							Text: "Are you sure you want to prestige? This action cannot be undone.",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.325),
							Size: UDim2.fromScale(0.95, 0.08),
							Text: "Please read below to understand what will happen:",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.4),
							Size: UDim2.fromScale(0.95, 0.05),
							Text: "You will lose the following progress:",
						}}
						stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.95, 0.15),
							Text: "Your coins, rank, and experience will be reset. Additionally, you will no longer be able to equip weapons or talismans until you unlock their required rank again.",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.615),
							Size: UDim2.fromScale(0.95, 0.05),
							Text: "You will gain the following:",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.725),
							Size: UDim2.fromScale(0.95, 0.15),
							Text: "You will gain a prestige token, which can be used for permanent upgrades. Additionally, you will be able to equip your talismans and weapons once you unlock ranks again without having to re-purchase them.",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<ExitButton
						Position={UDim2.fromScale(0.985, 0.09)}
						minimizedSize={0.06}
						maximizedSize={0.075}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);

							setPrestigeVerification(false);
						}}
					/>
				</ImageLabel>
			);
		} else {
			const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
			useEffect(() => {
				const uiListLayout = uiListLayoutRef.value.getValue();
				assert(uiListLayout, `Failed to get world prestige UIGridLayout.`);

				const scrollingFrame = uiListLayout.Parent;
				assert(scrollingFrame, `Failed to get world prestige ScrollingFrame.`);
				assert(scrollingFrame.IsA("ScrollingFrame"), `Expected world prestige to have a ScrollingFrame.`);

				scrollingFrame.GetChildren().forEach((prestigeCard) => {
					if (prestigeCard.IsA("Frame")) {
						prestigeCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});

				const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
					scrollingFrame.GetChildren().forEach((prestigeCard) => {
						if (prestigeCard.IsA("Frame")) {
							prestigeCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
						}
					});
				});

				return (): void => connection.Disconnect();
			});

			const prestigeCards: Array<Roact.Element> = [];
			for (let i = 1; i <= 51; i++) {
				prestigeCards.push(
					<PrestigeCard
						worldName={props.worldName}
						prestigeNumber={i}
						displayVerification={(): void => setPrestigeVerification(true)}
					/>,
				);
			}

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
							Text: "Prestige",
						}}
						stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
					/>
					<RescalingScrollingFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.55)}
						Size={UDim2.fromScale(0.95, 0.835)}
						ScrollBarThickness={0}
						ScrollingDirection={Enum.ScrollingDirection.Y}
					>
						<uilistlayout
							SortOrder={Enum.SortOrder.LayoutOrder}
							Ref={uiListLayoutRef.value}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							Padding={new UDim(0, 5)}
						/>
						{prestigeCards}
					</RescalingScrollingFrame>
					<ExitButton
						Position={UDim2.fromScale(0.985, 0.09)}
						minimizedSize={0.06}
						maximizedSize={0.075}
						onClosed={(): void => {
							playSFX(UIEngagement.MinorEngagement);

							props.setVisibility(false);
						}}
					/>
				</ImageLabel>
			);
		}
	},
);
