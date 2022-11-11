import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { CancelRankUpgrade } from "./cancel";
import { RankDisplay } from "./rankDisplay";
import { UpgradeRank } from "./upgradeRank";

interface RankUpgradeProps extends RankUpgradeMappedProps {
	visible: boolean;
	hideMenu: () => void;
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
}

interface RankUpgradeMappedProps {
	currentRank: number;
	experience: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): RankUpgradeMappedProps {
	return {
		currentRank: state.rank,
		experience: state.experience,
	};
}

/**
 * A UI to upgrade a player's rank.
 */
export const RankUpgrade = RoactRodux.connect(mapStateToProps)(
	hooks((props: RankUpgradeProps) => {
		if (!props.visible) {
			return <></>;
		}

		if (props.currentRank === 20) {
			const rankData = RANKS[props.currentRank - 1];

			return (
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.35, 0.4)}
					Image={assetIds.images.ui["rank upgrade"].maxRank}
					ScaleType={Enum.ScaleType.Fit}
				>
					<RankIcon
						position={UDim2.fromScale(0.5, 0.285)}
						size={{ maximizedSize: 0.5, minimizedSize: 0.4 }}
						rank={props.currentRank}
					/>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.75)}
						Size={UDim2.fromScale(0.9, 0.3)}
						Text={`Congratulations! You made it to the final rank, ${rankData.name}!`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke Thickness={1.5} />
					</textlabel>
					<ExitButton
						minimizedSize={0.15}
						maximizedSize={0.175}
						onClosed={(): void => props.hideMenu()}
						Position={UDim2.fromScale(0.975, 0.02)}
					/>
				</imagelabel>
			);
		}

		const currentRank = props.currentRank - 1;
		const nextRank = currentRank + 1;

		const nextRankData = RANKS[nextRank];
		if (nextRankData === undefined) {
			throw `Expected rank data for rank ${nextRank}`;
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.5, 0.5)}
				Image={assetIds.images.ui["rank upgrade"].background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.55} />
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.1)}
					Size={UDim2.fromScale(0.345, 0.125)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Rank Upgrade"}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(150, 69, 3)} />
				</textlabel>
				<RankDisplay rank={props.currentRank} experience={props.experience} position={UDim2.fromScale(0.165, 0.55)} />
				<RankDisplay rank={props.currentRank + 1} experience={-1} position={UDim2.fromScale(0.835, 0.55)} />
				<UpgradeRank
					rank={props.currentRank}
					experience={props.experience}
					displayAnnouncement={props.displayAnnouncement}
				/>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.175, 0.125)}
					Position={UDim2.fromScale(0.535, 0.65)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(nextRankData.amount)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<uistroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1.5}>
						<CurrencyGradient Currency={nextRankData.currency} />
					</uistroke>
					<CurrencyIcon
						position={UDim2.fromScale(-0.25, 0.5)}
						size={{ maximizedSize: 0.9, minimizedSize: 0.8 }}
						currency={nextRankData.currency}
					/>
				</textlabel>
				<CancelRankUpgrade hideMenu={props.hideMenu} />
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.1)}
					minimizedSize={0.1}
					maximizedSize={0.125}
					onClosed={(): void => props.hideMenu()}
				/>
			</imagelabel>
		);
	}),
);
