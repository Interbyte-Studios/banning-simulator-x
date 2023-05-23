import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";

/**
 * A component that displays a player's leaderboard image.
 *
 * @param props The component's props.
 * @param props.playerId The player's ID.
 * @param props.position The player's position on the leaderboard.
 * @returns A Roact component.
 */
export const PlayerLeaderboardImage = (props: { playerId: number; position: number }): Roact.Element => {
	const thumbnailType = Enum.ThumbnailType.HeadShot;
	const thumbnailSize = Enum.ThumbnailSize.Size420x420;
	const [content, isReady] = Players.GetUserThumbnailAsync(props.playerId, thumbnailType, thumbnailSize);

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(0, 148, 255)}
			Position={
				props.position === 1
					? UDim2.fromScale(0.5, 0.115)
					: props.position === 2
					? UDim2.fromScale(0.165, 0.115)
					: UDim2.fromScale(0.835, 0.115)
			}
			Size={props.position === 1 ? UDim2.fromScale(0.3, 0.3) : UDim2.fromScale(0.25, 0.25)}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 6, Color: Color3.fromRGB(0, 155, 191) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={isReady && content ? content : ""}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</imagelabel>

			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={
					props.position === 1
						? Color3.fromRGB(255, 149, 0)
						: props.position === 2
						? Color3.fromRGB(170, 0, 255)
						: Color3.fromRGB(255, 0, 0)
				}
				Position={UDim2.fromScale(0.2, 0.8)}
				Size={UDim2.fromScale(0.4, 0.4)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke
					native={{
						Thickness: 4,
						Color:
							props.position === 1
								? Color3.fromRGB(188, 119, 0)
								: props.position === 2
								? Color3.fromRGB(114, 0, 129)
								: Color3.fromRGB(125, 0, 0),
					}}
				/>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Font={font}
					Text={`#${props.position}`}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke
						native={{
							Thickness: 4,
							Color:
								props.position === 1
									? Color3.fromRGB(188, 119, 0)
									: props.position === 2
									? Color3.fromRGB(114, 0, 129)
									: Color3.fromRGB(125, 0, 0),
						}}
					/>
				</textlabel>
			</frame>
		</frame>
	);
};
