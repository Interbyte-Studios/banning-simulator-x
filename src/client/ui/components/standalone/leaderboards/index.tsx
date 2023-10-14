import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { findFirstChildByNameWhichIsA } from "shared/util/findFirstChildByNameWhichIsA";

import { BanLeaderboard } from "./bansLeaderboards";
import { EggLeaderboard } from "./eggsLeaderboards";
import { RebirthLeaderboard } from "./rebirthLeaderboards";

/**
 * A component that displays global leaderboard data.
 *
 * @returns A Roact element.
 */
export const Leaderboards = hooks((_, { useState, useEffect }) => {
	const [banBoards, setBanBoards] = useState<Array<BasePart>>([]);
	const [eggBoards, setEggBoards] = useState<Array<BasePart>>([]);
	const [rebirthBoards, setRebirthBoards] = useState<Array<BasePart>>([]);

	useEffect(() => {
		const banLeaderboards: Array<BasePart> = [];
		Workspace.interactions.leaderboards.bans.GetChildren().forEach((leaderboard) => {
			const basePart = findFirstChildByNameWhichIsA(leaderboard, "board", "BasePart");
			if (basePart === undefined) {
				return;
			}

			banLeaderboards.push(basePart);
		});

		const eggLeaderboards: Array<BasePart> = [];
		Workspace.interactions.leaderboards.eggs.GetChildren().forEach((leaderboard) => {
			const basePart = findFirstChildByNameWhichIsA(leaderboard, "board", "BasePart");
			if (basePart === undefined) {
				return;
			}

			eggLeaderboards.push(basePart);
		});

		const rebirthLeaderboards: Array<BasePart> = [];
		Workspace.interactions.leaderboards.rebirths.GetChildren().forEach((leaderboard) => {
			const basePart = findFirstChildByNameWhichIsA(leaderboard, "board", "BasePart");
			if (basePart === undefined) {
				return;
			}

			rebirthLeaderboards.push(basePart);
		});

		setBanBoards(banLeaderboards);
		setEggBoards(eggLeaderboards);
		setRebirthBoards(rebirthLeaderboards);
	}, []);

	const banBoardComponents = banBoards.map((basePart) => <BanLeaderboard adornee={basePart} />);
	const eggBoardComponents = eggBoards.map((basePart) => <EggLeaderboard adornee={basePart} />);
	const rebirthBoardComponents = rebirthBoards.map((basePart) => <RebirthLeaderboard adornee={basePart} />);

	return (
		<>
			{banBoardComponents}
			{eggBoardComponents}
			{rebirthBoardComponents}
		</>
	);
});
