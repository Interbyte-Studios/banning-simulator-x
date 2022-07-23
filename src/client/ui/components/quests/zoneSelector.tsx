import Roact from "@rbxts/roact";
import {
	color3White,
	font,
	udim2BottomMiddle,
	udim2BottomRight,
	udim2Middle,
	vec2Middle,
} from "client/ui/commonValues";
import { BaseImageButton } from "client/ui/elements/baseImageButton";
import { ExitButton } from "client/ui/elements/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

interface ZoneSelectorProps {
	world: WorldName;
	zones: Array<{ name: ZoneNames; layoutOrder: number }>;
	onZoneSelected: (zoneName?: ZoneNames) => void;
	onClose: () => void;
}

/**
 * Renders all the zones for a given world to allow the user to select one, as well as the world itself.
 *
 * @param props The props to create the zone selector.
 * @returns The Roact element to render.
 */
/* eslint-disable jsdoc/require-jsdoc */
export function ZoneSelector(props: ZoneSelectorProps): Roact.Element {
	return (
		<frame Position={udim2Middle} Size={UDim2.fromScale(0.65, 0.6)} AnchorPoint={vec2Middle} BackgroundTransparency={1}>
			<RescalingScrollingFrame
				Size={udim2BottomRight}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			>
				<uigridlayout CellSize={UDim2.fromScale(1, 0.3)} SortOrder={Enum.SortOrder.LayoutOrder} />
				{/* display the world as a selection */}
				<BaseImageButton
					Image={assetIds.images.maps[props.world].world}
					Size={UDim2.fromScale(1, 1 / 3)}
					Event={{ Activated: () => props.onZoneSelected() }}
					ZIndex={0}
				>
					<textlabel
						Text={props.world}
						AnchorPoint={new Vector2(0.5, 1)}
						Position={udim2BottomMiddle}
						Size={UDim2.fromScale(0.5, 0.25)}
						Font={font}
						TextScaled={true}
						TextColor3={color3White}
						TextStrokeTransparency={0.5}
						TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
						BackgroundTransparency={1}
					/>
				</BaseImageButton>
				{props.zones.map((zone) => (
					<BaseImageButton
						Image={
							assetIds.images.maps[props.world][zone.name as keyof typeof assetIds.images.maps[typeof props.world]]
						}
						Size={UDim2.fromScale(0.5, 1 / 4)}
						Event={{ Activated: () => props.onZoneSelected(zone.name) }}
						LayoutOrder={zone.layoutOrder}
					>
						<textlabel
							Text={zone.name}
							AnchorPoint={new Vector2(0.5, 1)}
							Position={udim2BottomMiddle}
							Size={UDim2.fromScale(0.5, 0.25)}
							Font={font}
							TextScaled={true}
							TextColor3={color3White}
							TextStrokeTransparency={0.5}
							TextStrokeColor3={Color3.fromRGB(0, 0, 0)}
							BackgroundTransparency={1}
						/>
					</BaseImageButton>
				))}
			</RescalingScrollingFrame>
			<ExitButton
				Position={UDim2.fromScale(0.975, 0.065)}
				minimizedSize={0.125}
				maximizedSize={0.15}
				onClosed={props.onClose}
			/>
		</frame>
	);
}
/* eslint-enable jsdoc/require-jsdoc */
