import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, ReplicatedStorage } from "@rbxts/services";
import { toggleWeaponEquipped } from "client/weapons/weaponState";
import { StoreState } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";

import { color3White, vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface ToggleWeaponButtonProps extends ToggleWeaponButtonMappedProps {
	player: Player;
}
interface ToggleWeaponButtonMappedProps {
	currentWeaponId: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): ToggleWeaponButtonMappedProps {
	return {
		currentWeaponId: state.currentWeapon,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const ToggleWeaponButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: ToggleWeaponButtonProps, { useState, useEffect }) => {
		const [isEquipped, setIsEquipped] = useState(false);

		useEffect(() => {
			ContextActionService.BindAction(
				"weaponHandler",
				(_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					setIsEquipped(!isEquipped);
				},
				false,
				Enum.KeyCode.One,
			);

			return (): void => {
				ContextActionService.UnbindAction("weaponHandler");
			};
		}, [isEquipped]);

		useEffect(() => {
			toggleWeaponEquipped(props.player, props.currentWeaponId, isEquipped);
		}, [isEquipped]);

		return (
			<textbutton
				Size={UDim2.fromScale(0.1, 0.1)}
				SizeConstraint={Enum.SizeConstraint.RelativeYY}
				Position={UDim2.fromScale(0.5, 0.925)}
				AnchorPoint={vec2Middle}
				BackgroundColor3={isEquipped ? Color3.fromRGB(0, 150, 0) : Color3.fromRGB(150, 0, 0)}
				Text={isEquipped ? "Unequip" : "Equip"}
				TextColor3={color3White}
				TextScaled={true}
				Font={Enum.Font.Code}
				Event={{
					Activated: (): void => setIsEquipped(!isEquipped),
				}}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
