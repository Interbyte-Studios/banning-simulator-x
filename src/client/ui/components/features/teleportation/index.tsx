import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName, WORLDS } from "shared/configs/worlds";

import { ReturnToWorldSelection } from "./returnToWorldSelection";
import { WorldTeleportCard } from "./worldCard";
import { ZoneTeleportCard } from "./zoneCard";

interface TeleportationProps {
	hideMenu: () => void;
}

/**
 * A teleportation interface for players with the gamepass.
 */
export const Teleportation = hooks((props: TeleportationProps, { useState, useValue, useEffect }) => {
	const [worldTeleportToView, setWorldTeleport] = useState<WorldName | undefined>(undefined);

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Failed to get Teleportation's UIListLayout.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Teleportation ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Teleportation to have a ScrollingFrame.`);

		scrollingFrame.GetChildren().forEach((teleportationCard) => {
			if (teleportationCard.IsA("ImageLabel")) {
				teleportationCard.Size = UDim2.fromOffset(
					scrollingFrame.AbsoluteSize.X,
					scrollingFrame.AbsoluteSize.X / (worldTeleportToView === undefined ? 5 : 4),
				);
			}
		});

		const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			scrollingFrame.GetChildren().forEach((teleportationCard) => {
				if (teleportationCard.IsA("ImageLabel")) {
					teleportationCard.Size = UDim2.fromOffset(
						scrollingFrame.AbsoluteSize.X,
						scrollingFrame.AbsoluteSize.X / (worldTeleportToView === undefined ? 5 : 4),
					);
				}
			});
		});
		return (): void => connection.Disconnect();
	}, [uiListLayoutRef]);

	if (worldTeleportToView !== undefined) {
		const zonesToDisplay: Array<Roact.Element> = [];
		for (const [worldName, worldData] of pairs(WORLDS)) {
			for (const [zoneName, zoneData] of pairs(worldData.zones)) {
				zonesToDisplay.push(<ZoneTeleportCard world={worldName} zone={zoneName} id={zoneData.id} />);
			}
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.675),
					Image: assetIds.images.ui.teleportation.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.163} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.063),
						Size: UDim2.fromScale(0.425, 0.11),
						Text: `Teleport`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.2),
						Size: UDim2.fromScale(0.4, 0.075),
						Text: `Select a Zone`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>

				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.6)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarThickness={12}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Padding={new UDim(0, 10)}
					/>
					{zonesToDisplay}
				</RescalingScrollingFrame>

				<ReturnToWorldSelection returnToSelection={(): void => setWorldTeleport(undefined)} />

				<ExitButton
					Position={UDim2.fromScale(0.975, 0.125)}
					minimizedSize={0.085}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	} else {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.675),
					Image: assetIds.images.ui.teleportation.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.163} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.063),
						Size: UDim2.fromScale(0.425, 0.11),
						Text: `Teleport`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.2),
						Size: UDim2.fromScale(0.4, 0.075),
						Text: `Select a World`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>

				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.6)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarThickness={12}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 10)}
					/>
					{Object.entries(WORLDS).map(([worldName, worldData]) => {
						return (
							<WorldTeleportCard
								world={worldName}
								selectWorld={(): void => setWorldTeleport(worldName)}
								id={worldData.id}
							/>
						);
					})}
				</RescalingScrollingFrame>

				<ExitButton
					Position={UDim2.fromScale(0.975, 0.125)}
					minimizedSize={0.085}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	}
});
