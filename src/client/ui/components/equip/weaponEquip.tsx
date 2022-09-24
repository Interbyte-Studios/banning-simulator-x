import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ReplicatedStorage } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { WeaponViewport } from "client/ui/elements/weaponViewport";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WeaponIndex } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { getItemById } from "shared/util/getItemById";

import { FakeWeaponEquip } from "./fakeWeaponEquip";

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
	hooks((props: WeaponEquipMappedProps) => {
		const weapon = getItemById(ReplicatedStorage.assetObjects.weapons, props.currentWeapon);
		assert(weapon, `Expected to find weapon with id: "${props.currentWeapon}"`);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.925)}
				Size={UDim2.fromScale(0.0615, 0.1)}
				Image={assetIds.images.ui.equip.background}
				ScaleType={Enum.ScaleType.Fit}
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
				<FakeWeaponEquip weaponName={weapon.Name as WeaponIndex} />
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
