import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, ReplicatedStorage } from "@rbxts/services";
import { toggleWeaponEquipped } from "client/weapons/weaponState";
import { StoreState } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";

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
export const Button = RoactRodux.connect(mapStateToProps)(
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

		const weaponName = getItemById(ReplicatedStorage.weapons, props.currentWeaponId)?.Name;

		return (
			<textbutton
				Size={UDim2.fromScale(0.25, 0.125)}
				Position={UDim2.fromScale(0.5, 0.8)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Text={(isEquipped ? "Unequip" : "Equip") + " " + weaponName}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={Enum.Font.Code}
				BackgroundColor3={isEquipped ? Color3.fromRGB(0, 150, 0) : Color3.fromRGB(150, 0, 0)}
				TextScaled={true}
				Event={{
					Activated: (): void => setIsEquipped(!isEquipped),
				}}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
