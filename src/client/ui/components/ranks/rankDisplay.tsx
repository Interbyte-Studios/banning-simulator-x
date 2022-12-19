import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RankGradient } from "client/ui/elements/rankGradient";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { getRankProgress } from "client/util/getRankProgress";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";

interface RankDisplayProps {
	rank: number;
	experience: number;
	position: UDim2;
}

/**
 * An image label of a specified rank. Also displays a progress bar towards the next rank.
 */
export const RankDisplay = hooks((props: RankDisplayProps) => {
	const rankData = RANKS[props.rank - 1];
	if (rankData === undefined) {
		throw `Expected rank data for rank ${props.rank - 1}`;
	}

	const rankProgressFill: Array<Roact.Element> = [];
	const rankProgress = props.experience === -1 ? 1 : getRankProgress(props.rank, props.experience);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const _ of $range(1, rankProgress)) {
		rankProgressFill.push(
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.2, 1)}
				Image={assetIds.images.ui.hud["rank fill"]}
				ScaleType={Enum.ScaleType.Fit}
			/>,
		);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={props.position}
			Size={UDim2.fromScale(0.3, 0.75)}
		>
			<RankIcon
				rank={props.rank}
				position={UDim2.fromScale(0.5, 0.175)}
				size={{ maximizedSize: 0.7, minimizedSize: 0.65 }}
			/>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.45)}
				Size={UDim2.fromScale(1, 0.2)}
				Text={rankData.name}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={font}
			>
				<BaseUIStroke rankGradient={props.rank - 1} native={{ Thickness: 2.5, Color: Color3.fromRGB(255, 255, 255) }} />
			</textlabel>
			<frame
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.6)}
				Size={UDim2.fromScale(1, 0.1)}
			>
				<uilistlayout
					Padding={new UDim(0.01, 0)}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				{rankProgressFill}
			</frame>
		</frame>
	);
});
