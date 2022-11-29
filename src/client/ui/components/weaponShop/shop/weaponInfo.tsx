import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface WeaponShopWeaponInfoProps extends WeaponShopWeaponInfoMappedProps {
	currentWeapon: number;
}

interface WeaponShopWeaponInfoMappedProps {
	rank: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponShopWeaponInfoMappedProps {
	return {
		rank: state.rank,
	};
}

/**
 * Displays information about the weapon being currently viewed in the shop.
 */
export const WeaponShopWeaponInfo = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponShopWeaponInfoProps) => {
		const weaponData = getWeaponInfo(props.currentWeapon);

		const rankRequiredWarning: Array<Roact.Element> = [];
		if (weaponData.data.cost !== undefined && weaponData.data.cost.requiredRank !== undefined) {
			if (props.rank < weaponData.data.cost.requiredRank) {
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
							rank={weaponData.data.cost ? weaponData.data.cost.requiredRank ?? 1 : 1}
						/>
					</textlabel>,
				);
			}
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
					Text={weaponData.name}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2 }} />
				</textlabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.325, 0.7)}
					Size={UDim2.fromScale(0.3, 0.3)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(weaponData.data.damage)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }} currencyGradient={"gems"} />
					<DamageIcon
						anchorPoint={new Vector2(1, 0.5)}
						position={UDim2.fromScale(-0.03, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
				</textlabel>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.84, 0.7)}
					Size={UDim2.fromScale(0.3, 0.3)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(weaponData.data.cost ? weaponData.data.cost.amount : 0)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) }} currencyGradient={"coins"} />
					<CurrencyIcon
						anchorPoint={new Vector2(1, 0.5)}
						position={UDim2.fromScale(-0.03, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={weaponData.data.cost ? weaponData.data.cost.currency : "gems"}
					/>
				</textlabel>
			</imagelabel>
		);
	}),
);
