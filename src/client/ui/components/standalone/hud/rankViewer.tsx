import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { MAX_RANK, RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { ExperienceState } from "shared/rodux/experience";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

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

		const nextRankData = props.rank + 1 > MAX_RANK ? rankData : RANKS.find((rank) => rank.id === props.rank + 1);
		if (nextRankData === undefined) {
			throw `Expected rank data for rank ${props.rank + 1}`;
		}

		const progressToNextRank =
			props.rank + 1 > MAX_RANK
				? 1
				: props.experience < nextRankData.requiredExperience
				? props.experience / nextRankData.requiredExperience
				: 1;

		return (
			<ImageLabel
				native={{
					AnchorPoint: new Vector2(0, 0.5),
					Image: assetIds.images.ui.hud["viewer background"],
					Position: UDim2.fromScale(0.118, 0.5),
					Size: UDim2.fromScale(0.85, 0.076),
				}}
			>
				<uiaspectratioconstraint AspectRatio={4.8} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.65, 0.45),
						Position: UDim2.fromScale(0.5, 0.3),
						Text: rankData.name,
					}}
					stroke={{
						rankGradient: props.rank,
						native: { Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) },
					}}
				/>
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.76)}
					Size={UDim2.fromScale(0.65, 0.3)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					<uicorner CornerRadius={new UDim(0.5)} />
					<BaseFrame
						BackgroundTransparency={0}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={UDim2.fromScale(0, 0.5)}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Size={UDim2.fromScale(progressToNextRank, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</BaseFrame>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.95),
							Text:
								props.rank === MAX_RANK
									? "Max Rank"
									: `${twoDpAbbreviator.numberToString(props.experience)}/${twoDpAbbreviator.numberToString(
											nextRankData.requiredExperience,
									  )} (${math.floor(progressToNextRank * 100)}%)`,
						}}
						stroke={{
							native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
						}}
					/>
				</BaseFrame>
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
			</ImageLabel>
		);
	}),
);
