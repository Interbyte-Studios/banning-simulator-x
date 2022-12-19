import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface AutoHatchMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): AutoHatchMappedProps {
	return {
		enabled: state.settings.gameplay.autoHatch,
	};
}

/**
 * Roact imagebutton component to toggle the auto hatch setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const AutoHatchSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: AutoHatchMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleAuto } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.25)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Auto Hatch"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleAuto.SendToServer()}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
