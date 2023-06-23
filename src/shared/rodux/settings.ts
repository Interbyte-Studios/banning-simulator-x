import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { Rarities } from "shared/configs/rarities";

export const isValidGraphicsQuality = t.literal("High", "Low");
export type ValidGraphicsQuality = t.static<typeof isValidGraphicsQuality>;

export const isValidPetAnimationType = t.literal("Following", "Surrounding");
export type ValidPetAnimationType = t.static<typeof isValidPetAnimationType>;

export const isValidVolume = t.numberConstrained(0, 10);
export const isValidWalkSpeed = t.numberMin(16);
export const isValidTimeOfDay = t.numberConstrained(0, 24);
export const isValidPetDistance = t.numberConstrained(10, 20);

export const isImmuneRarity = t.literal("Legendary", "Prismatic", "Primordial");
export type ImmuneRarities = t.static<typeof isImmuneRarity>;

export interface Settings {
	autoDelete: {
		rarities: {
			Basic: boolean;
			Ordinary: boolean;
			Rare: boolean;
			Epic: boolean;
		};
		easyLegendaries: boolean;
	};
	sound: {
		buttonClick: boolean;
		music: number;
		soundEffects: number;
	};
	gameplay: {
		autoHatch: boolean;
		walkSpeed: number;
	};
	visual: {
		graphicsQuality: ValidGraphicsQuality;
		timeOfDay: number;
		petAnimationType: ValidPetAnimationType;
		petsDisplayed: boolean;
		petsStudsOfDistance: number;
	};
	privacy: {
		publicInventory: boolean;
		publicTradeHistory: boolean;
		tradesEnabled: boolean;
	};
}

export type SettingsState = Settings;
export type SettingsActions =
	| ToggleRarityDelete
	| ToggleEasyLegendariesDelete
	| ToggleButtonClickSounds
	| ToggleMusicVolume
	| ToggleSoundEffectsVolume
	| ToggleAuto
	| ToggleGraphics
	| ToggleTimeOfDay
	| ToggleWalkSpeed
	| TogglePetAnimationType
	| TogglePetsDisplayed
	| TogglePetsStudsOfDistance
	| TogglePublicInventory
	| TogglePublicTradeHistory
	| ToggleTradesEnabled;

export interface ToggleRarityDelete extends Rodux.Action<"toggleRarityDelete"> {
	rarity: Exclude<Rarities, ImmuneRarities>;
}

export interface ToggleEasyLegendariesDelete extends Rodux.Action<"toggleEasyLegendariesDelete"> {}

interface ToggleButtonClickSounds extends Rodux.Action<"toggleButtonClickSounds"> {
	enabled: boolean;
}

interface ToggleMusicVolume extends Rodux.Action<"toggleMusicVolume"> {
	volume: number;
}

interface ToggleSoundEffectsVolume extends Rodux.Action<"toggleSoundEffectsVolume"> {
	volume: number;
}

interface ToggleAuto extends Rodux.Action<"toggleAuto"> {}

interface ToggleGraphics extends Rodux.Action<"toggleGraphics"> {
	quality: ValidGraphicsQuality;
}

interface ToggleTimeOfDay extends Rodux.Action<"toggleTimeOfDay"> {
	timeOfDay: number;
}

interface ToggleWalkSpeed extends Rodux.Action<"toggleWalkSpeed"> {
	walkSpeed: number;
}

interface TogglePetAnimationType extends Rodux.Action<"togglePetAnimationType"> {
	animationType: ValidPetAnimationType;
}

interface TogglePetsDisplayed extends Rodux.Action<"togglePetsDisplayed"> {
	displayed: boolean;
}

interface TogglePetsStudsOfDistance extends Rodux.Action<"togglePetsStudsOfDistance"> {
	studs: number;
}

interface TogglePublicInventory extends Rodux.Action<"togglePublicInventory"> {}
interface TogglePublicTradeHistory extends Rodux.Action<"togglePublicTradeHistory"> {}
interface ToggleTradesEnabled extends Rodux.Action<"toggleTradesEnabled"> {}

/**
 * Toggles the auto delete status of a specified rarity.
 *
 * @param rarity The rarity to toggle the delete status of.
 * @returns The Rodux action to dispatch.
 */
export function toggleRarityDelete(rarity: Exclude<Rarities, ImmuneRarities>): ToggleRarityDelete & Rodux.AnyAction {
	return {
		type: "toggleRarityDelete",
		rarity,
	};
}

/**
 * Toggles the auto delete status of easy legendaries.
 *
 * @returns The Rodux action to dispatch.
 */
export function toggleEasyLegendariesDelete(): ToggleEasyLegendariesDelete & Rodux.AnyAction {
	return {
		type: "toggleEasyLegendariesDelete",
	};
}

/**
 * @param enabled Whether button click sounds are enabled are not.
 * @returns The Rodux action to dispatch.
 */
export function toggleButtonClickSounds(enabled: boolean): ToggleButtonClickSounds & Rodux.AnyAction {
	return {
		type: "toggleButtonClickSounds",
		enabled,
	};
}

/**
 * @param volume The volume of the music.
 * @returns The Rodux action to dispatch.
 */
export function toggleMusicVolume(volume: number): ToggleMusicVolume & Rodux.AnyAction {
	return {
		type: "toggleMusicVolume",
		volume,
	};
}

/**
 * @param volume The volume of the sound effects..
 * @returns The Rodux action to dispatch.
 */
export function toggleSoundEffectsVolume(volume: number): ToggleSoundEffectsVolume & Rodux.AnyAction {
	return {
		type: "toggleSoundEffectsVolume",
		volume,
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function toggleAuto(): ToggleAuto & Rodux.AnyAction {
	return {
		type: "toggleAuto",
	};
}

/**
 * @param quality The quality of graphics.
 * @returns The Rodux action to dispatch.
 */
export function toggleGraphics(quality: ValidGraphicsQuality): ToggleGraphics & Rodux.AnyAction {
	return {
		type: "toggleGraphics",
		quality,
	};
}

/**
 * @param timeOfDay The time of day.
 * @returns The Rodux action to dispatch.
 */
export function toggleTimeOfDay(timeOfDay: number): ToggleTimeOfDay & Rodux.AnyAction {
	return {
		type: "toggleTimeOfDay",
		timeOfDay,
	};
}

/**
 * @param walkSpeed The WalkSpeed of the player.
 * @returns The Rodux action to dispatch.
 */
export function toggleWalkSpeed(walkSpeed: number): ToggleWalkSpeed & Rodux.AnyAction {
	return {
		type: "toggleWalkSpeed",
		walkSpeed,
	};
}

/**
 * @param animationType The type of pet animation.
 * @returns The Rodux action to dispatch.
 */
export function togglePetAnimationType(animationType: ValidPetAnimationType): TogglePetAnimationType & Rodux.AnyAction {
	return {
		type: "togglePetAnimationType",
		animationType,
	};
}

/**
 * @param displayed Whether or not pets are displayed.
 * @returns The Rodux action to dispatch.
 */
export function togglePetsDisplayed(displayed: boolean): TogglePetsDisplayed & Rodux.AnyAction {
	return {
		type: "togglePetsDisplayed",
		displayed,
	};
}

/**
 * @param studs The amount of studs.
 * @returns The Rodux action to dispatch.
 */
export function togglePetsStudsOfDistance(studs: number): TogglePetsStudsOfDistance & Rodux.AnyAction {
	return {
		type: "togglePetsStudsOfDistance",
		studs,
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function togglePublicInventory(): TogglePublicInventory & Rodux.AnyAction {
	return {
		type: "togglePublicInventory",
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function togglePublicTradeHistory(): TogglePublicTradeHistory & Rodux.AnyAction {
	return {
		type: "togglePublicTradeHistory",
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function toggleTradesEnabled(): ToggleTradesEnabled & Rodux.AnyAction {
	return {
		type: "toggleTradesEnabled",
	};
}

export const defaultSettings: Settings = {
	autoDelete: {
		rarities: {
			Basic: false,
			Ordinary: false,
			Rare: false,
			Epic: false,
		},
		easyLegendaries: false,
	},
	sound: {
		buttonClick: true,
		music: 7,
		soundEffects: 10,
	},
	gameplay: {
		autoHatch: false,
		walkSpeed: 24,
	},
	visual: {
		graphicsQuality: "High",
		timeOfDay: 14,
		petAnimationType: "Surrounding",
		petsDisplayed: true,
		petsStudsOfDistance: 10,
	},
	privacy: {
		publicInventory: true,
		publicTradeHistory: true,
		tradesEnabled: true,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const settingsReducer = Rodux.createReducer<SettingsState, SettingsActions>(defaultSettings, {
	toggleEasyLegendariesDelete: (state) => {
		return {
			...state,
			easyLegendaries: !state.autoDelete.easyLegendaries,
		};
	},
	toggleRarityDelete: (state, action) => {
		return {
			...state,
			autoDelete: {
				...state.autoDelete,
				rarities: {
					...state.autoDelete.rarities,
					[action.rarity]: !state.autoDelete.rarities[action.rarity],
				},
			},
		};
	},
	toggleButtonClickSounds: (state, action) => {
		return {
			...state,
			sound: {
				...state.sound,
				buttonClick: action.enabled,
			},
		};
	},
	toggleMusicVolume: (state, action) => {
		return {
			...state,
			sound: {
				...state.sound,
				music: action.volume,
			},
		};
	},
	toggleSoundEffectsVolume: (state, action) => {
		return {
			...state,
			sound: {
				...state.sound,
				soundEffects: action.volume,
			},
		};
	},
	toggleAuto: (state) => {
		return {
			...state,
			gameplay: {
				...state.gameplay,
				autoHatch: !state.gameplay.autoHatch,
			},
		};
	},
	toggleWalkSpeed: (state, action) => {
		return {
			...state,
			gameplay: {
				...state.gameplay,
				walkSpeed: action.walkSpeed,
			},
		};
	},
	toggleGraphics: (state, action) => {
		return {
			...state,
			visual: {
				...state.visual,
				graphicsQuality: action.quality,
			},
		};
	},
	toggleTimeOfDay: (state, action) => {
		return {
			...state,
			visual: {
				...state.visual,
				timeOfDay: action.timeOfDay,
			},
		};
	},
	togglePetAnimationType: (state, action) => {
		return {
			...state,
			visual: {
				...state.visual,
				petAnimationType: action.animationType,
			},
		};
	},
	togglePetsDisplayed: (state, action) => {
		return {
			...state,
			visual: {
				...state.visual,
				petsDisplayed: action.displayed,
			},
		};
	},
	togglePetsStudsOfDistance: (state, action) => {
		return {
			...state,
			visual: {
				...state.visual,
				petsStudsOfDistance: action.studs,
			},
		};
	},
	togglePublicInventory: (state) => {
		return {
			...state,
			privacy: {
				...state.privacy,
				publicInventory: !state.privacy.publicInventory,
			},
		};
	},
	togglePublicTradeHistory: (state) => {
		return {
			...state,
			privacy: {
				...state.privacy,
				publicTradeHistory: !state.privacy.publicTradeHistory,
			},
		};
	},
	toggleTradesEnabled: (state) => {
		return {
			...state,
			privacy: {
				...state.privacy,
				tradesEnabled: !state.privacy.tradesEnabled,
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
