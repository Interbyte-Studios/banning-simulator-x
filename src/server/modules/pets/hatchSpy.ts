type PlayerSpy = { player: Player; lastHatchTime: number };
type HatchSpyType = Array<PlayerSpy>;
const hatchSpy: HatchSpyType = [];

/**
 * @param player The player to check.
 * @param hasFastHatchGP Whether the player has fast hatch or not (gamepass).
 * @param hasFastHatchRB Whether thep layer has fast hatch or not (rebirth).
 * @returns Whether the player can hatch or not.
 */
export function canHatch(player: Player, hasFastHatchGP: boolean, hasFastHatchRB: boolean): boolean {
	const now = time();

	const animationTime = 2.9;

	let fastHatchDiviser = 1;
	if (hasFastHatchGP) {
		fastHatchDiviser -= 0.3;
	}
	if (hasFastHatchRB) {
		fastHatchDiviser -= 0.3;
	}

	const playerSpy = hatchSpy.find((p) => p.player === player);
	if (playerSpy === undefined) {
		hatchSpy.push({
			player,
			lastHatchTime: now,
		});
		return true;
	} else {
		if (now - playerSpy.lastHatchTime < animationTime * fastHatchDiviser) {
			return false;
		}

		playerSpy.lastHatchTime = now;
		return true;
	}
}
