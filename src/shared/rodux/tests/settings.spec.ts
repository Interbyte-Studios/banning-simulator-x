/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import {
	settingsReducer,
	SettingsState,
	toggleAuto,
	toggleButtonClickSounds,
	toggleGraphics,
	toggleMasterVolume,
	toggleMusicVolume,
	togglePetAnimationType,
	togglePetsDisplayed,
	togglePetsStudsOfDistance,
	toggleSoundEffectsVolume,
	toggleTimeOfDay,
	toggleWalkSpeed,
} from "../settings";

const defaultSettings: SettingsState = {
	sound: {
		buttonClick: true,
		masterVolume: 5,
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

export = (): void => {
	describe("rodux/settings", () => {
		// sound tests
		it("should toggle button click sounds", () => {
			const state = defaultSettings;
			const enabled = false;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, buttonClick: enabled };

			const action = toggleButtonClickSounds(enabled);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should modify master volume", () => {
			const state = defaultSettings;
			const volume = 6;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, masterVolume: volume };

			const action = toggleMasterVolume(volume);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should modify music volume", () => {
			const state = defaultSettings;
			const volume = 9;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, music: volume };

			const action = toggleMusicVolume(volume);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should modify sound effects volume", () => {
			const state = defaultSettings;
			const volume = 9;

			const newState: SettingsState = { ...state };
			newState.sound = { ...newState.sound, soundEffects: volume };

			const action = toggleSoundEffectsVolume(volume);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		// gameplay tests
		it("should toggle auto hatch", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.gameplay = { ...newState.gameplay, autoHatch: !state.gameplay.autoHatch };

			const action = toggleAuto();
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should toggle walk speed", () => {
			const state = defaultSettings;
			const walkSpeed = 32;

			const newState: SettingsState = { ...state };
			newState.gameplay = { ...newState.gameplay, walkSpeed };

			const action = toggleWalkSpeed(walkSpeed);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		// visual tests
		it("should toggle graphics quality", () => {
			const state = defaultSettings;
			const graphicsQuality = "Low";

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, graphicsQuality };

			const action = toggleGraphics(graphicsQuality);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should toggle time of day", () => {
			const state = defaultSettings;
			const timeOfDay = 15;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, timeOfDay };

			const action = toggleTimeOfDay(timeOfDay);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should toggle pet animation type", () => {
			const state = defaultSettings;
			const petAnimationType = "Following";

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petAnimationType };

			const action = togglePetAnimationType(petAnimationType);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should toggle whether or not pets are displayed", () => {
			const state = defaultSettings;
			const petsDisplayed = false;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petsDisplayed };

			const action = togglePetsDisplayed(petsDisplayed);
			assertDeepEqual(settingsReducer(state, action), newState);
		});

		it("should toggle the studs of distance between pets and player", () => {
			const state = defaultSettings;
			const petsStudsOfDistance = 20;

			const newState: SettingsState = { ...state };
			newState.visual = { ...newState.visual, petsStudsOfDistance };

			const action = togglePetsStudsOfDistance(petsStudsOfDistance);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
	});
};
