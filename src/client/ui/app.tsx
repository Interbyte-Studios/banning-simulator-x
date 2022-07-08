import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { EggsUI } from "./components/eggs";
import { ToggleWeaponButton } from "./components/weapons/toggleWeaponButton";
import { WeaponShop } from "./components/weapons/weaponShop";
import { fakeRemoteContext, remoteContext } from "./mocks/remoteContext/init";

/**
 * Creates the Roact app to display.
 *
 * @param props The props to create the app.
 * @param props.player The player to create the app for.
 * @param props.store The store to create the app with.
 * @returns The Roact app to mount.
 */
export function app(props: { player: Player; store: Store }): Roact.Element {
	return (
		<remoteContext.Provider value={fakeRemoteContext}>
			<RoactRodux.StoreProvider store={props.store}>
				<>
					<ToggleWeaponButton player={props.player} />
					<WeaponShop store={props.store} />
					<EggsUI />
				</>
			</RoactRodux.StoreProvider>
		</remoteContext.Provider>
	);
}
