import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";
import { ValidPetAnimationType } from "shared/rodux/settings";

import { ModifySettingOption } from "../../elements/modifySettingOption";

interface PetAnimationMappedProps {
	animation: ValidPetAnimationType;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetAnimationMappedProps {
	return {
		animation: state.settings.visual.petAnimationType,
	};
}

/**
 * Roact imagebutton component to toggle the pet animation setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PetAnimationSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetAnimationMappedProps, hooks) => {
		const { useContext } = hooks;
		const { togglePetAnimationType } = useContext(remoteContext);

		return (
			<ModifySettingOption
				position={UDim2.fromScale(0.5, 0.595)}
				size={UDim2.fromScale(0.95, 0.045)}
				settingName={"Pet Animation"}
				displayValue={props.animation === "Following" ? "1" : "2"}
				displayPercentage={false}
				onIncrease={(): void =>
					togglePetAnimationType.SendToServer(props.animation === "Following" ? "Surrounding" : "Following")
				}
				onDecrease={(): void =>
					togglePetAnimationType.SendToServer(props.animation === "Surrounding" ? "Following" : "Surrounding")
				}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
