import { Eggs } from "shared/configs/eggs";
import { Worlds } from "shared/configs/worlds";
import { Zones } from "shared/configs/zones";

declare global {
	interface Workspace extends WorldRoot {
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
			["talisman tower"]: Folder;
			talismans: Folder;
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
