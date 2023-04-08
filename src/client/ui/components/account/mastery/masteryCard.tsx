// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
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
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.3)}
				LayoutOrder={props.level}
			>
				<uiaspectratioconstraint AspectRatio={7} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(33, 113, 159)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.99, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

					<frame
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.335, 0.75)}
						Size={UDim2.fromScale(0.65, 0.325)}
						BackgroundColor3={Color3.fromRGB(200, 124, 135)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />

						<frame
							Size={UDim2.fromScale(
								props.progress >= props.requiredProgress ? 1 : props.progress / props.requiredProgress,
								1,
							)}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</frame>

						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 0.9)}
							Font={font}
							Text={
								props.progress >= props.requiredProgress
									? "Completed"
									: `${props.progress} / ${props.requiredProgress} (${twoDpAbbreviator.numberToString(
											(props.progress / props.requiredProgress) * 100,
									  )}%)`
							}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
						</textlabel>
					</frame>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.825, 0.5)}
						Size={UDim2.fromScale(0.3, 0.225)}
						Font={font}
						Text={props.description}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
					</textlabel>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.325, 0.32)}
						Size={UDim2.fromScale(0.6, 0.3)}
						Font={font}
						Text={props.header}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(15, 51, 70) }} />
					</textlabel>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
