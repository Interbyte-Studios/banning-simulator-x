import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { LocalMessages } from "./components/announcements";
import { CodesMenu } from "./components/codes/menu";
import { CurrencyGainAnimation } from "./components/currencyGainAnimation";
import { EggsUI } from "./components/eggs";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Hud } from "./components/hud";
import { ItemInventory } from "./components/items";
import { PetMastery } from "./components/petMastery";
import { Quests } from "./components/quests";
import { RankUpgrade } from "./components/ranks/menu";
import { SettingsMenu } from "./components/settings/menu";
import { TalismanLevelUpAnimation } from "./components/talismanLevelUp";
import { TalismanTowerHandle } from "./components/talismans";
import { Teleportation } from "./components/teleportation";
import { WeaponLevelUpAnimation } from "./components/weaponLevelUp";
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
	const [teleportationVisible, setTeleportationVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);
	const [itemsVisibility, setItemsVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);

	if (itemsVisibility) {
		warn("Item inventory should be visible");
	}

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					store={props.store}
					visible={
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
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
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
					displayCodesMenu={(): void => setCodesVisible(true)}
					displayQuestsMenu={(): void => setQuestsVisibility(true)}
					displaySettingsMenu={(): void => setSettingsVisibility(true)}
					displayTeleportationMenu={(): void => setTeleportationVisibility(true)}
					displayItemsMenu={(): void => setItemsVisibility(true)}
				/>
				<WeaponLevelUpAnimation
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<TalismanLevelUpAnimation
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<LocalMessages />
				<ZonesUI />
				<WeaponEquip
					visible={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<RankUpgrade
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<WeaponShopHandle
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
					weaponShopVisible={weaponShopVisibility}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!itemsVisibility
					}
					talismanTowerVisible={talismanTowerVisibility}
					setTalismanTowerVisibility={(value: boolean): void => setTalismanTowerVisibility(value)}
				/>
				<PetMastery
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<Teleportation
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
					visible={teleportationVisible}
					hideMenu={(): void => setTeleportationVisibility(false)}
				/>
				<CurrencyGainAnimation />
				<ItemInventory
					enabled={
						!isHatching &&
						!codesVisible &&
						!settingsVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility
					}
					visible={itemsVisibility}
					hideMenu={(): void => setItemsVisibility(false)}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
