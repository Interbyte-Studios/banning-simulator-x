import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

interface SettingsMenuProps extends SettingsMenuMappedProps {
	isVisible: boolean;
	toggleVisibility: (visible: boolean) => void;
}

interface SettingsMenuMappedProps {
	settings: Settings;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): SettingsMenuMappedProps {
	return {
		settings: state.settings,
	};
}

export const SettingsMenu = RoactRodux.connect(mapStateToProps)(
	hooks((props: SettingsMenuProps, { useState, useEffect, useContext }) => {
		return <></>;
	}),
);
