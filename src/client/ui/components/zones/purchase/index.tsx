import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { getZoneDataById } from "shared/util/getZoneDataById";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { CancelZonePurchase } from "./cancel";
import { PurchaseZoneButton } from "./purchase";

interface PurchaseZoneUIProps extends PurchaseZoneUIMappedProps {
	world: WorldName;
	zone: number;
	displayAnnouncement: (message: string, displayTime?: number) => void;
	hideMenu: () => void;
}

interface PurchaseZoneUIMappedProps {
	currencies: CurrenciesState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PurchaseZoneUIMappedProps {
	return {
		currencies: state.currencies,
	};
}

/**
 * Ineraction UI roact component for purchasing a zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PurchaseZoneUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseZoneUIProps) => {
		const zoneData = getZoneDataById(props.world, props.zone);
		if (zoneData.cost === undefined) {
			return <></>;
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.4, 0.36)}
				Image={assetIds.images.ui.zones.background}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1.8} />
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.115)}
					Size={UDim2.fromScale(0.385, 0.175)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Zone Advance"}
					Font={font}
				>
					<BaseUIStroke Thickness={2} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.4)}
					Size={UDim2.fromScale(0.9, 0.275)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={`Would you like to purchase zone ${zoneData.name}?`}
					Font={font}
				>
					<BaseUIStroke Thickness={3} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.7, 0.635)}
					Size={UDim2.fromScale(0.5, 0.15)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={twoDpAbbreviator.numberToString(zoneData.cost.amount)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<CurrencyIcon
						position={UDim2.fromScale(-0.115, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						currency={zoneData.cost.currency}
					/>
					<RankIcon
						position={UDim2.fromScale(-0.325, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						rank={zoneData.cost.requiredRank}
					/>
					<BaseUIStroke Thickness={3} />
				</textlabel>
				<PurchaseZoneButton
					world={props.world}
					zone={zoneData.name}
					displayAnnouncement={props.displayAnnouncement}
					hideMenu={props.hideMenu}
				/>
				<CancelZonePurchase hideMenu={props.hideMenu} />
			</imagelabel>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
