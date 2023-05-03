import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";

import { BanLeaderboard } from "./bansLeaderboards";
import { EggLeaderboard } from "./eggsLeaderboards";

/**
 * A component that displays global leaderboard data.
 *
 * @returns A Roact element.
 */
export const Leaderboards = (): Roact.Element => {
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

	const banLeaderboardComponents: Array<Roact.Element> = [];
	banLeaderboards.forEach((basePart) => {
		banLeaderboardComponents.push(<BanLeaderboard adornee={basePart} />);
	});

	const eggLeaderboardComponents: Array<Roact.Element> = [];
	eggLeaderboards.forEach((basePart) => {
		eggLeaderboardComponents.push(<EggLeaderboard adornee={basePart} />);
	});

	return (
		<>
			{banLeaderboardComponents}
			{eggLeaderboardComponents}
		</>
	);
};
