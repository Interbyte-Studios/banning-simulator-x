import { Eggs } from "shared/configs/eggs";
import { Weapons, WeaponType } from "shared/configs/weapons";
import { NPCs } from "shared/configs/zones";

declare global {
	interface ReplicatedStorage extends Instance {
		animations: Folder & {
			weapons: Folder & {
				[P in WeaponType]: Folder & {
					Attack: Animation;
					Attack2: Animation;
					Attack3: Animation;
					Idle: Animation;
					Equip: Animation;
				};
			};
			npcs: Folder & {
				runAnimation: Animation;
			};
		};
		assetObjects: Folder & {
			tags: Folder & {
				playerTag: BillboardGui & {
					hold: Frame & {
						UIListLayout: UIListLayout;
						name: TextLabel & {
							UIStroke: UIStroke;
							rank: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
						};
						staff: TextLabel & {
							UIStroke: UIStroke;
						};
						title: TextLabel & {
							UIStroke: UIStroke;
						};
					};
				};
				enemyTag: BillboardGui & {
					hold: Frame & {
						UIListLayout: UIListLayout;
						fillBackground: ImageLabel & {
							UICorner: UICorner;
							fill: ImageLabel & {
								UICorner: UICorner;
							};
							health: TextLabel & {
								UIStroke: UIStroke;
							};
						};
						name: TextLabel & {
							UIStroke: UIStroke;
							rank: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
							};
						};
						title: TextLabel & {
							UIStroke: UIStroke;
						};
					};
				};
			};
			emitters: Folder & {
				"hatching emitters": Folder & {
					flare: Part & {
						attachment: Attachment & {
							flare: ParticleEmitter;
						};
					};
					legendary: Part & {
						attachment: Attachment & {
							legendary: ParticleEmitter;
						};
					};
					prismatic: Part & {
						attachment: Attachment & {
							prismatic: ParticleEmitter;
						};
					};
					primordial: Part & {
						attachment: Attachment & {
							primordial: ParticleEmitter;
						};
					};
				};
				"impact emitters": Folder & {
					Impact: BasePart;
				};
				"ban emitters": Folder & {
					Banned: BasePart;
					Banned1: BasePart;
					Banned2: BasePart;
					Banned3: BasePart;
				};
				"crit ban emitters": Folder & {
					Banned: BasePart;
					Banned1: BasePart;
					Banned2: BasePart;
					Banned3: BasePart;
				};
			};
			eggs: Folder & {
				[P in keyof Eggs]: Folder & {
					regular: Folder & {
						egg: Model;
					};
					void: Folder & {
						egg: Model;
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
			talismans: Folder;
		};
		events: Folder & {
			timeUpdated: NumberValue;
			currency: Configuration & {
				enabled: BoolValue;
				multiplier: IntValue;
			};
			experience: Configuration & {
				enabled: BoolValue;
				multiplier: IntValue;
			};
			luck: Configuration & {
				enabled: BoolValue;
			};
		};
		leaderboards: Folder & {
			bans: Folder;
			eggs: Folder;
			timeUpdated: NumberValue;
		};
		PetExistStores: ObjectValue;
		GameVersion: StringValue;
	}
}
