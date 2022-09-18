import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface EasyLegendariesRarityAutoDeleteMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): EasyLegendariesRarityAutoDeleteMappedProps {
	return {
		enabled: state.settings.autoDelete.easyLegendaries,
	};
}

/**
 * Roact imagebutton component to toggle the easy legendary auto delete setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EasyLegendariesRarityAutoDeleteSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: EasyLegendariesRarityAutoDeleteMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleEasyLegendariesAutoDelete } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.82)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Easy Legendaries"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleEasyLegendariesAutoDelete.SendToServer()}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
