import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, udim2BottomLeft, vec2Middle } from "client/ui/commonValues";
import { RankGradient } from "client/ui/elements/rankGradient";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { getRankProgress } from "client/util/getRankProgress";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { ExperienceState } from "shared/rodux/experience";

import { UpgradeRankTeleport } from "./upgradeRankTeleport";

interface RankMappedProps {
	rank: number;
	experience: ExperienceState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): RankMappedProps {
	return {
		rank: state.rank,
		experience: state.experience,
	};
}

const RanksFill = hooks((props: { progress: 1 | 2 | 3 | 4 | 5 }) => {
	const elements: Array<Roact.Element> = [];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	for (const _ of $range(1, props.progress)) {
		elements.push(
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
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Size={UDim2.fromScale(0.65, 0.475)}
			Position={UDim2.fromScale(0.515, 0.7)}
		>
			<uilistlayout
				Padding={new UDim(0.01, 0)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			{elements}
		</frame>
	);
});

export const RanksViewer = RoactRodux.connect(mapStateToProps)(
	hooks((props: RankMappedProps) => {
		const rankData = RANKS[props.rank - 1];
		if (rankData === undefined) {
			throw `Expected rank data for rank ${props.rank - 1}`;
		}

		return (
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 0.5)}
				Image={assetIds.images.ui.hud["viewer background"]}
				ScaleType={Enum.ScaleType.Fit}
				Size={UDim2.fromScale(0.95, 0.155)}
				Position={UDim2.fromScale(0.03, 0.325)}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.7, 0.4)}
					Position={UDim2.fromScale(0.525, 0.3)}
					Text={rankData.name}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<uistroke Color={Color3.fromRGB(255, 255, 255)} Thickness={2.5}>
						<RankGradient Rank={props.rank - 1} />
					</uistroke>
				</textlabel>
				<RanksFill progress={getRankProgress(props.rank, props.experience) ?? 1} />
				<RankIcon
					position={UDim2.fromScale(0.075, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1.05 }}
					rank={props.rank}
				/>
				<UpgradeRankTeleport minimizedSize={0.8} maximizedSize={0.9} position={UDim2.fromScale(0.95, 0.5)} />
			</imagelabel>
		);
	}),
);
