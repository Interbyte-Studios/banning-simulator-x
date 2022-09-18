import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface ToggleButtonSFXMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): ToggleButtonSFXMappedProps {
	return {
		enabled: state.settings.sound.buttonClick,
	};
}

/**
 * Roact imagebutton component to toggle the button SFX setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleButtonSFXSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleButtonSFXMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleButtonClickSFX } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.07)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Button Click SFX"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleButtonClickSFX.SendToServer(!props.enabled)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
