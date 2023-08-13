import { Eggs } from "shared/configs/eggs";
import { Worlds } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

declare global {
	interface Workspace extends WorldRoot {
		trials: Folder;
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
			timeTrials: Folder & {
				[P in keyof Worlds]: BasePart;
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
				timeTrials: Folder;
			};
			radiantMachines: Folder & {
				interactions: Folder;
			};
			voidMachines: Folder & {
				interactions: Folder;
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
					cameraline: Model & {
						cameraline: BasePart;
					};
					weapons: Folder;
				};
			};
			talismanTowers: Folder & {
				[P in keyof Worlds]: Folder & {
					talismans: Folder;
					cameraline: Model & {
						cameraline: BasePart;
					};
				};
			};
			rankUpgrade: Folder & {
				["Ban Land"]: BasePart;
				["Ban Land Teleport"]: BasePart;
				["Cyber Cities"]: BasePart;
				["Cyber Cities Teleport"]: BasePart;
			};
			portals: Folder & {
				[World in keyof Worlds]: Folder & {
					interaction: BasePart;
				};
			};
		};
		decoration: Folder & {
			[P in keyof Worlds]: Folder & {
				[P in keyof ZoneNames]: Folder & {
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
