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

export type ImmuneRarities = "Legendary" | "Prismatic" | "Primordial";

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
	| TogglePetsStudsOfDistance;

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

const defaultSettings: Settings = {
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
		music: 10,
		soundEffects: 10,
	},
	gameplay: {
		autoHatch: false,
		walkSpeed: 16,
	},
	visual: {
		graphicsQuality: "High",
		timeOfDay: 14,
		petAnimationType: "Surrounding",
		petsDisplayed: true,
		petsStudsOfDistance: 10,
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
		const newState = { ...state };
		newState.autoDelete.rarities[action.rarity] = !state.autoDelete.rarities[action.rarity];

		return newState;
	},
	toggleButtonClickSounds: (state, action) => {
		const newState: Settings = { ...state };
		newState.sound = { ...state.sound, buttonClick: action.enabled };

		return newState;
	},
	toggleMusicVolume: (state, action) => {
		const newState: Settings = { ...state };
		newState.sound = { ...state.sound, music: action.volume };

		return newState;
	},
	toggleSoundEffectsVolume: (state, action) => {
		const newState: Settings = { ...state };
		newState.sound = { ...state.sound, soundEffects: action.volume };

		return newState;
	},
	toggleAuto: (state) => {
		const newState: Settings = { ...state };
		newState.gameplay = { ...state.gameplay, autoHatch: !state.gameplay.autoHatch };

		return newState;
	},
	toggleWalkSpeed: (state, action) => {
		const newState: Settings = { ...state };
		newState.gameplay = { ...state.gameplay, walkSpeed: action.walkSpeed };

		return newState;
	},
	toggleGraphics: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, graphicsQuality: action.quality };

		return newState;
	},
	toggleTimeOfDay: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, timeOfDay: action.timeOfDay };

		return newState;
	},
	togglePetAnimationType: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, petAnimationType: action.animationType };

		return newState;
	},
	togglePetsDisplayed: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, petsDisplayed: action.displayed };

		return newState;
	},
	togglePetsStudsOfDistance: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, petsStudsOfDistance: action.studs };

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
