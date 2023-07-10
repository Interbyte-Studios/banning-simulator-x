import { Eggs } from "shared/configs/eggs";
import { Worlds } from "shared/configs/worlds";
import { ZoneNames, Zones } from "shared/configs/zones";

declare global {
	interface Workspace extends WorldRoot {
		"client objects": Folder & {
			pets: Folder;
			talismans: Folder;
		};
		worlds: Folder & {
			[P in keyof Worlds]: Folder & {
				zones: Folder;
				landing: Folder;
			};
		};
		interactions: Folder & {
			worldPrestige: Folder & {
				[WORLD in keyof Worlds]: Folder & {
					prestige: Folder & {
						vendor: Model & {
							primary: BasePart;
						};
					};
					upgrades: Folder & {
						vendor: Model & {
							primary: BasePart;
						};
					};
				};
			};
			chests: Folder & {
				vip: Folder;
				group: Folder;
			};
			weaponShops: Folder;
			talismanShops: Folder;
			invites: Folder & {
				interactions: Folder;
			};
			leaderboards: Folder & {
				bans: Folder;
				eggs: Folder;
			};
			radiantMachines: Folder & {
				interactions: Folder;
			};
			voidMachines: Folder & {
				interactions: Folder;
			};
			teleports: Folder & {
				[P in ZoneNames]: BasePart;
			};
			eggs: Folder & {
				[P in keyof Eggs]: Folder & {
					deco: Folder;
					regular: Folder & {
						deco: Folder;
						egg: Model;
						cost: BasePart;
					};
					void: Folder & {
						deco: Folder;
						egg: Model;
						cost: BasePart;
					};
				};
			};
			worlds: Folder & {
				[P in keyof Worlds]: {
					weaponShop: Folder;
					talismanTower: Folder;
					petMastery: Folder & {
						petMasteryVendor: Model;
					};
				};
			};
			itemShop: Folder & {
				[P in keyof Worlds]: Folder & {
					cameraline: BasePart;
					weapons: Folder;
				};
			};
			talismanTowers: Folder & {
				[P in keyof Worlds]: Folder & {
					talismans: Folder;
					cameraline: BasePart;
				};
			};
			rankUpgrade: Folder & {
				interact: BasePart;
				teleport: BasePart;
			};
		};
		decoration: Folder & {
			[P in keyof Worlds]: Folder & {
				[P in keyof Zones]: Folder & {
					sign: Folder & {
						zoneInfo: Folder & {
							display: BasePart;
						};
						description: Folder & {
							infoPart: Part;
						};
					};
					door: Folder & {
						"tower crystals": Model;
						"gate meshes": Model;
						"left crystal": Model;
						lock: Model;
						"middle crystal": Model;
						"right crystal": Model;
						passage: BasePart;
					};
				};
			};
		};
	}
}
