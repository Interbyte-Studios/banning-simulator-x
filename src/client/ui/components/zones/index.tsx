import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { purchaseZone as unlockZone } from "client/purchaseZone";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { WorldsState } from "shared/rodux/worlds";

import { ZoneInfoDisplay } from "./zoneInfoDisplay";
import { ZonePurhcasePromptFrame } from "./zonePurchase/zonePurchasePromptFrame";

interface ZoneInfoUIProps extends MappedZoneInfoUIProps {}

interface MappedZoneInfoUIProps {
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
function mapStateToProps(state: StoreState): MappedZoneInfoUIProps {
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
export const ZoneInfoUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: ZoneInfoUIProps, { useState, useContext }) => {
		const [promptStatus, updatePromptStatus] = useState<boolean>(false);
		const [selectedInfo, updateInfo] = useState<PromptInfo>({ world: "Ban Land", zone: "Forest" });
		const { purchaseZone } = useContext(remoteContext);

		return (
			<>
				<ZonePurhcasePromptFrame
					worldName={selectedInfo.world}
					zoneName={selectedInfo.zone}
					visibility={promptStatus}
					onPurchase={(): void => {
						unlockZone(props.worlds, props.currencies, selectedInfo.world, selectedInfo.zone, purchaseZone);
						updatePromptStatus(false);
					}}
					onCancel={(): void => updatePromptStatus(false)}
				/>
				{Object.entries(WORLDS).map(([worldName, worldData]) => {
					const worldInfo = props.worlds.find((world) => world.name === worldName);

					return (
						<>
							{Object.entries(worldData.zones).map(([zoneName]) => {
								const ownsZone =
									worldInfo !== undefined && worldInfo.zones.find((zone) => zone === zoneName) !== undefined;
								const sign = Workspace.decoration[worldName]
									.FindFirstChild(zoneName)
									?.FindFirstChild("sign")
									?.FindFirstChild("description")
									?.FindFirstChild("infoPart");

								if (sign === undefined) {
									return <></>;
								}

								assert(sign.IsA("BasePart"), `Expected ${sign.GetFullName()} to be a BasePart but it wasn't`);
								return (
									<ZoneInfoDisplay
										zoneName={zoneName}
										worldName={worldName}
										adornee={sign}
										ownsZone={ownsZone}
										onPurchase={(zoneName, worldName): void => {
											updateInfo({ world: worldName, zone: zoneName });
											updatePromptStatus(true);
										}}
									/>
								);
							})}
						</>
					);
				})}
			</>
		);
	}),
);
