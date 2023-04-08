// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/* eslint-disable jsdoc/require-jsdoc */
export const TradeRequest = hooks((props: { player: Player; hideMenu: () => void }) => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.975, 0.9)}
		>
			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(44, 170, 249)}
				Position={UDim2.fromScale(0.5, 0.115)}
				Size={UDim2.fromScale(0.215, 0.275)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 75, 122) }} />
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.5, 0.5)}
					ScaleType={Enum.ScaleType.Fit}
					Image={isReady && content ? content : ""}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
			</frame>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.825, 0.9)}
				Size={UDim2.fromScale(0.3, 0.3)}
				Image={assetIds.images.ui.index.Claim}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Text={"Accept"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(27, 156, 91) }} />
				</textlabel>
			</imagebutton>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.175, 0.9)}
				Size={UDim2.fromScale(0.3, 0.3)}
				Image={assetIds.images.ui.index.Off}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Text={"Decline"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(132, 45, 119) }} />
				</textlabel>
			</imagebutton>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.575)}
				Size={UDim2.fromScale(0.95, 0.07)}
				Font={font}
				Text={"(You can turn off trading in settings)"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 75, 122) }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.95, 0.23)}
				Font={font}
				Text={"You've received a trade request from (Player Name)."}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 75, 122) }} />
			</textlabel>
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
