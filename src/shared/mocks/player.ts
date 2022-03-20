import { a } from "@rbxts/fitumi";

/**
 * Creates a mock Player object.
 *
 * @returns The mocked player.
 */
export function useMockPlayer(): Player {
	const player = a.fake<Player>();

	player.Character = undefined;

	return player;
}
