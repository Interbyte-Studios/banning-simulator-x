import { Worlds } from "shared/configs/worlds";

declare global {
	interface Workspace extends WorldRoot {
		worlds: Folder & {
			[P in keyof Worlds]: Folder & {
				zones: Folder;
			};
		};
	}
}
