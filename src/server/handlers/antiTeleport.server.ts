import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players } from "@rbxts/services";

// Maximum allowed distance a player can move in one step
const MAX_DISTANCE = 50;

// Last known positions of each player
const lastPositions: Array<{ player: Player; position: Vector3 }> = [];

/**
 * @param player The player to check.
 * @returns Whether or not the player is teleporting.
 */
function isTeleporting(player: Player): boolean {
	const character = player.Character;
	if (character === undefined) {
		return false;
	}

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return false;
	}

	const root = humanoid.RootPart;
	if (root === undefined) {
		return false;
	}

	const currentPosition = root.Position;
	const lastPosition = lastPositions.find((lastPosition) => lastPosition.player === player);
	if (lastPosition === undefined) {
		lastPositions.push({
			player,
			position: currentPosition,
		});
		return false;
	}

	const distance = currentPosition.sub(lastPosition.position).Magnitude;
	const teleporting = distance > MAX_DISTANCE;
	return teleporting;
}

// eslint-disable-next-line no-constant-condition
while (true) {
	for (const player of Players.GetPlayers()) {
		const teleporting = isTeleporting(player);
		if (teleporting) {
			GameAnalytics.addErrorEvent(player.UserId, {
				severity: GameAnalytics.EGAErrorSeverity.warning,
				message: `Player ${player.Name} was kicked for teleporting.`,
			});
			player.Kick("You were kicked for exploiting.");
		}
	}
	task.wait(1);
}
