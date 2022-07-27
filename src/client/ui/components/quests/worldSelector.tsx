import Roact from "@rbxts/roact";
import {
	color3White,
	font,
	udim2BottomMiddle,
	udim2BottomRight,
	udim2Middle,
	vec2Middle,
} from "client/roact/commonValues";
import { BaseImageButton } from "client/roact/elements/baseImageButton";
import { ExitButton } from "client/roact/elements/exitButton";
import { RescalingScrollingFrame } from "client/roact/elements/rescalingScrollingFrame";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";

/**
 * @param props The props to create the element.
 * @param props.worlds The worlds to select from.
 * @param props.onWorldSelected The callback function to run when a user selects a world.
 * @param props.onClose The callback function to run when the user wishes to close the selector.
 * @returns The world selector to display.
 */
/* eslint-disable jsdoc/require-jsdoc */
export function WorldSelector(props: {
	worlds: Array<WorldName>;
	onWorldSelected: (worldName: WorldName) => void;
	onClose: () => void;
}): Roact.Element {
	return (
		<frame Position={udim2Middle} Size={UDim2.fromScale(0.65, 0.6)} AnchorPoint={vec2Middle} BackgroundTransparency={1}>
			<RescalingScrollingFrame
				Size={udim2BottomRight}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				BorderSizePixel={0}
				BackgroundTransparency={1}
			>
				<uilistlayout />
				{props.worlds.map((world) => (
					<BaseImageButton
						Image={assetIds.images.maps[world as keyof typeof assetIds.images.maps].world}
						Size={UDim2.fromScale(1, 1 / 3)}
						Event={{
							Activated: () => props.onWorldSelected(world),
						}}
					>
						<textlabel
							Text={world}
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
