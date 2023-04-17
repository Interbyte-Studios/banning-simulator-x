import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

import { ZoneTeleportCard } from "../teleportation/zoneCard";

/* eslint-disable jsdoc/require-jsdoc */
export const ZoneSelection = hooks((props: { setZone: (zoneName: ZoneNames) => void }, { useValue, useEffect }) => {
	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Failed to get Spawn Pet Admin UIListLayout.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Spawn Pet Admin ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Spawn Pet Admin to have a ScrollingFrame.`);

		scrollingFrame.GetChildren().forEach((element) => {
			if (element.IsA("ImageLabel")) {
				element.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
			}
		});

		const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			scrollingFrame.GetChildren().forEach((element) => {
				if (element.IsA("ImageLabel")) {
					element.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});

		return (): void => connection.Disconnect();
	});

	const zonesToDisplay: Array<Roact.Element> = [];
	for (const [worldName, worldData] of pairs(WORLDS)) {
		for (const [zoneName, zoneData] of pairs(worldData.zones)) {
			zonesToDisplay.push(
				<ZoneTeleportCard
					world={worldName}
					zone={zoneName}
					id={zoneData.id}
					onActivated={(): void => props.setZone(zoneName)}
				/>,
			);
		}
	}

	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.225),
					Size: UDim2.fromScale(0.6, 0.1),
					Text: "Pick a zone to select pets for fusion",
				}}
				stroke={{
					native: {
						Thickness: 1.5,
						Color: Color3.fromRGB(0, 56, 125),
					},
				}}
			/>
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.62)}
				Size={UDim2.fromScale(0.95, 0.675)}
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
		</>
	);
});
