// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";

/**
 * A component that displays a message to the user that they've sent a trade request to another player.
 *
 * @param props The properties of the component.
 * @param props.player The player that the trade request was sent to.
 * @param props.hideMenu A function that hides the menu.
 * @returns A roact component.
 */
export const SentTradeRequest = hooks((props: { player: Player; hideMenu: () => void }, { useState, useEffect }) => {
	const [timer, setTimer] = useState(10);

	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.player.UserId, thumbnailType, thumbnailSize);

	useEffect(() => {
		let lastCheck = time();
		const connection = RunService.Heartbeat.Connect(() => {
			const now = time();
			if (now - lastCheck < 1) {
				return;
			}
			lastCheck = now;

			setTimer(timer - 1);
		});

		return (): void => connection.Disconnect();
	}, [timer]);

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

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.4),
					Size: UDim2.fromScale(0.95, 0.23),
					Text: `You've sent a trade request to ${props.player.Name}.`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>

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
					Position: UDim2.fromScale(0.5, 0.9),
					Size: UDim2.fromScale(0.95, 0.25),
					Text: `${timer} seconds until trade is timed out.`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>
		</BaseFrame>
	);
});
