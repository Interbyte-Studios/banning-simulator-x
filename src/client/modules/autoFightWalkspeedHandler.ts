debug.setmemorycategory("autoFightWalkspeedModule");
import { Players } from "@rbxts/services";

let autoFightEnabled = false;

/**
 * Toggles the auto fight.
 *
 * @param value The toggled value.
 * @param walkSpeed The walkspeed.
 */
export const toggleAutoFight = (value: boolean, walkSpeed: number): void => {
	autoFightEnabled = value;

	const character = Players.LocalPlayer.Character;
	if (character === undefined) {
		return;
	}

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	if (value) {
		humanoid.WalkSpeed = 24;
	} else {
		humanoid.WalkSpeed = walkSpeed;
	}
};

/**
 * @returns The state of auto fight.
 */
export const getAutoFightState = (): boolean => {
	return autoFightEnabled;
};
