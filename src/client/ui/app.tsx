import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
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
import { UpdateLog } from "./components/updateLog";
import { WeaponShopHandle } from "./components/weaponShop";
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
	const [codesVisible, setCodesVisible] = useState(false);
	const [questsVisible, setQuestsVisibility] = useState(false);
	const [settingsVisible, setSettingsVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);

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
				<CodesMenu visible={codesVisible} hideMenu={(): void => setCodesVisible(false)} />
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
				<LocalMessages />
				<ZonesUI />
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
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility
					}
				/>
				<WeaponShopHandle
					enabled={!isHatching && !codesVisible && !settingsVisible && !questsVisible && !talismanTowerVisibility}
					weaponShopVisible={weaponShopVisibility}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={!isHatching && !codesVisible && !settingsVisible && !questsVisible && !weaponShopVisibility}
					talismanTowerVisible={talismanTowerVisibility}
					setTalismanTowerVisibility={(value: boolean): void => setTalismanTowerVisibility(value)}
				/>
				<UpdateLog
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility
					}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
