// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
import { Image } from "client/ui/elements/baseElements/image";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
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
			<Image
				native={{
					Size: UDim2.fromScale(0.4, 0.36),
					Image: assetIds.images.ui.zones.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.8} />

				<BaseTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.115),
						Size: UDim2.fromScale(0.385, 0.175),
						Text: "Zone Advance",
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
				<BaseTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.4),
						Size: UDim2.fromScale(0.9, 0.275),
						Text: `Would you like to purchase zone ${zoneData.name}?`,
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
				<BaseTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.635),
						Size: UDim2.fromScale(0.5, 0.15),
						Text: twoDpAbbreviator.numberToString(zoneData.cost.amount),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2 } }}
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
				</BaseTextLabel>

				<PurchaseZoneButton world={props.world} zone={zoneData.name} hideMenu={props.hideMenu} />
				<CancelZonePurchase hideMenu={props.hideMenu} />
			</Image>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
