import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";

import { BanLeaderboard } from "./bansLeaderboards";
import { EggLeaderboard } from "./eggsLeaderboards";

/**
 * A component that displays global leaderboard data.
 *
 * @returns A Roact element.
 */
export const Leaderboards = hooks(() => {
	const banLeaderboards: Array<BasePart> = [];
	Workspace.interactions.leaderboards.bans.GetChildren().forEach((leaderboard) => {
		const basePart = leaderboard.FindFirstChild("board") as BasePart;
		if (basePart === undefined) {
			return;
		}

		banLeaderboards.push(basePart);
	});

	const eggLeaderboards: Array<BasePart> = [];
	Workspace.interactions.leaderboards.eggs.GetChildren().forEach((leaderboard) => {
		const basePart = leaderboard.FindFirstChild("board") as BasePart;
		if (basePart === undefined) {
			return;
		}

		eggLeaderboards.push(basePart);
	});

	const banBoardComponents: Array<Roact.Element> = [];
	banLeaderboards.forEach((basePart) => {
		banBoardComponents.push(<BanLeaderboard adornee={basePart} />);
	});

	const eggBoardComponents: Array<Roact.Element> = [];
	eggLeaderboards.forEach((basePart) => {
		eggBoardComponents.push(<EggLeaderboard adornee={basePart} />);
	});

	return (
		<>
			{banBoardComponents}
			{eggBoardComponents}
		</>
	);
});
