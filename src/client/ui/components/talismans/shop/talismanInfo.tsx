import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { getTalismanData } from "shared/util/getTalismanData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface TalismanTowerTalismanInfoProps extends TalismanTowerTalismanInfoMappedProps {
	currentTalisman: number;
}

interface TalismanTowerTalismanInfoMappedProps {
	rank: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TalismanTowerTalismanInfoMappedProps {
	return {
		rank: state.rank,
	};
}

/**
 * Displays information about the talisman being currently viewed in the tower.
 */
export const TalismanTowerTalismanInfo = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanTowerTalismanInfoProps) => {
		const talismanInfo = getTalismanData(props.currentTalisman);

		const rankRequiredWarning: Array<Roact.Element> = [];
		if (props.rank < talismanInfo.cost.rank) {
			rankRequiredWarning.push(
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.45, -0.15)}
					Size={UDim2.fromScale(0.5, 0.3)}
					Text={"REQUIRES"}
					TextColor3={Color3.fromRGB(237, 61, 61)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2 }} />
					<RankIcon
						position={UDim2.fromScale(1.15, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						rank={talismanInfo.cost.rank}
					/>
				</textlabel>,
			);
		}

		return (
			<>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.8)}
					Size={UDim2.fromScale(0.2, 0.16)}
					Image={assetIds.images.ui.talismanTower.background}
					ScaleType={Enum.ScaleType.Fit}
				>
					{rankRequiredWarning}
					<uiaspectratioconstraint AspectRatio={2.35} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.2)}
						Size={UDim2.fromScale(0.9, 0.4)}
						Text={talismanInfo.name}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.7, 0.7)}
						Size={UDim2.fromScale(0.6, 0.4)}
						Font={font}
						Text={twoDpAbbreviator.numberToString(talismanInfo.cost.amount)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<BaseUIStroke
							native={{ Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }}
							currencyGradient={"coins"}
						/>
						<CurrencyIcon
							anchorPoint={new Vector2(1, 0.5)}
							position={UDim2.fromScale(-0.03, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
							currency={talismanInfo.cost.currency}
						/>
					</textlabel>
				</imagelabel>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.175, 0.335)}
					Position={UDim2.fromScale(0.1, 0.5)}
					Image={assetIds.images.ui.talismanTower.sidebar}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={0.95} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.3)}
						Size={UDim2.fromScale(0.8, 0.25)}
						Text={`Tier: ${talismanInfo.tier}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.525)}
						Size={UDim2.fromScale(0.8, 0.2)}
						Text={`${
							talismanInfo.stats.name === "damage"
								? "Damage"
								: talismanInfo.stats.name === "experience"
								? "Experience"
								: talismanInfo.stats.name === "health"
								? "Health"
								: "Unknown"
						}: ${
							talismanInfo.stats.name === "damage"
								? "+"
								: talismanInfo.stats.name === "experience"
								? "x"
								: talismanInfo.stats.name === "health"
								? "+"
								: "Unknown"
						}${twoDpAbbreviator.numberToString(talismanInfo.stats.amount)}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.7)}
						Size={UDim2.fromScale(0.8, 0.2)}
						Text={`Walk Speed: +${talismanInfo.stats.maxSpeed}`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
				</imagelabel>
			</>
		);
	}),
);
