import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface OrdinaryRarityAutoDeleteMappedProps {
	enabled: boolean;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): OrdinaryRarityAutoDeleteMappedProps {
	return {
		enabled: state.settings.autoDelete.rarities.Ordinary,
	};
}

/**
 * Roact imagebutton component to toggle the Ordinary rarity auto delete setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const OrdinaryRarityAutoDeleteSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: OrdinaryRarityAutoDeleteMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleAutoDelete } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.695)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Ordinary Rarity"}
				isEnabled={props.enabled}
				onClicked={(): void => toggleAutoDelete.SendToServer("Ordinary")}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
