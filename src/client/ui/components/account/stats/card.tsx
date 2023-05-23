import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
import { ValidRank } from "shared/rodux/rank";

/* eslint-disable jsdoc/require-jsdoc */
export const StatCard = hooks(
	(props: {
		header: string;
		stat: string | number;
		additionalElements?: Array<Roact.Element>;
		textColor?: Color3;
		layoutId: number;
	}) => {
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
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.45, 0.95),
						Position: UDim2.fromScale(0.765, 0.5),
						Text: props.stat,
						TextColor3: props.textColor,
						TextXAlignment: Enum.TextXAlignment.Right,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
					}}
				>
					{props.additionalElements}
				</StrokeTextLabel>,
			);
		}

		return (
			<BaseFrame Size={UDim2.fromScale(1, 0.175)} LayoutOrder={props.layoutId}>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.4, 0.95),
							Position: UDim2.fromScale(0.215, 0.5),
							Text: props.header,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
					/>

					{statElement}
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
