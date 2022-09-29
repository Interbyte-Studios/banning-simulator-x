import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";

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
