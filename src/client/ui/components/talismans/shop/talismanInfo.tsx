import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { CurrencyGradient } from "client/ui/elements/gradients/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { DamageIcon } from "client/ui/elements/icons/damageIcon";
import { ExperienceIcon } from "client/ui/elements/icons/experienceIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { WalkSpeedIcon } from "client/ui/elements/icons/walkspeedIcon";
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
					<uiaspectratioconstraint AspectRatio={1.4} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.15)}
						Size={UDim2.fromScale(0.9, 0.25)}
						Text={talismanInfo.name}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.675, 0.35)}
						Size={UDim2.fromScale(0.45, 0.2)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(230, 64, 64)}
						Text={twoDpAbbreviator.numberToString(talismanInfo.stats.damage)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<DamageIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.675, 0.6)}
						Size={UDim2.fromScale(0.45, 0.2)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(43, 185, 255)}
						Text={`+${twoDpAbbreviator.numberToString(talismanInfo.stats.walkspeed)}`}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<WalkSpeedIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(21, 94, 127) }} />
					</textlabel>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.675, 0.85)}
						Size={UDim2.fromScale(0.45, 0.2)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 235, 13)}
						Text={`x${twoDpAbbreviator.numberToString(talismanInfo.stats.experience)}`}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<ExperienceIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(108, 99, 6) }} />
					</textlabel>
				</imagelabel>
			</>
		);
	}),
);
