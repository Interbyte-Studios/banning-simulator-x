/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import {
	settingsReducer,
	SettingsState,
	toggleAuto,
	toggleGraphics,
	toggleMusicVolume,
	togglePetAnimationType,
	togglePetsDisplayed,
	togglePetsStudsOfDistance,
	toggleTimeOfDay,
	toggleWalkSpeed,
} from "../settings";

const defaultSettings: SettingsState = {
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

export = (): void => {
	describe("rodux/settings", () => {
		it("should toggle auto hatch", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.autoHatch = true;

			const action = toggleAuto();
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle graphics quality", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.graphicsQuality = "Low";

			const action = toggleGraphics("Low");
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle music volume", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.musicVolume = 10;

			const action = toggleMusicVolume(10);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle time of day", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.timeOfDay = 14;

			const action = toggleTimeOfDay(14);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle walk speed", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.walkSpeed = 32;

			const action = toggleWalkSpeed(32);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle pet animation type", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.pets.animationType = "Surrounding";

			const action = togglePetAnimationType("Surrounding");
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle whether or not pets are displayed", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.pets.displayed = !state.pets.displayed;

			const action = togglePetsDisplayed(!state.pets.displayed);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
		it("should toggle the studs of distance between pets and player", () => {
			const state = defaultSettings;

			const newState: SettingsState = { ...state };
			newState.pets.studsOfDistance = 20;

			const action = togglePetsStudsOfDistance(20);
			assertDeepEqual(settingsReducer(state, action), newState);
		});
	});
};
