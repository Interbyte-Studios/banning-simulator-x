import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RunService, Workspace } from "@rbxts/services";
import { Store } from "shared/rodux";

import { LocalMessages } from "./components/announcements";
import { CodesMenu } from "./components/codes/menu";
import { EggsUI } from "./components/eggs";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Hud } from "./components/hud";
import { Quests } from "./components/quests";
import { RankUpgrade } from "./components/ranks/menu";
import { SettingsMenu } from "./components/settings/menu";
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
export const app = hooks((props: AppProps, { useEffect, useState }) => {
	const [codesMenuVisible, setCodesVisible] = useState(false);
	const [questsMenuVisible, setQuestsVisibility] = useState(false);
	const [settingsMenuVisible, setSettingsVisibility] = useState(false);
	const [rankUpgradeVisibility, setRankUpgradeVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);
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

	useEffect(() => {
		let lastInteraction = 0;
		const interactionDebounce = 2;
		const connection = RunService.Heartbeat.Connect(() => {
			const now = time();
			if (now - lastInteraction < interactionDebounce) {
				return;
			}
			lastInteraction = now;

			const character = props.player.Character;
			if (character === undefined) {
				return;
			}

			const humanoid = character.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				return;
			}

			const humanoidRootPart = humanoid.RootPart;
			if (humanoidRootPart === undefined) {
				return;
			}

			const magnitude = humanoidRootPart.Position.sub(Workspace.interactions.rankUpgrade.teleport.Position).Magnitude;
			if (magnitude < 10) {
				setRankUpgradeVisibility(true);
			}

			return (): void => {
				connection.Disconnect();
			};
		});
	});

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					store={props.store}
					visible={!codesMenuVisible && !settingsMenuVisible}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<TalismanShop store={props.store} />
				<CodesMenu
					visible={codesMenuVisible}
					hideMenu={(): void => setCodesVisible(false)}
					displayAnnouncement={applyAnnouncement}
				/>
				<SettingsMenu visible={settingsMenuVisible} hideMenu={(): void => setSettingsVisibility(false)} />
				<Quests visible={questsMenuVisible} hideMenu={(): void => setQuestsVisibility(false)} />
				<Hud
					visible={!codesMenuVisible && !settingsMenuVisible && !isHatching}
					displayCodesMenu={(): void => setCodesVisible(true)}
					displayQuestsMenu={(): void => setQuestsVisibility(true)}
					displaySettingsMenu={(): void => setSettingsVisibility(true)}
				/>
				<LocalMessages currentMessage={displayAnnouncement} />
				<ZonesUI displayAnnouncement={applyAnnouncement} />
				<WeaponEquip visible={!codesMenuVisible && !settingsMenuVisible && !isHatching} />
				<RankUpgrade
					visible={rankUpgradeVisibility}
					hideMenu={(): void => setRankUpgradeVisibility(false)}
					displayAnnouncement={applyAnnouncement}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
