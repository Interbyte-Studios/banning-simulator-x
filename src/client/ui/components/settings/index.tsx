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
	return state.settings
}

export const SettingsUI = RoactRodux.connect(mapStateToProps)(
	hooks(({ useState, useContext, useEffect }) => {
		return <></>;
	}),
);
