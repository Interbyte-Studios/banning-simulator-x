// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { getWeaponDecal } from "client/util/getWeaponDecal";

import { hooks } from "../../hooks";
import { ImageLabel } from "../baseElements/imagelabels/image";

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
	const weaponImage = getWeaponDecal(props.weaponId);

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.75, 0.75),
				Position: UDim2.fromScale(0.5, 0.5),
				Image: weaponImage,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</ImageLabel>
	);
});
