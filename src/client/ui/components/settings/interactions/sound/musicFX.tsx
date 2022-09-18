import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setMusicVolume } from "client/modules/settings/musicVolume";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface ToggleMusicFXMappedProps {
	volume: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): ToggleMusicFXMappedProps {
	return {
		volume: state.settings.sound.music,
	};
}

/**
 * Roact imagebutton component to toggle the music FX setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleMusicFXSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleMusicFXMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleMusicVolume } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.145)}
				size={UDim2.fromScale(0.95, 0.045)}
				settingName={"Music Volume"}
				displayValue={`${props.volume * 10}%`}
				displayPercentage={true}
				onIncrease={(): void => setMusicVolume(props.volume + 1, toggleMusicVolume)}
				onDecrease={(): void => setMusicVolume(props.volume - 1, toggleMusicVolume)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
