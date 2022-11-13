import Roact, { createContext } from "@rbxts/roact";
import { useContext } from "@rbxts/roact-hooked";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { Store } from "shared/rodux";

import { LocalMessages } from "./components/announcements";
import { CodesMenu } from "./components/codes/menu";
import { EggsUI } from "./components/eggs";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Hud } from "./components/hud";
import { Quests } from "./components/quests";
import { RankUpgrade } from "./components/ranks/menu";
import { SettingsMenu } from "./components/settings/menu";
import { TalismanTowerHandle } from "./components/talismans";
import { WeaponShopHandle } from "./components/weaponShop";
import { ZonesUI } from "./components/zones";
import { AnnouncementAPI, AnnouncementContext } from "./context/AnnouncementsAPI";
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
	const [codesVisible, setCodesVisible] = useState(false);
	const [questsVisible, setQuestsVisibility] = useState(false);
	const [settingsVisible, setSettingsVisibility] = useState(false);
	const [rankUpgradeVisibility, setRankUpgradeVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);

	const { addError } = useContext(AnnouncementContext);

	useEffect(() => {
		let lastTouched = 0;

		const connection = Workspace.interactions.rankUpgrade.interact.Touched.Connect((hit) => {
			if (rankUpgradeVisibility) {
				return;
			}

			const now = time();
			if (now - lastTouched < 1) {
				return;
			}
			lastTouched = now;

			const hitInstance = hit.Parent;
			if (hitInstance === undefined) {
				return;
			}

			if (!hitInstance.IsA("Model")) {
				return;
			}

			if (hitInstance.Name !== props.player.Name) {
				return;
			}

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

			const distance = Workspace.interactions.rankUpgrade.teleport.Position.sub(humanoidRootPart.Position);
			if (distance.Magnitude > 20) {
				return;
			}

			setRankUpgradeVisibility(true);
		});

		return (): void => {
			connection.Disconnect();
		};
	});

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					store={props.store}
					visible={
						!codesVisible && !settingsVisible && !questsVisible && !weaponShopVisibility && !talismanTowerVisibility
					}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<CodesMenu
					visible={codesVisible}
					hideMenu={(): void => setCodesVisible(false)}
					displayAnnouncement={addError}
				/>
				<SettingsMenu visible={settingsVisible} hideMenu={(): void => setSettingsVisibility(false)} />
				<Quests visible={questsVisible} hideMenu={(): void => setQuestsVisibility(false)} />
				<Hud
					visible={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility
					}
					displayCodesMenu={(): void => setCodesVisible(true)}
					displayQuestsMenu={(): void => setQuestsVisibility(true)}
					displaySettingsMenu={(): void => setSettingsVisibility(true)}
				/>
				<AnnouncementAPI>
					<LocalMessages />
				</AnnouncementAPI>
				<ZonesUI displayAnnouncement={addError} />
				<WeaponEquip
					visible={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility
					}
				/>
				<RankUpgrade
					visible={rankUpgradeVisibility}
					hideMenu={(): void => setRankUpgradeVisibility(false)}
					displayAnnouncement={addError}
				/>
				<WeaponShopHandle
					enabled={!isHatching && !codesVisible && !settingsVisible && !questsVisible && !talismanTowerVisibility}
					weaponShopVisible={weaponShopVisibility}
					displayAnnouncement={addError}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={!isHatching && !codesVisible && !settingsVisible && !questsVisible && !weaponShopVisibility}
					talismanTowerVisible={talismanTowerVisibility}
					displayAnnouncement={addError}
					setTalismanTowerVisibility={(value: boolean): void => setTalismanTowerVisibility(value)}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
