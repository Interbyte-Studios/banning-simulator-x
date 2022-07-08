import { Eggs } from "shared/configs/eggs";
import { Weapons } from "shared/configs/weapons";
import { NPCs } from "shared/configs/zones";

declare global {
	interface ReplicatedStorage extends Instance {
		assetObjects: Folder & {
			eggs: Folder & {
				[P in keyof Eggs]: Folder & {
					regular: Folder & {
						egg: Model;
						["egg cracked 1"]: Model;
						["egg cracked 2"]: Model;
						["egg cracked 3"]: Model;
					};
					void: Folder & {
						egg: Model;
						["egg cracked 1"]: Model;
						["egg cracked 2"]: Model;
						["egg cracked 3"]: Model;
					};
				};
			};
			pets: Folder & {
				[P in keyof Eggs]: Folder & {
					[T in keyof Eggs[P]["pets"]]: Model;
				};
			};
			weapons: Folder & {
				[P in keyof Weapons]: Tool;
			};
			npcs: Folder & {
				[P in keyof NPCs]: Model;
			};
			hatch: Part & {
				attachment: Attachment & {
					flare: ParticleEmitter;
				};
			};
		};
	}
}
