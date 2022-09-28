import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setTimeOfDay } from "client/modules/settings/timeOfDay";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface TimeOfDayMappedProps {
	timeOfDay: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TimeOfDayMappedProps {
	return {
		timeOfDay: state.settings.visual.timeOfDay,
	};
}

/**
 * Roact imagebutton component to toggle the time of day setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const TimeOfDaySetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: TimeOfDayMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleTimeOfDay } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.555)}
				size={UDim2.fromScale(0.95, 0.04)}
				settingName={"Time of Day"}
				displayValue={`${props.timeOfDay}`}
				displayPercentage={false}
				onIncrease={(): void => setTimeOfDay(props.timeOfDay + 1, toggleTimeOfDay)}
				onDecrease={(): void => setTimeOfDay(props.timeOfDay - 1, toggleTimeOfDay)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
