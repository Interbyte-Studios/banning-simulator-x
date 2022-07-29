import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { purchaseZone as unlockZone } from "client/modules/zones/purchaseZone";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { WorldsState } from "shared/rodux/worlds";

import { ZonesInfo } from "./zoneInfo";
import { ZonePurchasePromptFrame } from "./zonePurchase/zonePurchasePromptFrame";

interface ZonesUIProps extends MappedZonesUIProps {}

interface MappedZonesUIProps {
	worlds: WorldsState;
	currencies: CurrenciesState;
}

interface PromptInfo {
	world: WorldName;
	zone: ZoneNames;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): MappedZonesUIProps {
	return {
		worlds: state.worlds,
		currencies: state.currencies,
	};
}

/**
 * Displays zone information on zone signs.
 *
 * @returns The zone info signs.
 */
export const ZonesUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: ZonesUIProps, { useState, useContext }) => {
		const [selectedInfo, setSelectedInfo] = useState<PromptInfo | undefined>(undefined);
		const { purchaseZone } = useContext(remoteContext);

		const children: Array<Roact.Element> = [];

		if (selectedInfo !== undefined) {
			children.push(
				<ZonePurchasePromptFrame
					worldName={selectedInfo.world}
					zoneName={selectedInfo.zone}
					onPurchase={(): void => {
						unlockZone(props.worlds, props.currencies, selectedInfo.world, selectedInfo.zone, purchaseZone);
						setSelectedInfo(undefined);
					}}
					onCancel={(): void => setSelectedInfo(undefined)}
				/>,
			);
		}

		return (
			<>
				{children}
				<ZonesInfo
					togglePurchasePrompt={(worldName, zoneName): void => {
						setSelectedInfo({ world: worldName, zone: zoneName });
					}}
				/>
			</>
		);
	}),
);
