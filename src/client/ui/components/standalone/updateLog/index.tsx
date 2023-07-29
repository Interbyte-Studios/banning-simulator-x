import Roact from "@rbxts/roact";
import { uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

import { ReleaseLog } from "./logs/release";
import { Update1Log } from "./logs/update1";
import { Update2Log } from "./logs/update2";
import { Update3Log } from "./logs/update3";
import { Update4Log } from "./logs/update4";
import { UpdateLogType } from "./updateLogEnumerators";

/**
 * Set update log type.
 *
 * @param props Component properties.
 * @param props.updateLogType Update log type to set.
 * @param props.onActivated Callback when activated.
 * @returns Roact element.
 */
export const SetUpdateLogType = (props: { updateLogType: UpdateLogType; onActivated: () => void }): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(0.95, 0.95)}>
			<uiaspectratioconstraint AspectRatio={3.8} />
			<SpringImageButton
				native={{
					BackgroundColor3: Color3.fromRGB(0, 108, 176),
					BackgroundTransparency: 0,
				}}
				size={{ minSize: 0.9, maxSize: 1 }}
				events={{
					/**
					 * Set update log type.
					 */
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);
						props.onActivated();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={4.8} />
				<uicorner CornerRadius={new UDim(0.3, 0)} />
				<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(0, 92, 149) }} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Text: props.updateLogType,
					}}
					stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(0, 92, 149) } }}
				/>
			</SpringImageButton>
		</BaseFrame>
	);
};

/**
 * In-game update log.
 */
export const UpdateLog = hooks((_, { useState }) => {
	const [logToShow, setLogToShow] = useState<UpdateLogType>(UpdateLogType.Release);

	return (
		<ImageLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.5),
				Size: UDim2.fromScale(0.5, 0.65),
				Image: assetIds.images.ui.index.background,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1.3} />
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.07),
					Size: UDim2.fromScale(0.4, 0.1),
					Text: "Update Log",
				}}
				stroke={{ native: { Thickness: 2.5, Color: uiHeaderStrokeColor } }}
			/>
			<scrollingframe
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				BackgroundTransparency={0}
				Position={UDim2.fromScale(0.15, 0.56)}
				Size={UDim2.fromScale(0.275, 0.81)}
				ScrollBarImageColor3={Color3.fromRGB(6, 96, 152)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				CanvasSize={UDim2.fromScale(0, 0)}
				BorderSizePixel={0}
			>
				<uilistlayout Padding={new UDim(0.01, 0)} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
				<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(0, 108, 176) }} />

				<SetUpdateLogType
					updateLogType={UpdateLogType.Release}
					onActivated={(): void => setLogToShow(UpdateLogType.Release)}
				/>
				<SetUpdateLogType
					updateLogType={UpdateLogType.Update1}
					onActivated={(): void => setLogToShow(UpdateLogType.Update1)}
				/>
				<SetUpdateLogType
					updateLogType={UpdateLogType.Update2}
					onActivated={(): void => setLogToShow(UpdateLogType.Update2)}
				/>
				<SetUpdateLogType
					updateLogType={UpdateLogType.Update3}
					onActivated={(): void => setLogToShow(UpdateLogType.Update3)}
				/>
				<SetUpdateLogType
					updateLogType={UpdateLogType.Update4}
					onActivated={(): void => setLogToShow(UpdateLogType.Update4)}
				/>
			</scrollingframe>
			<BaseFrame
				BackgroundColor3={uiTextStrokeColor}
				BackgroundTransparency={0}
				Position={UDim2.fromScale(0.645, 0.56)}
				Size={UDim2.fromScale(0.69, 0.81)}
			>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(0, 108, 176) }} />
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.05),
						Size: UDim2.fromScale(1, 0.1),
						Text: logToShow,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
				/>
				<scrollingframe
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.54)}
					Size={UDim2.fromScale(0.985, 0.87)}
					BackgroundTransparency={1}
					ScrollBarImageColor3={Color3.fromRGB(1, 58, 93)}
					ScrollBarThickness={12}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
					CanvasSize={
						logToShow === UpdateLogType.Release
							? UDim2.fromScale(0, 0)
							: logToShow === UpdateLogType.Update4
							? UDim2.fromScale(0, 3)
							: UDim2.fromScale(0, 2)
					}
				>
					{logToShow === UpdateLogType.Release && <ReleaseLog />}
					{logToShow === UpdateLogType.Update1 && <Update1Log />}
					{logToShow === UpdateLogType.Update2 && <Update2Log />}
					{logToShow === UpdateLogType.Update3 && <Update3Log />}
					{logToShow === UpdateLogType.Update4 && <Update4Log />}
				</scrollingframe>
			</BaseFrame>
		</ImageLabel>
	);
});
