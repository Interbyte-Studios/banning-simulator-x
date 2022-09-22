import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ReplicatedStorage } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { WeaponViewport } from "client/ui/elements/weaponViewport";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WeaponIndex } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { getItemById } from "shared/util/getItemById";

interface WeaponEquipMappedProps {
	currentWeapon: CurrentWeaponState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponEquipMappedProps {
	return {
		currentWeapon: state.currentWeapon,
	};
}

/**
 * A roact component that displays the currently equipped weapon, and whether the player has it active or not.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const WeaponEquip = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponEquipMappedProps, hooks) => {
		const weapon = getItemById(ReplicatedStorage.assetObjects.weapons, props.currentWeapon);
		assert(weapon, `Expected to find weapon with id: "${props.currentWeapon}"`);

		const maximizedSize = 0.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.09;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.0615, value);
				})}
				Image={assetIds.images.ui.equip.background}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<WeaponViewport
					native={{
						AnchorPoint: vec2Middle,
						BackgroundTransparency: 1,
						Position: UDim2.fromScale(0.5, 0.5),
						Size: UDim2.fromScale(0.9, 0.9),
					}}
					weaponName={weapon.Name as WeaponIndex}
				/>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
