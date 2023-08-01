import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { uiDarkStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";

import { TradeButton } from "./tradeButton";

/**
 * A card that displays a player's name and avatar.
 *
 * @param props The props for the component.
 * @param props.player The player to display.
 * @param props.sendTrade A callback to send a trade to another player.
 * @returns The element.
 */
export const TradeCard = hooks(
	(props: { player: Player; sendTrade: (player: Player) => void }, { useState, useEffect }) => {
		const [content, setContent] = useState("");
		useEffect(() => {
			const thumbnailType = Enum.ThumbnailType.HeadShot;
			const thumbnailSize = Enum.ThumbnailSize.Size420x420;

			task.spawn(() => {
				const [success, result] = pcall(() =>
					Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize),
				);
				if (success) {
					setContent(result);
				}
			});
		}, [props.player]);

		return (
			<BaseFrame Size={UDim2.fromScale(1, 0.95)}>
				<uiaspectratioconstraint AspectRatio={5.6} />

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 100, 163)}
					Size={UDim2.fromScale(0.975, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.3, 0)} />

					<BaseFrame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(44, 170, 249)}
						Position={UDim2.fromScale(0.09, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />

						<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

						<ImageLabel
							native={{
								Size: UDim2.fromScale(0.5, 0.5),
								Image: content,
							}}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</ImageLabel>
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.425, 0.5),
							Size: UDim2.fromScale(0.5, 0.6),
							Text: props.player.DisplayName,
						}}
						stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
					/>

					<TradeButton player={props.player} sendTrade={props.sendTrade} />
				</BaseFrame>
			</BaseFrame>
		);
	},
);
