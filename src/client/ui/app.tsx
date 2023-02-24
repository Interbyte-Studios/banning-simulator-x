// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { AccountHub } from "./components/account";
import { LocalMessages } from "./components/announcements";
import { AutoFight } from "./components/auto fight";
import { CodesMenu } from "./components/codes/menu";
import { CurrencyGainAnimation } from "./components/currencyGainAnimation";
import { DatastoreEvents } from "./components/datastoreEvents";
import { EggsUI } from "./components/eggs";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Hud } from "./components/hud";
import { ItemInventory } from "./components/items";
import { PetMastery } from "./components/petMastery";
import { Quests } from "./components/quests";
import { RankUpgrade } from "./components/ranks/menu";
import { SpinWheel } from "./components/spinWheel";
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
	const [teleportationVisible, setTeleportationVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);
	const [spinWheelVisibility, setSpinWheelVisibility] = useState(false);
	const [itemsVisibility, setItemsVisibility] = useState(false);
	const [autoFightVisibility, setAutoFightVisibility] = useState(false);
	const [accountHubVisibility, setAccountHubVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					visible={
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<CodesMenu visible={codesVisible} hideMenu={(): void => setCodesVisible(false)} />
				<Quests visible={questsVisible} hideMenu={(): void => setQuestsVisibility(false)} />
				<Hud
					visible={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
					displayCodes={(): void => setCodesVisible(true)}
					displayQuests={(): void => setQuestsVisibility(true)}
					displayTeleportation={(): void => setTeleportationVisibility(true)}
					displaySpinWheel={(): void => setSpinWheelVisibility(true)}
					displayItems={(): void => setItemsVisibility(true)}
					displayAutoFight={(): void => setAutoFightVisibility(true)}
					displayAccount={(): void => setAccountHubVisibility(true)}
				/>
				<WeaponLevelUpAnimation
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<TalismanLevelUpAnimation
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<LocalMessages />
				<ZonesUI
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<WeaponEquip
					visible={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<RankUpgrade
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<WeaponShopHandle
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
					weaponShopVisible={weaponShopVisibility}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
					talismanTowerVisible={talismanTowerVisibility}
					setTalismanTowerVisibility={(value: boolean): void => setTalismanTowerVisibility(value)}
				/>
				<PetMastery
					enabled={
						!isHatching &&
						!codesVisible &&
						!teleportationVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
				/>
				<Teleportation
					enabled={
						!isHatching &&
						!codesVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!accountHubVisibility
					}
					visible={teleportationVisible}
					hideMenu={(): void => setTeleportationVisibility(false)}
				/>
				<CurrencyGainAnimation />
				<SpinWheel visible={spinWheelVisibility} hideMenu={(): void => setSpinWheelVisibility(false)} />
				<ItemInventory
					enabled={
						!isHatching &&
						!codesVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!accountHubVisibility
					}
					visible={itemsVisibility}
					hideMenu={(): void => setItemsVisibility(false)}
				/>
				<DatastoreEvents
					enabled={
						!isHatching &&
						!codesVisible &&
						!questsVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility
					}
				/>
				<AutoFight enabled={autoFightVisibility} hideMenu={(): void => setAutoFightVisibility(false)} />
				<AccountHub enabled={accountHubVisibility} hideMenu={(): void => setAccountHubVisibility(false)} />
			</>
		</RoactRodux.StoreProvider>
	);
});
