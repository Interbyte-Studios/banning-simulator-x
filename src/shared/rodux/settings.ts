import Rodux from "@rbxts/rodux";

export type ValidGraphicsQuality = "High" | "Low";
export type ValidUIColor = "Dark"; // will support more when ui is made.
export type ValidPetAnimationType = "Following" | "Surrounding";

export interface Settings {
	autoHatch: boolean;
	graphicsQuality: ValidGraphicsQuality;
	musicVolume: number;
	timeOfDay: number;
	uiColor: ValidUIColor;
	walkSpeed: number;
	pets: {
		animationType: ValidPetAnimationType;
		displayed: boolean;
		studsOfDistance: number;
	};
}

export type SettingsState = Settings;
export type SettingsActions =
	| ToggleAuto
	| ToggleGraphics
	| ToggleMusicVolume
	| ToggleTimeOfDay
	| ToggleUIColor
	| ToggleWalkSpeed
	| TogglePetAnimationType
	| TogglePetsDisplayed
	| TogglePetsStudsOfDistance;

interface ToggleAuto extends Rodux.Action<"toggleAuto"> {}

interface ToggleGraphics extends Rodux.Action<"toggleGraphics"> {
	quality: ValidGraphicsQuality;
}

interface ToggleMusicVolume extends Rodux.Action<"toggleMusicVolume"> {
	volume: number;
}

interface ToggleTimeOfDay extends Rodux.Action<"toggleTimeOfDay"> {
	time: number;
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
 * @param _time The time of day.
 * @returns The Rodux action to dispatch.
 */
export function toggleTimeOfDay(_time: number): ToggleTimeOfDay & Rodux.AnyAction {
	return {
		type: "toggleTimeOfDay",
		time: _time,
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
		animationType: animationType,
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
	autoHatch: false,
	graphicsQuality: "High",
	musicVolume: 10,
	timeOfDay: 12,
	uiColor: "Dark",
	walkSpeed: 16,
	pets: {
		animationType: "Surrounding",
		displayed: true,
		studsOfDistance: 10,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const settingsReducer = Rodux.createReducer<SettingsState, SettingsActions>(defaultSettings, {
	toggleAuto: (state) => {
		const newState: Settings = { ...state };
		newState.autoHatch = !newState.autoHatch;

		return newState;
	},
	toggleGraphics: (state, action) => {
		const newState: Settings = { ...state };
		newState.graphicsQuality = action.quality;

		return newState;
	},
	toggleMusicVolume: (state, action) => {
		const newState: Settings = { ...state };
		newState.musicVolume = action.volume;

		return newState;
	},
	toggleTimeOfDay: (state, action) => {
		const newState: Settings = { ...state };
		newState.timeOfDay = action.time;

		return newState;
	},
	toggleUIColor: (state, action) => {
		const newState: Settings = { ...state };
		newState.uiColor = action.color;

		return newState;
	},
	toggleWalkSpeed: (state, action) => {
		const newState: Settings = { ...state };
		newState.walkSpeed = action.walkSpeed;

		return newState;
	},
	togglePetAnimationType: (state, action) => {
		const newState: Settings = { ...state };
		newState.pets.animationType = action.animationType;

		return newState;
	},
	togglePetsDisplayed: (state, action) => {
		const newState: Settings = { ...state };
		newState.pets.displayed = action.displayed;

		return newState;
	},
	togglePetsStudsOfDistance: (state, action) => {
		const newState: Settings = { ...state };
		newState.pets.studsOfDistance = action.studs;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
