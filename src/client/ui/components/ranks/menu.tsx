import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService, Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { CancelRankUpgrade } from "./cancel";
import { RankDisplay } from "./rankDisplay";
import { UpgradeRank } from "./upgradeRank";

const player = Players.LocalPlayer;

interface RankUpgradeProps extends RankUpgradeMappedProps {
	enabled: boolean;
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
	hooks((props: RankUpgradeProps, { useState, useEffect }) => {
		if (!props.enabled) {
			return <></>;
		}

		const [isVisible, setVisibility] = useState(false);

		useEffect(() => {
			if (isVisible) {
				return;
			}

			let lastInteraction = 0;
			const interactionDebounce = 2;
			const connection = RunService.Heartbeat.Connect(() => {
				const now = time();
				if (now - lastInteraction < interactionDebounce) {
					return;
				}
				lastInteraction = now;

				const character = player.Character;
				if (character === undefined) {
					return;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					return;
				}

				const magnitude = humanoidRootPart.Position.sub(Workspace.interactions.rankUpgrade.teleport.Position).Magnitude;
				if (magnitude < 40) {
					setVisibility(true);
				}

				return (): void => {
					connection.Disconnect();
				};
			});
		});

		if (!isVisible) {
			return <></>;
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
				<CancelRankUpgrade hideMenu={(): void => setVisibility(false)} />
				<ExitButton
					Position={UDim2.fromScale(0.975, 0.1)}
					minimizedSize={0.1}
					maximizedSize={0.125}
					onClosed={(): void => setVisibility(false)}
				/>
			</imagelabel>
		);
	}),
);
