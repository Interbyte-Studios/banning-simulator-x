import { Eggs } from "shared/configs/eggs";
import { Worlds } from "shared/configs/worlds";
import { Zones } from "shared/configs/zones";

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
					weaponShop: Folder & {
						InteractPrompt: BasePart;
					};
					talismanTower: Folder & {
						InteractPrompt: BasePart;
					};
				};
			};
			itemShop: Folder & {
				[P in keyof Worlds]: Folder & {
					cameraline: BasePart;
				};
			};
			talismanTowers: Folder & {
				[P in keyof Worlds]: Folder & {
					talismans: Folder;
					cameraline: BasePart;
				};
			};
			rankUpgrade: Folder & {
				meshPart: BasePart;
				interact: BasePart;
				teleport: BasePart;
			};
		};
		decoration: Folder & {
			[P in keyof Worlds]: Folder & {
				[P in keyof Zones]: Folder & {
					sign: Folder & {
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
