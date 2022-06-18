import { WorldName, WORLDS } from "shared/configs/worlds";

/**
 * Checks to see if a given `value` is a valid world.
 *
 * @param value The item to validate.
 * @returns If the item is a valid key of the {@link WORLDS}.
 */
export function isValidWorld(value: unknown): value is WorldName {
	return WORLDS[value as WorldName] !== undefined;
}
