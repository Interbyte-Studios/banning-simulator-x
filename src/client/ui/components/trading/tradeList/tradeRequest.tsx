// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiOffButtonStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * A component that displays a trade request.
 *
 * @param props - The props for the TradeRequest component.
 * @param props.player - The player that sent the trade request.
 * @param props.declineTrade - A function that declines the trade.
 * @returns A Roact element that displays a trade request.
 */
export const TradeRequest = hooks((props: { player: Player; declineTrade: () => void }, { useContext }) => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

	const declineTradeRemote = useContext(remoteContext).declineTradeRequest;

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
					Position: UDim2.fromScale(0.825, 0.9),
					Size: UDim2.fromScale(0.3, 0.3),
					Image: assetIds.images.ui.index.Claim,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Accept",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</ImageButton>

			<ImageButton
				native={{
					Position: UDim2.fromScale(0.175, 0.9),
					Size: UDim2.fromScale(0.3, 0.3),
					Image: assetIds.images.ui.index.Off,
				}}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						declineTradeRemote.SendToServer(props.player);
						props.declineTrade();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Decline",
					}}
					stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
				/>
			</ImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.575),
					Size: UDim2.fromScale(0.95, 0.07),
					Text: "(You can turn off trading in settings)",
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.4),
					Size: UDim2.fromScale(0.95, 0.23),
					Text: `You've received a trade request from ${props.player.Name}.`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>
		</BaseFrame>
	);
});
