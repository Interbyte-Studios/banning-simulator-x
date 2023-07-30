import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import {
	CollectionService,
	ContextActionService,
	Lighting,
	Players,
	ReplicatedStorage,
	TweenService,
	Workspace,
} from "@rbxts/services";
import Icon from "@rbxts/topbar-plus";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Variants } from "shared/configs/pets";
import { Store } from "shared/rodux";
import { isValidWorld } from "shared/util/isValidWorld";

import { LocalMessages } from "../components/announcements";
import { EggHud } from "../components/eggs/control";
import { EggCost } from "../components/eggs/costs";
import { Accolades } from "../components/features/accolades";
import { AccountHub } from "../components/features/account";
import { Mastery } from "../components/features/accountMastery";
import { AutoFight } from "../components/features/auto fight";
import { Codes } from "../components/features/codes";
import { ItemInventory } from "../components/features/items";
import { PetMastery } from "../components/features/petMastery";
import { PetQuest } from "../components/features/petQuest";
import { Settings } from "../components/features/settings";
import { SpinWheel } from "../components/features/spinWheel";
import { Teleportation } from "../components/features/teleportation";
import { TimeTrials } from "../components/features/timeTrials";
import { WorldPrestige } from "../components/features/worldPrestige";
import { WorldPrestigeViewType } from "../components/features/worldPrestige/prestigeEnum";
import { RankUpgrade } from "../components/ranks/menu";
import { TalismanTowerHandle } from "../components/shops/talismanShop";
import { WeaponShopHandle } from "../components/shops/weaponShop";
import { BoostCounter } from "../components/standalone/boostCounter";
import { DailyRewards } from "../components/standalone/dailyRewards";
import { Fusing } from "../components/standalone/fusing";
import { Hud } from "../components/standalone/hud";
import { CurrencyGainAnimation } from "../components/standalone/notifications/currencyGainAnimation";
import { DatastoreEvents } from "../components/standalone/notifications/datastoreEvents";
import { TalismanLevelUpAnimation } from "../components/standalone/notifications/talismanLevelUp";
import { WeaponLevelUpAnimation } from "../components/standalone/notifications/weaponLevelUp";
import { Rewards } from "../components/standalone/rewards";
import { RobuxShop } from "../components/standalone/robuxShop";
import { UpdateLog } from "../components/standalone/updateLog";
import { WeaponEquip } from "../components/standalone/weapons/weaponEquip";
import { ZonesUI } from "../components/standalone/zones";
import { AnnouncementContext, AnnouncementType } from "../context/AnnouncementsAPI";
import { hooks } from "../hooks";
import { remoteContext } from "../mocks/remoteContext";

interface AppProps {
	player: Player;
	store: Store;
	tradingEnabled: boolean;
	setTradingEnabled: () => void;
	setTrialsEnabled: (value: boolean) => void;
}

const visibilityStates = {
	accolades: false,
	accountMastery: false,
	dailyRewards: false,
	teleportation: false,
	weaponShop: false,
	talismanTower: false,
	items: false,
	autoFight: false,
	accountHub: false,
	petMastery: false,
	fusing: false,
	settings: false,
	codes: false,
	robuxShop: false,
	worldPrestige: false,
	updateLog: false,
	spinWheel: false,
	timeTrials: false,
	petQuest: false,
};

let popupsShown = false;

const updateLogIcon = new Icon().setImage(assetIds.images.decals.UpdateLog).setLabel("Update Log");
const blurEffect = Lighting.WaitForChild("Blur") as BlurEffect;
blurEffect.Size = 0;
blurEffect.Parent = Lighting;

export const Main = hooks((props: AppProps, { useState, useEffect, useContext, useCallback, useMemo }) => {
	const [visibility, setVisibility] = useState(visibilityStates);
	const [fusingVariant, setFusingVariant] = useState<Exclude<Variants, "regular"> | undefined>(undefined);
	const [prestigeViewType, setPrestigeViewType] = useState<WorldPrestigeViewType>(WorldPrestigeViewType.Prestige);

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
	const { equipWeapon, unequipWeapon } = useContext(remoteContext);

	useEffect(() => {
		// Equip weapon on Z press.
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

		// Open weapon, talisman, fusing, or mastery
		ContextActionService.BindAction(
			"openShop",
			(_, state) => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}

				const character = Players.LocalPlayer.Character;
				if (character === undefined) {
					return;
				}

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					return;
				}

				const rootPart = humanoid.RootPart;
				if (rootPart === undefined) {
					return;
				}

				for (const interaction of Workspace.interactions.timeTrials.GetChildren()) {
					if (!interaction.IsA("BasePart")) {
						continue;
					}

					const magnitude = rootPart.Position.sub(interaction.Position).Magnitude;
					if (magnitude <= 30) {
						setVisibility({ ...visibilityStates, timeTrials: true });
						return;
					}
				}

				for (const interaction of Workspace.interactions.weaponShops.GetChildren()) {
					if (!interaction.IsA("BasePart")) {
						continue;
					}

					const magnitude = rootPart.Position.sub(interaction.Position).Magnitude;
					if (magnitude <= 30) {
						setVisibility({ ...visibilityStates, weaponShop: true });
						return;
					}
				}

				for (const interaction of Workspace.interactions.talismanShops.GetChildren()) {
					if (!interaction.IsA("BasePart")) {
						continue;
					}

					const magnitude = rootPart.Position.sub(interaction.Position).Magnitude;
					if (magnitude <= 30) {
						setVisibility({ ...visibilityStates, talismanTower: true });
						return;
					}
				}

				for (const interaction of Workspace.interactions.radiantMachines.interactions.GetChildren()) {
					if (!interaction.IsA("BasePart")) {
						return;
					}

					const magnitude = rootPart.Position.sub(interaction.Position).Magnitude;
					if (magnitude <= 30) {
						setFusingVariant("radiant");
						setVisibility({ ...visibilityStates, fusing: true });
						return;
					}
				}

				for (const interaction of Workspace.interactions.voidMachines.interactions.GetChildren()) {
					if (!interaction.IsA("BasePart")) {
						return;
					}

					const magnitude = rootPart.Position.sub(interaction.Position).Magnitude;
					if (magnitude <= 30) {
						setFusingVariant("void");
						setVisibility({ ...visibilityStates, fusing: true });
						return;
					}
				}

				CollectionService.GetTagged("petMasteryVendor").forEach((petVendor) => {
					assert(petVendor.IsA("Model"), `Expected pet mastery vendor "${petVendor.Name}" to be a model.`);

					const primaryPart = petVendor.PrimaryPart;
					if (primaryPart === undefined) {
						return;
					}

					const petMasteryFolder = petVendor.Parent as Folder;
					assert(petMasteryFolder, `Expected the parent of the pet mastery vendor "${petVendor.Name} to exist."`);

					const world = petMasteryFolder.Parent as Folder;
					assert(
						world,
						`Expected the extended parent of the pet mastery vendor "${petVendor.Name}" to be a world's interactions folder. `,
					);

					const worldName = world.Name;
					assert(
						isValidWorld(worldName),
						`Expected the world folder parent to the pet mastery vendor "${petVendor.Name}" to be named after a valid world.`,
					);

					const magnitude = rootPart.Position.sub(primaryPart.Position).Magnitude;
					if (magnitude <= 30) {
						setVisibility({ ...visibilityStates, petMastery: true });
						return;
					}
				});
			},
			false,
			Enum.KeyCode.E,
		);

		return (): void => {
			ContextActionService.UnbindAction("equipWeapon");
			ContextActionService.UnbindAction("openShop");
		};
	}, [visibility]);

	useEffect(() => {
		const connection = updateLogIcon.selected.Connect(() => {
			playSFX(UIEngagement.MajorEngagement);
			setVisibility({ ...visibilityStates, updateLog: true });
		});

		const deselectedConnection = updateLogIcon.deselected.Connect(() => {
			playSFX(UIEngagement.MajorEngagement);
			setVisibility({ ...visibilityStates, updateLog: false });
		});

		return (): void => {
			connection.Disconnect();
			deselectedConnection.Disconnect();
		};
	});

	useEffect(() => {
		if (!popupsShown) {
			popupsShown = true;
			setVisibility({ ...visibilityStates, updateLog: true, dailyRewards: true, petQuest: true });
		}
	}, []);

	/**
	 * Toggles the blur effect.
	 *
	 * @param display Whether or not to display the blur.
	 */
	const toggleBlur = (display: boolean): void => {
		if (display) {
			blurEffect.Size = 0;
			TweenService.Create(blurEffect, new TweenInfo(0.5), { Size: 20 }).Play();
		} else {
			TweenService.Create(blurEffect, new TweenInfo(0.5), { Size: 0 }).Play();
		}
	};

	/**
	 * Determines if any menu is visible.
	 *
	 * @param currentMenu The current menu that is being displayed.
	 * @returns Whether or not any menu is visible.
	 */
	const isMenuVisible = useCallback(
		(currentMenu?: keyof typeof visibilityStates) =>
			props.tradingEnabled ||
			Object.entries(visibility)
				.filter(([menu]) => menu !== currentMenu)
				.some(([, value]) => value),
		[visibility, props.tradingEnabled],
	);

	/**
	 * Determines if a menu is visible.
	 *
	 * @param currentMenu The current menu that is being displayed.
	 * @returns Whether or not the menu is visible.
	 */
	const isVisible = useCallback((currentMenu: keyof typeof visibilityStates) => visibility[currentMenu], [visibility]);

	useEffect(
		() =>
			toggleBlur(isMenuVisible() && !isVisible("autoFight") && !isVisible("weaponShop") && !isVisible("talismanTower")),
		[visibility, isVisible],
	);

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
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}

						props.setTradingEnabled();
					}}
					hiddenHud={false}
				/>,
				<TimeTrials
					isVisible={false}
					setVisibility={(value): void => setVisibility({ ...visibilityStates, timeTrials: value })}
					setTrialsEnabled={(value: boolean): void => {
						if (value) {
							TweenService.Create(blurEffect, new TweenInfo(0.5), { Size: 0 }).Play();
							Lighting.Ambient = Color3.fromRGB(255, 198, 149);
							Lighting.ColorShift_Bottom = Color3.fromRGB(255, 170, 0);
							Lighting.ColorShift_Top = Color3.fromRGB(85, 0, 127);
							Lighting.ClockTime = 0;
							Lighting.FogColor = Color3.fromRGB(255, 170, 0);
						}
						props.setTrialsEnabled(value);
					}}
				/>,
				<WeaponShopHandle
					isVisible={false}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, weaponShop: value })}
				/>,
				<TalismanTowerHandle
					isVisible={false}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, talismanTower: value })}
				/>,
				<PetMastery
					isVisible={false}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, petMastery: value })}
				/>,
				<Fusing
					isVisible={false}
					variant={fusingVariant}
					setVisibility={(value: boolean): void => {
						if (!value) {
							setFusingVariant(undefined);
						}
						setVisibility({ ...visibilityStates, fusing: value });
					}}
				/>,
				<WorldPrestige
					isVisible={false}
					viewType={prestigeViewType}
					setViewType={(viewType: WorldPrestigeViewType): void => setPrestigeViewType(viewType)}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, worldPrestige: value })}
				/>,
				<WeaponLevelUpAnimation />,
				<TalismanLevelUpAnimation />,
				<CurrencyGainAnimation />,
				<WeaponEquip />,
				<RankUpgrade />,
				<DatastoreEvents />,
			);
		} else if (isVisible("timeTrials")) {
			components.push(
				<TimeTrials
					isVisible={true}
					setVisibility={(value): void => setVisibility({ ...visibilityStates, timeTrials: value })}
					setTrialsEnabled={(value: boolean): void => {
						if (value) {
							TweenService.Create(blurEffect, new TweenInfo(0.5), { Size: 0 }).Play();
							Lighting.Ambient = Color3.fromRGB(255, 198, 149);
							Lighting.ColorShift_Bottom = Color3.fromRGB(255, 170, 0);
							Lighting.ColorShift_Top = Color3.fromRGB(85, 0, 127);
							Lighting.ClockTime = 0;
							Lighting.FogColor = Color3.fromRGB(255, 170, 0);
						}
						props.setTrialsEnabled(value);
					}}
				/>,
			);
		} else if (isVisible("updateLog")) {
			components.push(
				<UpdateLog hideMenu={(): void => setVisibility((prev) => ({ ...prev, updateLog: false }))} />,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}

						props.setTradingEnabled();
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("worldPrestige")) {
			components.push(
				<WorldPrestige
					isVisible={true}
					viewType={prestigeViewType}
					setViewType={(viewType: WorldPrestigeViewType): void => setPrestigeViewType(viewType)}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, worldPrestige: value })}
				/>,
			);
		} else if (isVisible("fusing")) {
			components.push(
				<Fusing
					isVisible={true}
					variant={fusingVariant}
					setVisibility={(value: boolean): void => {
						if (!value) {
							setFusingVariant(undefined);
						}
						setVisibility({ ...visibilityStates, fusing: value });
					}}
				/>,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("weaponShop")) {
			components.push(
				<WeaponShopHandle
					isVisible={true}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, weaponShop: value })}
				/>,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("talismanTower")) {
			components.push(
				<TalismanTowerHandle
					isVisible={true}
					setVisibility={(value: boolean): void => setVisibility({ ...visibilityStates, talismanTower: value })}
				/>,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("petMastery")) {
			components.push(
				<PetMastery
					isVisible={true}
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
			components.push(
				<AutoFight hideMenu={(): void => setVisibility((prev) => ({ ...prev, autoFight: false }))} />,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("accolades")) {
			components.push(<Accolades hideMenu={(): void => setVisibility((prev) => ({ ...prev, accolades: false }))} />);
		} else if (isVisible("accountMastery")) {
			components.push(<Mastery hideMenu={(): void => setVisibility((prev) => ({ ...prev, accountMastery: false }))} />);
		} else if (isVisible("accountHub")) {
			components.push(<AccountHub hideMenu={(): void => setVisibility((prev) => ({ ...prev, accountHub: false }))} />);
		} else if (isVisible("codes")) {
			components.push(<Codes hideMenu={(): void => setVisibility((prev) => ({ ...prev, codes: false }))} />);
		} else if (isVisible("settings")) {
			components.push(<Settings hideMenu={(): void => setVisibility((prev) => ({ ...prev, settings: false }))} />);
		} else if (isVisible("robuxShop")) {
			components.push(<RobuxShop hideMenu={(): void => setVisibility((prev) => ({ ...prev, robuxShop: false }))} />);
		} else if (isVisible("spinWheel")) {
			components.push(<SpinWheel hideMenu={(): void => setVisibility((prev) => ({ ...prev, spinWheel: false }))} />);
		} else if (isVisible("dailyRewards")) {
			components.push(
				<DailyRewards hideMenu={(): void => setVisibility((prev) => ({ ...prev, dailyRewards: false }))} />,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}

						props.setTradingEnabled();
					}}
					hiddenHud={true}
				/>,
			);
		} else if (isVisible("petQuest")) {
			components.push(
				<PetQuest hideMenu={(): void => setVisibility((prev) => ({ ...prev, petQuest: false }))} />,
				<Hud
					displayTeleportation={(): void => setVisibility({ ...visibilityStates, teleportation: true })}
					displayItems={(): void => setVisibility({ ...visibilityStates, items: true })}
					displayAutoFight={(): void => setVisibility({ ...visibilityStates, autoFight: true })}
					displayAccount={(): void => setVisibility({ ...visibilityStates, accountHub: true })}
					displayCodes={(): void => setVisibility({ ...visibilityStates, codes: true })}
					displaySettings={(): void => setVisibility({ ...visibilityStates, settings: true })}
					displayShop={(): void => setVisibility({ ...visibilityStates, robuxShop: true })}
					displaySpinWheel={(): void => setVisibility({ ...visibilityStates, spinWheel: true })}
					displayAccolades={(): void => setVisibility({ ...visibilityStates, accolades: true })}
					displayMastery={(): void => setVisibility({ ...visibilityStates, accountMastery: true })}
					displayPetMastery={(): void => setVisibility({ ...visibilityStates, petMastery: true })}
					displayDailyRewards={(): void => setVisibility({ ...visibilityStates, dailyRewards: true })}
					displayPetQuest={(): void => setVisibility({ ...visibilityStates, petQuest: true })}
					displayTradingMenu={(): void => {
						if (!ReplicatedStorage.events.trading.enabled.Value) {
							addAnnouncement(`Trading is currently disabled. Try again later.`, AnnouncementType.Error);
							return;
						}

						props.setTradingEnabled();
					}}
					hiddenHud={true}
				/>,
			);
		}

		components.push(<ZonesUI />, <Rewards />, <LocalMessages />, <EggCost />, <EggHud />, <BoostCounter />);

		return components;
	}, [visibility, isMenuVisible]);

	return (
		<RoactRodux.StoreProvider store={props.store}>
			<>{visibleComponents}</>
		</RoactRodux.StoreProvider>
	);
});
