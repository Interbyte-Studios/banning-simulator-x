import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { getRankProgress } from "client/util/getRankProgress";
import assetIds from "shared/assets";
import { MAX_RANK, RANKS } from "shared/configs/ranks";
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

export const RanksViewer = RoactRodux.connect(mapStateToProps)(
	hooks((props: RankMappedProps) => {
		const rankData = RANKS.find((rank) => rank.id === props.rank);
		if (rankData === undefined) {
			throw `Expected rank data for rank ${props.rank}`;
		}

		const nextRankData = RANKS.find((rank) => rank.id === props.rank + 1);
		if (nextRankData === undefined) {
			throw `Expected rank data for rank ${props.rank + 1}`;
		}

		const progressToNextRank =
			props.experience < nextRankData.requiredExperience ? props.experience / nextRankData.requiredExperience : 1;

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
					Size={UDim2.fromScale(0.65, 0.45)}
					Position={UDim2.fromScale(0.5, 0.3)}
					Text={rankData.name}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke rankGradient={props.rank} native={{ Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.76)}
					Size={UDim2.fromScale(0.65, 0.3)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					<uicorner CornerRadius={new UDim(0.5)} />
					<frame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(progressToNextRank, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</frame>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						Font={font}
						Text={props.rank === MAX_RANK ? "Max Rank" : `${math.floor(progressToNextRank * 100)}%`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
				</frame>
				<RankIcon
					position={UDim2.fromScale(0.075, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1.05 }}
					rank={props.rank}
				/>
				<UpgradeRankTeleport
					minimizedSize={0.8}
					maximizedSize={0.9}
					position={UDim2.fromScale(0.925, 0.5)}
					rank={props.rank}
					experience={props.experience}
				/>
			</imagelabel>
		);
	}),
);
