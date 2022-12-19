import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setWalkSpeed } from "client/modules/settings/walkSpeed";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface WalkSpeedSettingMappedProps {
	currentTalisman: CurrentTalismanState;
	walkSpeed: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): WalkSpeedSettingMappedProps {
	return {
		currentTalisman: state.currentTalisman,
		walkSpeed: state.settings.gameplay.walkSpeed,
	};
}

/**
 * Roact imagebutton component to toggle the walk speed setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const WalkSpeedSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: WalkSpeedSettingMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleWalkSpeed } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.295)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Walk Speed"}
				displayValue={`${props.walkSpeed}`}
				displayPercentage={false}
				onIncrease={(): void => setWalkSpeed(props.walkSpeed + 1, props.currentTalisman, toggleWalkSpeed)}
				onDecrease={(): void => setWalkSpeed(props.walkSpeed - 1, props.currentTalisman, toggleWalkSpeed)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
