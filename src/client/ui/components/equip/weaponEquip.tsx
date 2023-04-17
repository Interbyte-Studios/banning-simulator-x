import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ReplicatedStorage } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { WeaponViewport } from "client/ui/elements/viewports/weaponViewport";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WeaponIndex } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";

import { FakeWeaponEquip } from "./fakeWeaponEquip";

interface WeaponEquipProps extends WeaponEquipMappedProps {
	visible: boolean;
}

interface WeaponEquipMappedProps {
	weaponId: number;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponEquipMappedProps {
	return {
		weaponId: state.currentWeapon.id,
	};
}

/**
 * A roact component that displays the currently equipped weapon, and whether the player has it active or not.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const WeaponEquip = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponEquipProps) => {
		if (!props.visible) {
			return <></>;
		}

		const weapon = getItemById(ReplicatedStorage.assetObjects.weapons, props.weaponId);
		assert(weapon, `Expected to find weapon with id: "${props.weaponId}"`);

		return (
			<ImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.925),
					Size: UDim2.fromScale(0.0615, 0.1),
					Image: assetIds.images.ui.equip.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<WeaponViewport weaponId={props.weaponId} />
				<FakeWeaponEquip weaponName={weapon.Name as WeaponIndex} />
			</ImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
