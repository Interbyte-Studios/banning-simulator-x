import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface EpicRarityAutoDeleteMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): EpicRarityAutoDeleteMappedProps {
	return {
		enabled: state.settings.autoDelete.rarities.Epic,
	};
}

/**
 * Roact imagebutton component to toggle the Epic rarity auto delete setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EpicRarityAutoDeleteSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: EpicRarityAutoDeleteMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleAutoDelete } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.785)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Epic Rarity"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleAutoDelete.SendToServer("Epic")}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
