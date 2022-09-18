import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { LocalMessages } from "./components/announcements";
import { CodesMenu } from "./components/codes/menu";
import { EggsUI } from "./components/eggs";
import { Hud } from "./components/hud";
import { Quests } from "./components/quests";
import { TalismanShop } from "./components/talismans/talismanShop";
import { SettingsMenu } from "./components/settings/menu";
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
export const app = hooks((props: AppProps, { useEffect, useState }) => {
	const [codesMenuVisible, setCodesVisible] = useState(false);
	const [questsMenuVisible, setQuestsVisibility] = useState(false);
	const [settingsMenuVisible, setSettingsVisibility] = useState(false);

	const [displayAnnouncement, setDisplayAnnouncement] = useState<
		{ message: string; announcementType: "errors" | "announcements" } | undefined
	>(undefined);

	/**
	 * @param announcementType The type of message to display.
	 * @param message The message to display.
	 * @returns A function to display the message.
	 */
	const applyAnnouncement = (announcementType: "errors" | "announcements", message: string): void =>
		setDisplayAnnouncement({ message, announcementType });

	useEffect(() => {
		task.delay(5, () => {
			setDisplayAnnouncement(undefined);
		});
	}, [displayAnnouncement]);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<TalismanShop store={props.store} />
				<EggsUI />
				<CodesMenu
					visible={codesMenuVisible}
					hideMenu={(): void => setCodesVisible(false)}
					displayAnnouncement={applyAnnouncement}
				/>
				<SettingsMenu visible={settingsMenuVisible} hideMenu={(): void => setSettingsVisibility(false)} />
				<Quests visible={questsMenuVisible} hideMenu={(): void => setQuestsVisibility(false)} />
				<ZonesUI />
				<Hud
					visible={!codesMenuVisible && !settingsMenuVisible}
					displayCodesMenu={(): void => setCodesVisible(true)}
					displayQuestsMenu={(): void => setQuestsVisibility(true)}
					displaySettingsMenu={(): void => setSettingsVisibility(true)}
				/>
				<LocalMessages currentMessage={displayAnnouncement} />
			</>
		</RoactRodux.StoreProvider>
	);
});
