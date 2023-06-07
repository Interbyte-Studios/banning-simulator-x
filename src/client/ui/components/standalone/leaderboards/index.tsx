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
export const Leaderboards = hooks((_, { useMemo }) => {
	const banLeaderboards: Array<BasePart> = useMemo(() => {
		const leaderboards: Array<BasePart> = [];

		Workspace.interactions.leaderboards.bans.GetChildren().forEach((leaderboard) => {
			const basePart = leaderboard.FindFirstChild("board") as BasePart;
			if (basePart === undefined) {
				return;
			}

			leaderboards.push(basePart);
		});

		return leaderboards;
	});

	const eggLeaderboards: Array<BasePart> = useMemo(() => {
		const leaderboards: Array<BasePart> = [];

		Workspace.interactions.leaderboards.eggs.GetChildren().forEach((leaderboard) => {
			const basePart = leaderboard.FindFirstChild("board") as BasePart;
			if (basePart === undefined) {
				return;
			}

			leaderboards.push(basePart);
		});

		return leaderboards;
	});

	const banLeaderboardComponents: Array<Roact.Element> = useMemo(() => {
		const components: Array<Roact.Element> = [];

		banLeaderboards.forEach((basePart) => {
			components.push(<BanLeaderboard adornee={basePart} />);
		});

		return components;
	});

	const eggLeaderboardComponents: Array<Roact.Element> = useMemo(() => {
		const components: Array<Roact.Element> = [];

		eggLeaderboards.forEach((basePart) => {
			components.push(<EggLeaderboard adornee={basePart} />);
		});

		return components;
	});

	return (
		<>
			{banLeaderboardComponents}
			{eggLeaderboardComponents}
		</>
	);
});
