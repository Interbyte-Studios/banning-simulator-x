import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { EggsUI } from "./components/eggs";
import { Hud } from "./components/hud";
import { Quests } from "./components/quests";
import { SettingsUI } from "./components/settings";
import { TalismanShop } from "./components/talismans/talismanShop";
import { ZonesUI } from "./components/zones";
import { hooks } from "./hooks";

interface AppProps {
	player: Player;
	store: Store;
}

/**
 * Creates the Roact app to display.
 *
 * @param props The props to create the app.
 * @param props.player The player to create the app for.
 * @param props.store The store to create the app with.
 * @returns The Roact app to mount.
 */
export const app = hooks((props: AppProps, { useState }) => {
	const [questsMenuVisible, setQuestsVisibility] = useState(false);
	const [settingsMenuVisible, setSettingsVisibility] = useState(false);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<TalismanShop store={props.store} />
				<EggsUI />
				<SettingsUI visible={settingsMenuVisible} hideMenu={(): void => setSettingsVisibility(false)} />
				<Quests visible={questsMenuVisible} hideMenu={(): void => setQuestsVisibility(false)} />
				<ZonesUI />
				<Hud
					visible={!settingsMenuVisible}
					displayQuestsMenu={(): void => setQuestsVisibility(true)}
					displaySettingsMenu={(): void => setSettingsVisibility(true)}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
