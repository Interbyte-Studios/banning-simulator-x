import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface BasicRarityAutoDeleteMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): BasicRarityAutoDeleteMappedProps {
	return {
		enabled: state.settings.autoDelete.rarities.Basic,
	};
}

/**
 * Roact imagebutton component to toggle the basic rarity auto delete setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const BasicRarityAutoDeleteSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: BasicRarityAutoDeleteMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleAutoDelete } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.65)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Basic Rarity"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleAutoDelete.SendToServer("Basic")}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
