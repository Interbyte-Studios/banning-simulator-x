import { a } from "@rbxts/fitumi";

/**
 * Creates a mock Player object.
 *
 * @returns The mocked player.
 */
export function useMockPlayer(): Player {
	return a.fake<Player>();
}
