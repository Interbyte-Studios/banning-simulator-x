import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { ValidRank } from "shared/rodux/rank";

/* eslint-disable jsdoc/require-jsdoc */
export const StatCard = hooks(
	(props: { header: string; stat: string | number; additionalElements?: Array<Roact.Element>; textColor?: Color3 }) => {
		const statElement: Array<Roact.Element> = [];
		if (ValidRank(props.stat)) {
			statElement.push(
				<RankIcon
					position={UDim2.fromScale(0.9, 0.5)}
					size={{ minimizedSize: 0.85, maximizedSize: 1 }}
					rank={props.stat}
				/>,
			);
		} else if (typeIs(props.stat, "string")) {
			statElement.push(
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.45, 0.95)}
					Position={UDim2.fromScale(0.765, 0.5)}
					Text={props.stat}
					TextScaled={true}
					TextColor3={props.textColor ?? Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Right}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					{props.additionalElements}
				</textlabel>,
			);
		}

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.175)}
			>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.4, 0.95)}
						Position={UDim2.fromScale(0.215, 0.5)}
						Text={props.header}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
					{statElement}
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
