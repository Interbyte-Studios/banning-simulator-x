type PlayerSpy = { player: Player; lastHatchTime: number };
type HatchSpyType = Array<PlayerSpy>;
const hatchSpy: HatchSpyType = [];

/**
 * @param player The player to check.
 * @param hasFastHatch Whether the player has fast hatch or not.
 * @returns Whether the player can hatch or not.
 */
export function canHatch(player: Player, hasFastHatch: boolean): boolean {
	const now = time();

	const playerSpy = hatchSpy.find((p) => p.player === player);
	if (playerSpy === undefined) {
		hatchSpy.push({
			player,
			lastHatchTime: now,
		});
		return true;
	} else {
		if (now - playerSpy.lastHatchTime < (hasFastHatch ? 1.8 : 2.8)) {
			return false;
		}

		playerSpy.lastHatchTime = now;
		return true;
	}
}
