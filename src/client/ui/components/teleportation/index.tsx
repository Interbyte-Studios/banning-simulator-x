import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName, WORLDS } from "shared/configs/worlds";

import { ReturnToWorldSelection } from "./returnToWorldSelection";
import { WorldTeleportCard } from "./worldCard";
import { ZoneTeleportCard } from "./zoneCard";

interface TeleportationProps {
	enabled: boolean;
	visible: boolean;
	hideMenu: () => void;
}

/**
 * A teleportation interface for players with the gamepass.
 */
export const Teleportation = hooks((props: TeleportationProps, { useState, useValue, useEffect }) => {
	if (!props.enabled || !props.visible) {
		return <></>;
	}

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
				teleportationCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
			}
		});
	});

	if (worldTeleportToView !== undefined) {
		const zonesToDisplay: Array<Roact.Element> = [];
		for (const [worldName, worldData] of pairs(WORLDS)) {
			for (const [zoneName, zoneData] of pairs(worldData.zones)) {
				zonesToDisplay.push(<ZoneTeleportCard world={worldName} zone={zoneName} id={zoneData.id} />);
			}
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.675)}
				Image={assetIds.images.ui.teleportation.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.163} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.063)}
					Size={UDim2.fromScale(0.425, 0.11)}
					Font={font}
					Text={`Teleport`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(165, 90, 7) }} />
				</textlabel>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.4, 0.075)}
					Font={font}
					Text={`Select a Zone`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 109, 177) }} />
				</textlabel>

				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.6)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
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
			</imagelabel>
		);
	} else {
		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.675)}
				Image={assetIds.images.ui.teleportation.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.163} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.063)}
					Size={UDim2.fromScale(0.425, 0.11)}
					Font={font}
					Text={`Teleport`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(165, 90, 7) }} />
				</textlabel>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.2)}
					Size={UDim2.fromScale(0.4, 0.075)}
					Font={font}
					Text={`Select a World`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 109, 177) }} />
				</textlabel>

				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.6)}
					Size={UDim2.fromScale(0.95, 0.7)}
					ScrollBarThickness={0}
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
			</imagelabel>
		);
	}
});
