import { Eggs } from "shared/configs/eggs";
import { Worlds } from "shared/configs/worlds";

declare global {
	interface Workspace extends WorldRoot {
		worlds: Folder & {
			[P in keyof Worlds]: Folder & {
				zones: Folder;
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
		};
	}
}
