// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/* eslint-disable jsdoc/require-jsdoc */
export const MasteryCard = hooks(
	(props: {
		playerViewing: Player;
		progress: number;
		requiredProgress: number;
		header: string;
		description: string;
		level: number;
	}) => {
		return (
			<BaseFrame Position={UDim2.fromScale(0.5, 0.5)} Size={UDim2.fromScale(1, 0.3)} LayoutOrder={props.level}>
				<uiaspectratioconstraint AspectRatio={7} />
				<BaseFrame
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(33, 113, 159)}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(0.975, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
					<BaseFrame
						BackgroundTransparency={0}
						Position={UDim2.fromScale(0.335, 0.75)}
						Size={UDim2.fromScale(0.65, 0.325)}
						BackgroundColor3={Color3.fromRGB(200, 124, 135)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

						<BaseFrame
							BackgroundTransparency={0}
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0, 0.5)}
							Size={UDim2.fromScale(
								props.progress >= props.requiredProgress ? 1 : props.progress / props.requiredProgress,
								1,
							)}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</BaseFrame>

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(1, 0.9),
								Text:
									props.progress >= props.requiredProgress
										? "Completed"
										: `${props.progress} / ${props.requiredProgress} (${twoDpAbbreviator.numberToString(
												(props.progress / props.requiredProgress) * 100,
										  )}%)`,
							}}
							stroke={{
								native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) },
							}}
						/>
					</BaseFrame>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.3, 0.225),
							Position: UDim2.fromScale(0.825, 0.5),
							Text: props.description,
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) },
						}}
					/>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.6, 0.3),
							Position: UDim2.fromScale(0.325, 0.32),
							Text: props.header,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) },
						}}
					/>
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
