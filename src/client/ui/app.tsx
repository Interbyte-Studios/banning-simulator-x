import Object from "@rbxts/object-utils";
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

const visibilityStates = {
	teleportationVisible: false,
	weaponShopVisible: false,
	talismanTowerVisible: false,
	itemsVisible: false,
	autoFightVisible: false,
	accountHubVisible: false,
	tradingVisible: false,
	petMasteryVisible: false,
};

export const app = hooks((props: AppProps, { useState, useContext, useEffect, useCallback }) => {
	const [visibility, setVisibility] = useState(visibilityStates);
	const [tradeRequest, setTradeRequest] = useState<{
		inbound: Player | undefined;
		declined: Player | undefined;
		accepted: Player | undefined;
	}>({
		inbound: undefined,
		declined: undefined,
		accepted: undefined,
	});
	const [isHatching, setHatchingStatus] = useState(false);

	const isMenuVisible = useCallback(
		(currentMenu?: keyof typeof visibilityStates) =>
			Object.entries(visibility)
				.filter(([menu]) => menu !== currentMenu)
				.some(([, value]) => value) ||
			Object.values(tradeRequest).some((value) => value !== undefined) ||
			isHatching,
		[visibility, tradeRequest, isHatching],
	);

	const { receiveTradeRequest, tradeRequestDeclined, tradeRequestAccepted } = useContext(remoteContext);
	useEffect(() => {
		const connections: Array<RBXScriptConnection> = [
			receiveTradeRequest.Connect((playerWhoSent) => setTradeRequest((prev) => ({ ...prev, inbound: playerWhoSent }))),
			tradeRequestDeclined.Connect((playerWhoSent) =>
				setTradeRequest((prev) => ({ ...prev, declined: playerWhoSent })),
			),
			tradeRequestAccepted.Connect((playerWhoSent) =>
				setTradeRequest((prev) => ({ ...prev, accepted: playerWhoSent })),
			),
		];

		return (): void => connections.forEach((conn) => conn.Disconnect());
	}, []);

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
					enabled={
						!isMenuVisible("tradingVisible") ||
						tradeRequest.inbound !== undefined ||
						tradeRequest.declined !== undefined ||
						tradeRequest.accepted !== undefined
					}
					visible={
						visibility.tradingVisible ||
						tradeRequest.inbound !== undefined ||
						tradeRequest.declined !== undefined ||
						tradeRequest.accepted !== undefined
					}
					hideMenu={(): void => setVisibility((prev) => ({ ...prev, tradingVisible: false }))}
					activelyRequestingPlayer={tradeRequest.inbound}
					declineTrade={(): void => setTradeRequest((prev) => ({ ...prev, inbound: undefined }))}
					tradeWasDeclined={tradeRequest.declined}
					resetTradeDeclined={(): void => setTradeRequest((prev) => ({ ...prev, declined: undefined }))}
					tradeWasAccepted={tradeRequest.accepted}
				/>
			</>
		</RoactRodux.StoreProvider>
	);
});
