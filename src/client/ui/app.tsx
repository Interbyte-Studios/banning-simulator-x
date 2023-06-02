import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
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
import { Leaderboards } from "./components/leaderboards";
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
import { remoteContext } from "./mocks/remoteContext";

interface AppProps {
	player: Player;
	store: Store;
}

const visibilityStates = {
	teleportationVisible: false,
	weaponShopVisible: false,
	talismanTowerVisible: false,
	itemsVisible: false,
	autoFightVisible: false,
	accountHubVisible: false,
	tradingVisible: false,
	petMasteryVisible: false,
	spinWheelVisibility: false,
};

export const app = hooks((props: AppProps, { useState, useCallback, useEffect, useContext }) => {
	const [visibility, setVisibility] = useState(visibilityStates);
	const [activeTrade, setActiveTrade] = useState(false);
	const [isHatching, setHatchingStatus] = useState(false);

	const { equipWeapon, unequipWeapon } = useContext(remoteContext);

	useEffect(() => {
		ContextActionService.BindAction(
			"equipWeapon",
			async (_, state) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				if (props.store.getState().currentWeapon.equipped) {
					unequipWeapon.SendToServer();
				} else {
					equipWeapon.SendToServer();
				}
			},
			false,
			Enum.KeyCode.Z,
		);
	});

	const isMenuVisible = useCallback(
		(currentMenu?: keyof typeof visibilityStates) =>
			Object.entries(visibility)
				.filter(([menu]) => menu !== currentMenu)
				.some(([, value]) => value) ||
			activeTrade ||
			isHatching,
		[visibility, activeTrade, isHatching],
	);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<EggsUI
					visible={!isMenuVisible()}
					setHatchingStatus={(isHatching: boolean): void => setHatchingStatus(isHatching)}
				/>
				<Hud
					visible={!isMenuVisible()}
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportationVisible: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, itemsVisible: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFightVisible: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHubVisible: true })}
					displayTradingMenu={(): void => setVisibility({ ...visibilityStates, tradingVisible: true })}
				/>
				<WeaponLevelUpAnimation enabled={true} />
				<TalismanLevelUpAnimation enabled={true} />
				<LocalMessages />
				<ZonesUI enabled={!isMenuVisible()} />
				<WeaponEquip visible={!isMenuVisible()} />
				<RankUpgrade enabled={!isMenuVisible()} />
				<WeaponShopHandle
					enabled={!isMenuVisible("weaponShopVisible")}
					weaponShopVisible={visibility.weaponShopVisible}
					setWeaponShopVisibility={(value: boolean): void =>
						setVisibility((prev) => ({ ...prev, weaponShopVisible: value }))
					}
				/>
				<TalismanTowerHandle
					enabled={!isMenuVisible("talismanTowerVisible")}
					talismanTowerVisible={visibility.talismanTowerVisible}
					setTalismanTowerVisibility={(value: boolean): void =>
						setVisibility((prev) => ({ ...prev, talismanTowerVisible: value }))
					}
				/>
				<PetMastery
					enabled={!isMenuVisible("petMasteryVisible")}
					setPetMasteryVisibility={(value: boolean): void =>
						setVisibility((prev) => ({ ...prev, petMasteryVisible: value }))
					}
				/>
				<Teleportation
					enabled={!isMenuVisible("teleportationVisible")}
					visible={visibility.teleportationVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, teleportationVisible: false }))}
				/>
				<CurrencyGainAnimation />
				<ItemInventory
					enabled={!isMenuVisible("itemsVisible")}
					visible={visibility.itemsVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, itemsVisible: false }))}
				/>
				<DatastoreEvents enabled={!isMenuVisible()} />
				<AutoFight
					enabled={visibility.autoFightVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, autoFightVisible: false }))}
				/>
				<AccountHub
					enabled={visibility.accountHubVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, accountHubVisible: false }))}
				/>
				<Fusing enabled={!isMenuVisible()} />
				<Trading
					tradeMenusEnabled={!isMenuVisible("tradingVisible")}
					tradeMenusVisible={visibility.tradingVisible}
					setActiveTrade={(value: boolean): void => {
						//print(`Setting active trade to ${value}`);
						setActiveTrade(value);
					}}
					hideMenu={(): void => {
						//warn(`Hiding trading`);
						setVisibility((prev) => ({ ...prev, tradingVisible: false }));
					}}
				/>
				<SpinWheel
					visible={visibility.spinWheelVisibility}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, spinWheelVisibility: false }))}
				/>
				<Leaderboards />
			</>
		</RoactRodux.StoreProvider>
	);
});
