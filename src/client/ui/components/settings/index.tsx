import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): Settings {
	return {
		autoHatch: state.settings.autoHatch,
		graphicsQuality: state.settings.graphicsQuality,
		musicVolume: state.settings.musicVolume,
		timeOfDay: state.settings.timeOfDay,
		uiColor: state.settings.uiColor,
		walkSpeed: state.settings.walkSpeed,
		pets: {
			animationType: state.settings.pets.animationType,
			displayed: state.settings.pets.displayed,
			studsOfDistance: state.settings.pets.studsOfDistance,
		},
	};
}

export const SettingsUI = RoactRodux.connect(mapStateToProps)(
	hooks(({ useState, useContext, useEffect }) => {
		return <></>;
	}),
);
