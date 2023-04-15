import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor, uiOffButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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
			const rankRequiredElement = (
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.45, -0.15),
						Size: UDim2.fromScale(0.5, 0.3),
						Text: "REQUIRES",
						TextColor3: Color3.fromRGB(237, 61, 61),
					}}
					stroke={{ native: { Thickness: 2 } }}
				>
					<RankIcon
						position={UDim2.fromScale(1.15, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						rank={talismanInfo.cost.rank}
					/>
				</StrokeTextLabel>
			);

			rankRequiredWarning.push(rankRequiredElement);
		}

		return (
			<>
				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.8),
						Size: UDim2.fromScale(0.2, 0.16),
						Image: assetIds.images.ui.talismanTower.background,
					}}
				>
					<uiaspectratioconstraint AspectRatio={2.35} />

					{rankRequiredWarning}
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.2),
							Size: UDim2.fromScale(0.9, 0.4),
							Text: talismanInfo.name,
						}}
						stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.7, 0.7),
							Size: UDim2.fromScale(0.6, 0.4),
							Text: twoDpAbbreviator.numberToString(talismanInfo.cost.amount),
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: talismanInfo.cost.currency }}
					>
						<CurrencyIcon
							anchorPoint={new Vector2(1, 0.5)}
							position={UDim2.fromScale(-0.03, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
							currency={talismanInfo.cost.currency}
						/>
					</StrokeTextLabel>
				</ImageLabel>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.1, 0.335),
						Size: UDim2.fromScale(0.175, 0.335),
						Image: assetIds.images.ui.talismanTower.sidebar,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.4} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.15),
							Size: UDim2.fromScale(0.9, 0.25),
							Text: talismanInfo.name,
						}}
						stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.675, 0.35),
							Size: UDim2.fromScale(0.45, 0.2),
							TextColor3: Color3.fromRGB(230, 64, 64),
							Text: twoDpAbbreviator.numberToString(talismanInfo.stats.damage),
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(126, 24, 75) } }}
					>
						<DamageIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
					</StrokeTextLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.675, 0.6),
							Size: UDim2.fromScale(0.45, 0.2),
							TextColor3: Color3.fromRGB(43, 185, 255),
							Text: `+${twoDpAbbreviator.numberToString(talismanInfo.stats.walkspeed)}`,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
					>
						<WalkSpeedIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(21, 94, 127) }} />
					</StrokeTextLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.675, 0.85),
							Size: UDim2.fromScale(0.45, 0.2),
							TextColor3: Color3.fromRGB(255, 235, 13),
							Text: `x${twoDpAbbreviator.numberToString(talismanInfo.stats.experience)}`,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(108, 99, 6) } }}
					>
						<ExperienceIcon
							anchorPoint={new Vector2(0, 0.5)}
							position={UDim2.fromScale(-0.35, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						/>
					</StrokeTextLabel>
				</ImageLabel>
			</>
		);
	}),
);
