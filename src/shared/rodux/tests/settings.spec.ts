/// <reference types="@rbxts/testez/globals" />

import {
	settingsReducer,
	SettingsState,
	toggleAuto,
	toggleButtonClickSounds,
	toggleGraphics,
	toggleMusicVolume,
	togglePetAnimationType,
	togglePetsDisplayed,
	togglePetsStudsOfDistance,
	toggleSoundEffectsVolume,
	toggleTimeOfDay,
	toggleWalkSpeed,
} from "../settings";
import { testAction } from "./testAction";

const defaultSettings: SettingsState = {
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
	privacy: {
		publicInventory: true,
		publicTradeHistory: true,
		tradesEnabled: true,
	},
};

export = (): void => {
	describe("rodux/settings", () => {
		// sound tests
		it("should toggle button click sounds", () => {
			const state = defaultSettings;
			const enabled = false;

			const newState = { ...state };
			newState.sound = { ...newState.sound, buttonClick: enabled };

			const action = toggleButtonClickSounds(enabled);
			testAction(state, newState, settingsReducer, action);
		});

		it("should modify music volume", () => {
			const state = defaultSettings;
			const volume = 9;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, music: volume };

			const action = toggleMusicVolume(volume);
			testAction(state, newState, settingsReducer, action);
		});

		it("should modify sound effects volume", () => {
			const state = defaultSettings;
			const volume = 9;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, soundEffects: volume };

			const action = toggleSoundEffectsVolume(volume);
			testAction(state, newState, settingsReducer, action);
		});

		// gameplay tests
		it("should toggle auto hatch", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.gameplay = { ...newState.gameplay, autoHatch: !state.gameplay.autoHatch };

			const action = toggleAuto();
			testAction(state, newState, settingsReducer, action);
		});

		it("should toggle walk speed", () => {
			const state = defaultSettings;
			const walkSpeed = 32;

			const newState: SettingsState = { ...state };
			newState.gameplay = { ...newState.gameplay, walkSpeed };

			const action = toggleWalkSpeed(walkSpeed);
			testAction(state, newState, settingsReducer, action);
		});

		// visual tests
		it("should toggle graphics quality", () => {
			const state = defaultSettings;
			const graphicsQuality = "Low";

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, graphicsQuality };

			const action = toggleGraphics(graphicsQuality);
			testAction(state, newState, settingsReducer, action);
		});

		it("should toggle time of day", () => {
			const state = defaultSettings;
			const timeOfDay = 15;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, timeOfDay };

			const action = toggleTimeOfDay(timeOfDay);
			testAction(state, newState, settingsReducer, action);
		});

		it("should toggle pet animation type", () => {
			const state = defaultSettings;
			const petAnimationType = "Following";

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petAnimationType };

			const action = togglePetAnimationType(petAnimationType);
			testAction(state, newState, settingsReducer, action);
		});

		it("should toggle whether or not pets are displayed", () => {
			const state = defaultSettings;
			const petsDisplayed = false;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petsDisplayed };

			const action = togglePetsDisplayed(petsDisplayed);
			testAction(state, newState, settingsReducer, action);
		});

		it("should toggle the studs of distance between pets and player", () => {
			const state = defaultSettings;
			const petsStudsOfDistance = 20;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petsStudsOfDistance };

			const action = togglePetsStudsOfDistance(petsStudsOfDistance);
			testAction(state, newState, settingsReducer, action);
		});
	});
};
