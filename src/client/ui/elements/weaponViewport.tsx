import Roact from "@rbxts/roact";
import { getWeaponDecal } from "client/util/getWeaponDecal";

import { vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface WeaponViewportProps {
	weaponId: number;
}

/**
 * A viewport of a weapon.
 *
 * @param props The properties of the weapon viewport.
 * @param props.native The native properties of the viewport frame.
 * @param props.weaponId The id of the weapon being displayed.
 */
export const WeaponViewport = hooks((props: WeaponViewportProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.75, 0.75)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={getWeaponDecal(props.weaponId)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
});
