import Rodux from "@rbxts/rodux";

export type ValidGraphicsQuality = "High" | "Low";
export type ValidUIColor = "Dark"; // will support more when ui is made.
export type ValidPetAnimationType = "Following" | "Surrounding";

export interface Settings {
	sound: {
		buttonClick: boolean;
		masterVolume: number;
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
		uiColor: ValidUIColor;
		petAnimationType: ValidPetAnimationType;
		petsDisplayed: boolean;
		petsStudsOfDistance: number;
	};
}

export type SettingsState = Settings;
export type SettingsActions =
	| ToggleButtonClickSounds
	| ToggleMasterVolume
	| ToggleMusicVolume
	| ToggleSoundEffectsVolume
	| ToggleAuto
	| ToggleGraphics
	| ToggleTimeOfDay
	| ToggleUIColor
	| ToggleWalkSpeed
	| TogglePetAnimationType
	| TogglePetsDisplayed
	| TogglePetsStudsOfDistance;

interface ToggleButtonClickSounds extends Rodux.Action<"toggleButtonClickSounds"> {
	enabled: boolean;
}

interface ToggleMasterVolume extends Rodux.Action<"toggleMasterVolume"> {
	volume: number;
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

interface ToggleUIColor extends Rodux.Action<"toggleUIColor"> {
	color: ValidUIColor;
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
 * @param volume The scaled volume of all sounds.
 * @returns The Rodux action to dispatch.
 */
export function toggleMasterVolume(volume: number): ToggleMasterVolume & Rodux.AnyAction {
	return {
		type: "toggleMasterVolume",
		volume,
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
 * @param color The color of the ui.
 * @returns The Rodux action to dispatch.
 */
export function toggleUIColor(color: ValidUIColor): ToggleUIColor & Rodux.AnyAction {
	return {
		type: "toggleUIColor",
		color,
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
	sound: {
		buttonClick: true,
		masterVolume: 7,
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
		uiColor: "Dark",
		petAnimationType: "Surrounding",
		petsDisplayed: true,
		petsStudsOfDistance: 10,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const settingsReducer = Rodux.createReducer<SettingsState, SettingsActions>(defaultSettings, {
	toggleButtonClickSounds: (state, action) => {
		const newState: Settings = { ...state };
		newState.sound = { ...state.sound, buttonClick: action.enabled };

		return newState;
	},
	toggleMasterVolume: (state, action) => {
		const newState: Settings = { ...state };
		newState.sound = { ...state.sound, masterVolume: action.volume };

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
	toggleUIColor: (state, action) => {
		const newState: Settings = { ...state };
		newState.visual = { ...state.visual, uiColor: action.color };

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
