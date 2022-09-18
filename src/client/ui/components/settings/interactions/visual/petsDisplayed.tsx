import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface PetsDisplayedSettingMappedProps {
	displayed: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetsDisplayedSettingMappedProps {
	return {
		displayed: state.settings.visual.petsDisplayed,
	};
}

/**
 * Roact imagebutton component to toggle the pet displayed setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PetsDisplayedSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetsDisplayedSettingMappedProps, hooks) => {
		const { useContext } = hooks;
		const { togglePetsDisplayed } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.42)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Pets Hidden"}
				isEnabled={!props.displayed}
				onClicked={(): void => togglePetsDisplayed.SendToServer(!props.displayed)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
