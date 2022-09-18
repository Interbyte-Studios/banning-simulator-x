import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setSoundEffects } from "client/modules/settings/soundEffects";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface generalSFXMappedProps {
	volume: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): generalSFXMappedProps {
	return {
		volume: state.settings.sound.soundEffects,
	};
}

/**
 * Roact imagebutton component to toggle the general SFX setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const GeneralSFXSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: generalSFXMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleSoundEffectsVolume } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.2)}
				size={UDim2.fromScale(0.95, 0.045)}
				settingName={"SFX Volume"}
				displayValue={`${props.volume * 10}%`}
				displayPercentage={true}
				onIncrease={(): void => setSoundEffects(props.volume + 1, toggleSoundEffectsVolume)}
				onDecrease={(): void => setSoundEffects(props.volume - 1, toggleSoundEffectsVolume)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
