// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A component that displays a message to the user that they've sent a trade request to another player.
 *
 * @param props The properties of the component.
 * @param props.player The player that the trade request was sent to.
 * @param props.hideMenu A function that hides the menu.
 * @returns A roact component.
 */
export const SentTradeRequest = (props: { player: Player; hideMenu: () => void }): Roact.Element => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

	return (
		<BaseFrame Size={UDim2.fromScale(0.975, 0.9)}>
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(44, 170, 249)}
				Position={UDim2.fromScale(0.5, 0.115)}
				Size={UDim2.fromScale(0.215, 0.275)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />

				<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.5, 0.5),
						Image: isReady && content ? content : "",
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>
			</BaseFrame>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.9),
					Size: UDim2.fromScale(0.3, 0.3),
					Image: assetIds.images.ui.index.Claim,
				}}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.hideMenu();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{ Size: UDim2.fromScale(0.8, 0.8), Text: "Ok!" }}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</ImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.6),
					Size: UDim2.fromScale(0.95, 0.132),
					Text: "(If they accept, you'll be automatically entered into a trade)",
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.4),
					Size: UDim2.fromScale(0.95, 0.23),
					Text: `You've sent a trade request to ${props.player.Name}.`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>
		</BaseFrame>
	);
};
