import { Eggs } from "shared/configs/eggs";
import { Talismans } from "shared/configs/talismans";
import { Weapons, WeaponType } from "shared/configs/weapons";
import { NPCs } from "shared/configs/zones";

declare global {
	interface ReplicatedStorage extends Instance {
		animations: Folder & {
			weapons: Folder & {
				[P in WeaponType]: Folder & {
					Attack: Animation;
					Idle: Animation;
					Equip: Animation;
				};
			};
		};
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
				[P in keyof Weapons]: Tool & {
					MeshPart: BasePart;
					Handle: BasePart;
				};
			};
			npcs: Folder & {
				[P in keyof NPCs]: Model;
			};
			talismans: Folder & {
				[P in keyof Talismans]: Model;
			};
			hatch: Part & {
				attachment: Attachment & {
					flare: ParticleEmitter;
				};
			};
		};
	}
}
