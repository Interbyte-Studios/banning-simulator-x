import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
import { Store } from "shared/rodux";

import { AccountHub } from "./components/account";
import { LocalMessages } from "./components/announcements";
import { AutoFight } from "./components/auto fight";
import { EggCost } from "./components/eggCosts";
import { ItemInventory } from "./components/items";
import { Leaderboards } from "./components/leaderboards";
import { PetMastery } from "./components/petMastery";
import { RankUpgrade } from "./components/ranks/menu";
import { Rewards } from "./components/rewards";
import { Fusing } from "./components/standalone/fusing";
import { Hud } from "./components/standalone/hud";
import { CurrencyGainAnimation } from "./components/standalone/notifications/currencyGainAnimation";
import { DatastoreEvents } from "./components/standalone/notifications/datastoreEvents";
import { TalismanLevelUpAnimation } from "./components/standalone/notifications/talismanLevelUp";
import { WeaponLevelUpAnimation } from "./components/standalone/notifications/weaponLevelUp";
import { WeaponEquip } from "./components/standalone/weaponEquip/weaponEquip";
import { TalismanTowerHandle } from "./components/talismans";
import { Teleportation } from "./components/teleportation";
import { Trading } from "./components/trading";
import { WeaponShopHandle } from "./components/weaponShop";
import { ZonesUI } from "./components/zones";
import { hooks } from "./hooks";
import { remoteContext } from "./mocks/remoteContext";

interface AppProps {
	player: Player;
	store: Store;
}

const visibilityStates = {
	teleportation: false,
	weaponShop: false,
	talismanTower: false,
	items: false,
	autoFight: false,
	accountHub: false,
	trading: false,
	petMastery: false,
};

export const app = hooks((props: AppProps, { useState, useEffect, useContext, useCallback, useMemo }) => {
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
	const isMenuVisible = useCallback(
		(currentMenu?: keyof typeof visibilityStates) =>
			Object.entries(visibility)
				.filter(([menu]) => menu !== currentMenu)
				.some(([, value]) => value) ||
			activeTrade ||
			isHatching,
		[visibility, activeTrade, isHatching],
	);

	/**
	 * Determines if a menu is visible.
	 *
	 * @param currentMenu The current menu that is being displayed.
	 * @returns Whether or not the menu is visible.
	 */
	const isVisible = useCallback((currentMenu: keyof typeof visibilityStates) => visibility[currentMenu], [visibility]);

	/**
	 * The components that are visible.
	 */
	const visibleComponents: Array<Roact.Element> = useMemo(() => {
		const components: Array<Roact.Element> = [];

		if (!isMenuVisible()) {
			components.push(
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayTradingMenu={(): void => setVisibility({ ...visibilityStates, trading: true })}
				/>,
				<WeaponLevelUpAnimation />,
				<TalismanLevelUpAnimation />,
				<CurrencyGainAnimation />,
				<WeaponEquip />,
				<RankUpgrade />,
				<Fusing />,
				<DatastoreEvents />,
			);
		} else if (isVisible("weaponShop")) {
			components.push(
				<WeaponShopHandle
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, weaponShop: value })}
				/>,
			);
		} else if (isVisible("talismanTower")) {
			components.push(
				<TalismanTowerHandle
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, talismanTower: value })}
				/>,
			);
		} else if (isVisible("petMastery")) {
			components.push(
				<PetMastery
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, petMastery: value })}
				/>,
			);
		} else if (isVisible("teleportation")) {
			components.push(
				<Teleportation hideMenu={(): void => setVisibility((prev) => ({ ...prev, teleportation: false }))} />,
			);
		} else if (isVisible("items")) {
			components.push(<ItemInventory hideMenu={(): void => setVisibility((prev) => ({ ...prev, items: false }))} />);
		} else if (isVisible("autoFight")) {
			components.push(<AutoFight hideMenu={(): void => setVisibility((prev) => ({ ...prev, autoFight: false }))} />);
		} else if (isVisible("accountHub")) {
			components.push(<AccountHub hideMenu={(): void => setVisibility((prev) => ({ ...prev, accountHub: false }))} />);
		} else if (isVisible("trading")) {
			<Trading
				setActiveTrade={(value: boolean): void => {
					setActiveTrade(value);
				}}
				hideMenu={(): void => {
					setVisibility((prev) => ({ ...prev, trading: false }));
				}}
			/>;
		}

		components.push(<ZonesUI />, <Leaderboards />, <Rewards />, <LocalMessages />, <EggCost />);

		return components;
	}, [visibility]);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>{visibleComponents}</>
		</RoactRodux.StoreProvider>
	);
});
