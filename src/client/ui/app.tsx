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
import { TalismanLevelUpAnimation } from "./components/talismanLevelUp";
import { TalismanTowerHandle } from "./components/talismans";
import { Teleportation } from "./components/teleportation";
import { Trading } from "./components/trading";
import { WeaponLevelUpAnimation } from "./components/weaponLevelUp";
import { WeaponShopHandle } from "./components/weaponShop";
import { ZonesUI } from "./components/zones";
import { hooks } from "./hooks";
import { remoteContext } from "./mocks/remoteContext";

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
export const app = hooks((props: AppProps, { useState, useContext, useEffect }) => {
	const [teleportationVisible, setTeleportationVisibility] = useState(false);
	const [weaponShopVisibility, setWeaponShopVisibility] = useState(false);
	const [talismanTowerVisibility, setTalismanTowerVisibility] = useState(false);
	const [itemsVisibility, setItemsVisibility] = useState(false);
	const [autoFightVisibility, setAutoFightVisibility] = useState(false);
	const [accountHubVisibility, setAccountHubVisibility] = useState(false);
	const [tradingVisibility, setTradingVisibility] = useState(false);
	const [tradeRequestInbound, setTradeRequestInbound] = useState<Player | undefined>(undefined);

	const [isHatching, setHatchingStatus] = useState(false);

	const { receiveTradeRequest } = useContext(remoteContext);
	useEffect(() => {
		const connection = receiveTradeRequest.Connect((playerWhoSent) => setTradeRequestInbound(playerWhoSent));

		return (): void => connection.Disconnect();
	});

	const hasActiveTrade = tradeRequestInbound !== undefined;

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					visible={
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<Hud
					visible={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
					displayTeleportation={(): void => setTeleportationVisibility(true)}
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
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
				/>
				<WeaponEquip
					visible={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
				/>
				<RankUpgrade
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
				/>
				<WeaponShopHandle
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
					weaponShopVisible={weaponShopVisibility}
					setWeaponShopVisibility={(value: boolean): void => setWeaponShopVisibility(value)}
				/>
				<TalismanTowerHandle
					enabled={
						!isHatching &&
						!teleportationVisible &&
						!weaponShopVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
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
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
				/>
				<Teleportation
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
					visible={teleportationVisible}
					hideMenu={(): void => setTeleportationVisibility(false)}
				/>
				<CurrencyGainAnimation />
				<ItemInventory
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
					visible={itemsVisibility}
					hideMenu={(): void => setItemsVisibility(false)}
				/>
				<DatastoreEvents
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!tradingVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!teleportationVisible
					}
				/>
				<AutoFight enabled={autoFightVisibility} hideMenu={(): void => setAutoFightVisibility(false)} />
				<AccountHub enabled={accountHubVisibility} hideMenu={(): void => setAccountHubVisibility(false)} />
				<Fusing
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!tradingVisibility &&
						!hasActiveTrade
					}
				/>
				<Trading
					enabled={
						!isHatching &&
						!weaponShopVisibility &&
						!talismanTowerVisibility &&
						!itemsVisibility &&
						!autoFightVisibility &&
						!accountHubVisibility &&
						!hasActiveTrade
					}
					visible={tradingVisibility}
					hideMenu={(): void => setTradingVisibility(false)}
					activelyRequestingPlayer={tradeRequestInbound}
					declineTrade={(): void => setTradeRequestInbound(undefined)}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
