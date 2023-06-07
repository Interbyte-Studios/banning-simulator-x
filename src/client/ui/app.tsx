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
import { EggCost } from "./components/eggCosts";
import { WeaponEquip } from "./components/equip/weaponEquip";
import { Fusing } from "./components/fusing";
import { Hud } from "./components/hud";
import { ItemInventory } from "./components/items";
import { Leaderboards } from "./components/leaderboards";
import { PetMastery } from "./components/petMastery";
import { RankUpgrade } from "./components/ranks/menu";
import { Rewards } from "./components/rewards";
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

export const app = hooks((props: AppProps, { useState, useEffect, useContext }) => {
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

		return (): void => {
			ContextActionService.UnbindAction("equipWeapon");
		};
	});

	/**
	 * Determines if any menu is visible.
	 *
	 * @param currentMenu The current menu that is being displayed.
	 * @returns Whether or not any menu is visible.
	 */
	const isMenuVisible = (currentMenu?: keyof typeof visibilityStates): boolean =>
		Object.entries(visibility)
			.filter(([menu]) => menu !== currentMenu)
			.some(([, value]) => value) ||
		activeTrade ||
		isHatching;

	warn(`-------------------------`);
	warn(`Rendering UI at ${os.clock()}...`);
	Object.entries(visibility).forEach(([key, value]) => warn(`${key}: ${value}`));
	warn(`-------------------------`);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>
				<Hud
					visible={!isMenuVisible()}
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportationVisible: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, itemsVisible: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFightVisible: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHubVisible: true })}
					displayTradingMenu={(): void => setVisibility({ ...visibilityStates, tradingVisible: true })}
				/>
				<WeaponShopHandle
					enabled={!isMenuVisible("weaponShopVisible")}
					setVisibility={(value: boolean): void => setVisibility((prev) => ({ ...prev, weaponShopVisible: value }))}
				/>
				<TalismanTowerHandle
					enabled={!isMenuVisible("talismanTowerVisible")}
					setVisibility={(value: boolean): void => setVisibility((prev) => ({ ...prev, talismanTowerVisible: value }))}
				/>
				<PetMastery
					enabled={!isMenuVisible("petMasteryVisible")}
					setVisibility={(value: boolean): void => setVisibility((prev) => ({ ...prev, petMasteryVisible: value }))}
				/>
				<Teleportation
					enabled={!isMenuVisible("teleportationVisible")}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, teleportationVisible: false }))}
				/>
				<ItemInventory
					enabled={!isMenuVisible("itemsVisible")}
					hideMenu={(): void => {
						warn(`Beginning to exit item inventory at: ${os.clock()}`);
						setVisibility((prev) => ({ ...prev, itemsVisible: false }));
						warn(`Finished exitting item inventory at: ${os.clock()}`);
					}}
				/>
				<AutoFight
					enabled={visibility.autoFightVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, autoFightVisible: false }))}
				/>
				<AccountHub
					enabled={visibility.accountHubVisible}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, accountHubVisible: false }))}
				/>
				<Trading
					tradeMenusEnabled={!isMenuVisible("tradingVisible")}
					setActiveTrade={(value: boolean): void => {
						setActiveTrade(value);
					}}
					hideMenu={(): void => {
						setVisibility((prev) => ({ ...prev, tradingVisible: false }));
					}}
				/>
				<SpinWheel
					visible={visibility.spinWheelVisibility}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, spinWheelVisibility: false }))}
				/>
				<DatastoreEvents enabled={!isMenuVisible()} />
				<ZonesUI enabled={!isMenuVisible()} />
				<WeaponEquip visible={!isMenuVisible()} />
				<RankUpgrade enabled={!isMenuVisible()} />
				<Fusing enabled={!isMenuVisible()} />
				<Leaderboards />
				<Rewards />
				<LocalMessages />
				<EggCost />
				<WeaponLevelUpAnimation />
				<TalismanLevelUpAnimation />
				<CurrencyGainAnimation />
			</>
		</RoactRodux.StoreProvider>
	);
});
