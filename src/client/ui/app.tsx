import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { EggsUI } from "./components/eggs";
import { Quests } from "./components/quests";
import { SettingsUI } from "./components/settings";
import { ZonesUI } from "./components/zones";

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
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI />
				<SettingsUI />
				<Quests />
				<ZonesUI />
			</>
		</RoactRodux.StoreProvider>
	);
}
