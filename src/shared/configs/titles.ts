import { StoreState } from "shared/rodux";

export enum TitleType {
	Pets,
	Weapons,
	Dungeons, // Utilize quests for these
	Trials, // Utilize quests for these as well
	Misc,
}

interface Title {
	name: string;
	id: number;
	effect: Color3 | ColorSequence;
	category: TitleType;
	description: string;
	condition: (state: StoreState) => boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export const TITLES = [
	// Pets (Hatching)
	{
		name: "Pet Incubator",
		id: 1,
		effect: Color3.fromRGB(255, 194, 87),
		category: TitleType.Pets,
		description: "Hatch 50,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 50_000,
	},
	{
		name: "Hatching Master",
		id: 2,
		effect: Color3.fromRGB(255, 163, 83),
		category: TitleType.Pets,
		description: "Hatch 100,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 100_000,
	},
	{
		name: "Mad Hatcher",
		id: 3,
		effect: Color3.fromRGB(255, 106, 61),
		category: TitleType.Pets,
		description: "Hatch 250,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 250_000,
	},
	{
		name: "Hatching Legend",
		id: 4,
		effect: Color3.fromRGB(255, 61, 44),
		category: TitleType.Pets,
		description: "Hatch 500,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 500_000,
	},
	{
		name: "Egg Enthusiast",
		id: 5,
		effect: Color3.fromRGB(98, 37, 209),
		category: TitleType.Pets,
		description: "Hatch 1,000,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 1_000_000,
	},
	{
		name: "All Nighter",
		id: 6,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(247, 0, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 55, 98)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 149, 151)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 244, 245)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 149, 151)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 55, 98)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(247, 0, 255)),
		]),
		category: TitleType.Pets,
		description: "Hatch 2,500,000 eggs.",
		condition: (state): boolean => state.eggs.eggs >= 2_500_000,
	},

	// Pets (Max Levels Obtained)
	{
		name: "Pet Nurturer",
		id: 7,
		effect: Color3.fromRGB(150, 252, 150),
		category: TitleType.Pets,
		description: "Reach max level with 25 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 25;
		},
	},
	{
		name: "Pet Expert",
		id: 8,
		effect: Color3.fromRGB(59, 255, 59),
		category: TitleType.Pets,
		description: "Reach max level with 50 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 50;
		},
	},
	{
		name: "Pet Master",
		id: 9,
		effect: Color3.fromRGB(237, 227, 51),
		category: TitleType.Pets,
		description: "Reach max level with 75 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 75;
		},
	},
	{
		name: "Pet Tamer",
		id: 10,
		effect: Color3.fromRGB(237, 227, 51),
		category: TitleType.Pets,
		description: "Reach max level with 100 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 100;
		},
	},
	{
		name: "Master Tamer",
		id: 11,
		effect: Color3.fromRGB(237, 191, 51),
		category: TitleType.Pets,
		description: "Reach max level with 250 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 250;
		},
	},
	{
		name: "Pet Guardian",
		id: 12,
		effect: Color3.fromRGB(237, 107, 51),
		category: TitleType.Pets,
		description: "Reach max level with 500 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 500;
		},
	},
	{
		name: "Master Guardian",
		id: 13,
		effect: Color3.fromRGB(250, 69, 69),
		category: TitleType.Pets,
		description: "Reach max level with 750 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 750;
		},
	},
	{
		name: "Pet General",
		id: 14,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 69, 69)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 149, 151)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(239, 201, 126)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 202, 43)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 198, 26)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 141, 1)),
		]),
		category: TitleType.Pets,
		description: "Reach max level with 1,000 pets.",
		condition: (state): boolean => {
			let maxPets = 0;
			state.index.pets.forEach((petData) => {
				maxPets += petData.index.maxLevel.radiant + petData.index.maxLevel.void + petData.index.maxLevel.regular;
			});

			return maxPets >= 1000;
		},
	},

	// Pets (Fusions)
	{
		name: "Fusion Novice",
		id: 15,
		effect: Color3.fromRGB(255, 196, 250),
		category: TitleType.Pets,
		description: "Fuse 250 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 250;
		},
	},
	{
		name: "Fusion Apprentice",
		id: 16,
		effect: Color3.fromRGB(250, 117, 240),
		category: TitleType.Pets,
		description: "Fuse 500 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 500;
		},
	},
	{
		name: "Prestigious Fuser",
		id: 17,
		effect: Color3.fromRGB(255, 0, 235),
		category: TitleType.Pets,
		description: "Fuse 1,000 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 1000;
		},
	},
	{
		name: "Extravagent Fuser",
		id: 18,
		effect: Color3.fromRGB(135, 38, 92),
		category: TitleType.Pets,
		description: "Fuse 2,500 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 2500;
		},
	},
	{
		name: "Fusion Master",
		id: 19,
		effect: Color3.fromRGB(224, 66, 115),
		category: TitleType.Pets,
		description: "Fuse 5,000 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 5000;
		},
	},
	{
		name: "Hexagramic Lord",
		id: 20,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(184, 5, 255)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(128, 0, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(0, 38, 255)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(128, 0, 255)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(206, 121, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 255)),
		]),
		category: TitleType.Pets,
		description: "Fuse 10,000 pets.",
		condition: (state): boolean => {
			let fusions = 0;
			state.index.pets.forEach((petData) => {
				fusions += petData.index.fused.radiant + petData.index.fused.void;
			});

			return fusions > 10000;
		},
	},

	// Pets (Hatching Specific Rarities)
	{
		name: "Secretly Lucky",
		id: 21,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 237, 237)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 255, 127)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(95, 252, 255)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 255, 127)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(85, 255, 255)),
		]),
		category: TitleType.Pets,
		description: "Hatch a Secret+ rarity pet.",
		condition: (state): boolean => state.eggs.rarities.Secret + state.eggs.rarities.Primordial >= 1,
	},
	{
		name: "Secret Champion",
		id: 22,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 170, 127)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 177, 88)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 90, 90)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 177, 88)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 170, 127)),
		]),
		category: TitleType.Pets,
		description: "Hatch a Secret+ rarity pet 5 times.",
		condition: (state): boolean => state.eggs.rarities.Secret + state.eggs.rarities.Primordial >= 5,
	},
	{
		name: "Secret Saint",
		id: 23,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 138, 250)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 46, 19)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 138, 250)),
		]),
		category: TitleType.Pets,
		description: "Hatch a Secret+ rarity pet 10 times.",
		condition: (state): boolean => state.eggs.rarities.Secret + state.eggs.rarities.Primordial >= 10,
	},

	// Weapons (Weapon Level)
	{
		name: "Novice Wielder",
		id: 24,
		effect: Color3.fromRGB(184, 255, 173),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 1 weapon.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 1;
		},
	},
	{
		name: "Apprentice Wielder",
		id: 25,
		effect: Color3.fromRGB(128, 250, 107),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 2 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 2;
		},
	},
	{
		name: "Patient Wielder",
		id: 26,
		effect: Color3.fromRGB(51, 250, 20),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 5 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 5;
		},
	},
	{
		name: "Prestigious Wielder",
		id: 27,
		effect: Color3.fromRGB(28, 115, 13),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 10 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 10;
		},
	},
	{
		name: "Prideful Wielder",
		id: 28,
		effect: Color3.fromRGB(181, 255, 240),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 15 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 15;
		},
	},
	{
		name: "Legendary Wielder",
		id: 29,
		effect: Color3.fromRGB(5, 214, 217),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 20 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 20;
		},
	},
	{
		name: "Knightly Wielder",
		id: 30,
		effect: Color3.fromRGB(3, 97, 105),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 25 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 25;
		},
	},
	{
		name: "Primal Wielder",
		id: 31,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(28, 126, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(82, 255, 203)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(148, 255, 157)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(148, 255, 157)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(82, 255, 203)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(28, 126, 255)),
		]),
		category: TitleType.Weapons,
		description: "Reach max level (level 10) with 30 weapons.",
		condition: (state): boolean => {
			let maxLevels = 0;
			state.weapons.forEach((weaponData) => {
				if (weaponData.level === 10) {
					maxLevels += 1;
				}
			});

			return maxLevels >= 30;
		},
	},

	// Weapons (Total Bans)
	{
		name: "Novice Banner",
		id: 32,
		effect: Color3.fromRGB(79, 5, 166),
		category: TitleType.Weapons,
		description: "Ban 5,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 5_000;
		},
	},
	{
		name: "Avid Banner",
		id: 33,
		effect: Color3.fromRGB(158, 79, 245),
		category: TitleType.Weapons,
		description: "Ban 10,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 10_000;
		},
	},
	{
		name: "Prestigious Banner",
		id: 34,
		effect: Color3.fromRGB(176, 23, 214),
		category: TitleType.Weapons,
		description: "Ban 25,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 25_000;
		},
	},
	{
		name: "Prideful Banner",
		id: 35,
		effect: Color3.fromRGB(242, 102, 184),
		category: TitleType.Weapons,
		description: "Ban 50,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 50_000;
		},
	},
	{
		name: "Knightly Banner",
		id: 36,
		effect: Color3.fromRGB(28, 33, 207),
		category: TitleType.Weapons,
		description: "Ban 75,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 75_000;
		},
	},
	{
		name: "Notorious Banner",
		id: 37,
		effect: Color3.fromRGB(33, 153, 204),
		category: TitleType.Weapons,
		description: "Ban 100,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 100_000;
		},
	},
	{
		name: "Eternal Banner",
		id: 38,
		effect: Color3.fromRGB(33, 214, 112),
		category: TitleType.Weapons,
		description: "Ban 250,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 250_000;
		},
	},
	{
		name: "Wrathful Banner",
		id: 39,
		effect: Color3.fromRGB(242, 171, 18),
		category: TitleType.Weapons,
		description: "Ban 500,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 500_000;
		},
	},
	{
		name: "Cataclysmic Banner",
		id: 40,
		effect: Color3.fromRGB(176, 26, 10),
		category: TitleType.Weapons,
		description: "Ban 750,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 750_000;
		},
	},
	{
		name: "Demonic",
		id: 41,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 151, 161)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 159, 48)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 64, 0)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 64, 0)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 159, 48)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 151, 161)),
		]),
		category: TitleType.Weapons,
		description: "Ban 1,000,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 1_000_000;
		},
	},
	{
		name: "Star Caller",
		id: 42,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(0, 179, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(0, 255, 255)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(85, 255, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 244, 245)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(85, 255, 255)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(0, 255, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(0, 179, 255)),
		]),
		category: TitleType.Weapons,
		description: "Ban 2,500,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 2_500_000;
		},
	},
	{
		name: "Soloist",
		id: 43,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 85, 127)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 156, 171)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 220, 223)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 240, 241)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 220, 223)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 156, 171)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 85, 127)),
		]),
		category: TitleType.Weapons,
		description: "Ban 5,000,000 NPCs.",
		condition: (state): boolean => {
			let bans = 0;
			state.weapons.forEach((weaponData) => {
				bans += weaponData.bans;
			});

			return bans >= 5_000_000;
		},
	},

	// Misc titles
	{
		name: "Official Fan",
		id: 44,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(85, 255, 127)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(85, 255, 0)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(85, 170, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(85, 170, 255)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(85, 170, 255)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(85, 255, 0)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(85, 255, 127)),
		]),
		category: TitleType.Misc,
		description: "Players who've met an Interbyte developer.",
		condition: (state): boolean => state.index.hasMetDeveloper,
	},
	{
		name: "Interbyte Club",
		id: 45,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(32, 43, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(70, 141, 255)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 96, 253)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 0, 127)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 96, 253)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(70, 141, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(32, 43, 255)),
		]),
		category: TitleType.Misc,
		description: "Members who are apart of the Interbyte Club.",
		condition: (state): boolean => state.index.groupRank !== undefined && state.index.groupRank >= 246,
	},
	{
		name: "VIP",
		id: 46,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 126, 61)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 111, 222)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(244, 79, 255)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 111, 222)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
		]),
		category: TitleType.Misc,
		description: "Purchase the VIP gamepass.",
		condition: (state): boolean => state.gamepasses.VIP,
	},
	{
		name: "Contributor",
		id: 47,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(28, 126, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(82, 255, 203)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(148, 255, 157)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 244, 245)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(148, 255, 157)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(82, 255, 203)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(28, 126, 255)),
		]),
		category: TitleType.Misc,
		description: "Contributors to Interbyte Studios.",
		condition: (state): boolean => state.index.groupRank !== undefined && state.index.groupRank >= 248,
	},
	{
		name: "Verified",
		id: 48,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 85, 127)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 152, 154)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 245, 96)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 208, 38)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 245, 96)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 152, 154)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 85, 127)),
		]),
		category: TitleType.Misc,
		description: "Content Creators who've partnered with Interbyte Studios.",
		condition: (state): boolean => state.index.groupRank !== undefined && state.index.groupRank >= 249,
	},
	{
		name: "Staff Team",
		id: 49,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(0, 85, 255)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(12, 182, 255)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(120, 255, 206)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(192, 255, 207)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(120, 255, 206)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(12, 182, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(0, 85, 255)),
		]),
		category: TitleType.Misc,
		description: "Interbyte Studios staff team members.",
		condition: (state): boolean => state.index.groupRank !== undefined && state.index.groupRank >= 250,
	},
	{
		name: "Admin",
		id: 50,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(132, 0, 2)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(0, 0, 0)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(0, 0, 0)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(0, 0, 0)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(132, 0, 2)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
		]),
		category: TitleType.Misc,
		description: "Administrators of Interbyte Studios.",
		condition: (state): boolean => state.index.groupRank !== undefined && state.index.groupRank >= 253,
	},

	// Time Trials
	{
		name: "GearWorx Initiate",
		id: 51,
		effect: Color3.fromRGB(0, 255, 0),
		category: TitleType.Trials,
		description: "Reach wave 10 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 10,
	},
	{
		name: "GearWorx Gladiator",
		id: 52,
		effect: Color3.fromRGB(137, 238, 82),
		category: TitleType.Trials,
		description: "Reach wave 20 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 20,
	},
	{
		name: "GearWorx Knight",
		id: 53,
		effect: Color3.fromRGB(238, 233, 98),
		category: TitleType.Trials,
		description: "Reach wave 30 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 30,
	},
	{
		name: "GearWorx Paladin",
		id: 54,
		effect: Color3.fromRGB(255, 179, 47),
		category: TitleType.Trials,
		description: "Reach wave 40 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 40,
	},
	{
		name: "GearWorx Vanguard",
		id: 55,
		effect: Color3.fromRGB(255, 104, 28),
		category: TitleType.Trials,
		description: "Reach wave 50 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 50,
	},
	{
		name: "GearWorx Master",
		id: 56,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 43, 46)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(204, 0, 252)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(204, 0, 252)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(204, 0, 252)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 43, 46)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
		]),
		category: TitleType.Trials,
		description: "Reach wave 75 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 75,
	},
	{
		name: "GearWorx Paragon",
		id: 57,
		effect: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 115, 0)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 199, 43)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 64, 176)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 64, 176)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 64, 176)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 199, 43)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 115, 0)),
		]),
		category: TitleType.Trials,
		description: "Reach wave 100 on hard difficulty of GearWorx Time Trials.",
		condition: (state): boolean => state.timeTrials["Ban Land"].highestHardWave >= 100,
	},
] satisfies ReadonlyArray<Title>;
/* eslint-enable jsdoc/require-jsdoc */
export type ValidTitle = (typeof TITLES)[number]["name"];

/**
 * Checks if a given title is a valid title name.
 *
 * @param x The name of the title to validate.
 * @returns If the passed object was a valid tile.
 */
export function isValidTitle(x: unknown): x is ValidTitle {
	const data = TITLES.find((title) => title.name === x);
	return data !== undefined;
}
