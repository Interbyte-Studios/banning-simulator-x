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
					<BaseUIStroke Thickness={2} />
					<RankIcon
						position={UDim2.fromScale(1.15, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						rank={talismanInfo.cost.rank}
					/>
				</textlabel>,
			);
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.8)}
				Size={UDim2.fromScale(0.2, 0.16)}
				Image={assetIds.images.ui["weapon shop"]["weapon info background"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				{rankRequiredWarning}
				<uiaspectratioconstraint AspectRatio={2.2} />
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
					<BaseUIStroke Thickness={2} />
				</textlabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.325, 0.7)}
					Size={UDim2.fromScale(0.3, 0.3)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(talismanInfo.stats.amount)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1.5}>
						<CurrencyGradient Currency={"gems"} />
					</BaseUIStroke>
					<CurrencyIcon
						anchorPoint={new Vector2(1, 0.5)}
						position={UDim2.fromScale(-0.03, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={talismanInfo.cost.currency}
					/>
				</textlabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.84, 0.7)}
					Size={UDim2.fromScale(0.3, 0.3)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(talismanInfo.cost.amount)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1.5}>
						<CurrencyGradient Currency={"coins"} />
					</BaseUIStroke>
					<CurrencyIcon
						anchorPoint={new Vector2(1, 0.5)}
						position={UDim2.fromScale(-0.03, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={talismanInfo.cost.currency}
					/>
				</textlabel>
			</imagelabel>
		);
	}),
);
