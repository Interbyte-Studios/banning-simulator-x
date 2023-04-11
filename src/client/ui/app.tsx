// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Store } from "shared/rodux";

import { AccountHub } from "./components/account";
import { LocalMessages } from "./components/announcements";
import { AutoFight } from "./components/auto fight";
import { CurrencyGainAnimation } from "./components/currencyGainAnimation";
import { DatastoreEvents } from "./components/datastoreEvents";
import { EggsUI } from "./components/eggs";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Fusing } from "./components/fusing";
import { Hud } from "./components/hud";
import { ItemInventory } from "./components/items";
import { PetMastery } from "./components/petMastery";
import { RankUpgrade } from "./components/ranks/menu";
import { SpinWheel } from "./components/spinWheel";
import { TalismanLevelUpAnimation } from "./components/talismanLevelUp";
import { TalismanTowerHandle } from "./components/talismans";
import { Teleportation } from "./components/teleportation";
import { Trading } from "./components/trading";
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
	const [teleportationVisible, setTeleportationVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);
	const [spinWheelVisibility, setSpinWheelVisibility] = useState(false);
	const [itemsVisibility, setItemsVisibility] = useState(false);
	const [autoFightVisibility, setAutoFightVisibility] = useState(false);
	const [accountHubVisibility, setAccountHubVisibility] = useState(false);
	const [tradingVisibility, setTradingVisibility] = useState(false);

	const [isHatching, setHatchingStatus] = useState(false);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					visible={
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<Hud
					visible={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					displayTeleportation={(): void => setTeleportationVisibility(true)}
					displaySpinWheel={(): void => setSpinWheelVisibility(true)}
					displayItems={(): void => setItemsVisibility(true)}
					displayAutoFight={(): void => setAutoFightVisibility(true)}
					displayAccount={(): void => setAccountHubVisibility(true)}
					displayTradingMenu={(): void => setTradingVisibility(true)}
				/>
				<WeaponLevelUpAnimation enabled={true} />
				<TalismanLevelUpAnimation enabled={true} />
				<LocalMessages />
				<ZonesUI
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
				/>
				<WeaponEquip
					visible={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
				/>
				<RankUpgrade
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
				/>
				<WeaponShopHandle
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					weaponShopVisible={weaponShopVisibility}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					talismanTowerVisible={talismanTowerVisibility}
					setTalismanTowerVisibility={(value: boolean): void => setTalismanTowerVisibility(value)}
				/>
				<PetMastery
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
				/>
				<Teleportation
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					visible={teleportationVisible}
					hideMenu={(): void => setTeleportationVisibility(false)}
				/>
				<CurrencyGainAnimation />
				<SpinWheel visible={spinWheelVisibility} hideMenu={(): void => setSpinWheelVisibility(false)} />
				<ItemInventory
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
					visible={itemsVisibility}
					hideMenu={(): void => setItemsVisibility(false)}
				/>
				<DatastoreEvents
					enabled={
						!isHatching && !weaponShopVisibility && !talismanTowerVisibility && !itemsVisibility && !tradingVisibility
					}
				/>
				<AutoFight enabled={autoFightVisibility} hideMenu={(): void => setAutoFightVisibility(false)} />
				<AccountHub enabled={accountHubVisibility} hideMenu={(): void => setAccountHubVisibility(false)} />
				<Fusing
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility
					}
				/>
				<Trading
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!spinWheelVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility
					}
					visible={tradingVisibility}
					hideMenu={(): void => setTradingVisibility(false)}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
