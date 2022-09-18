import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setPetsStudsOfDistance } from "client/modules/settings/petStudsOfDistance";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface PetDistanceMappedProps {
	distance: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetDistanceMappedProps {
	return {
		distance: state.settings.visual.petsStudsOfDistance,
	};
}

/**
 * Roact imagebutton component to toggle the pet animation setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PetDistanceSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetDistanceMappedProps, hooks) => {
		const { useContext } = hooks;
		const { togglePetsStudsOfDistance } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.65)}
				size={UDim2.fromScale(0.95, 0.045)}
				settingName={"Pet Distance"}
				displayValue={`${props.distance}`}
				displayPercentage={false}
				onIncrease={(): void => setPetsStudsOfDistance(props.distance + 1, togglePetsStudsOfDistance)}
				onDecrease={(): void => setPetsStudsOfDistance(props.distance - 1, togglePetsStudsOfDistance)}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
