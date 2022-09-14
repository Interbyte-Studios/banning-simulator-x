import Roact from "@rbxts/roact";
import { QuestDisplayer } from "client/ui/components/quests/questDisplayer";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory({}, target, () => (
		<QuestDisplayer
			quests={[
				{
					name: "First quest!!",
					experience: 500,
					progress: 5,
					completionProgress: 30,
					specialReward: {
						kind: "currency",
						amount: 300,
						currency: "coins",
					},
					hasPreviouslyClaimed: false,
				},
				{
					name: "Second quest",
					experience: 1000,
					progress: 0,
					completionProgress: 100,
					specialReward: {
						kind: "pet",
						guid: "abc123",
						id: 40,
						variant: "regular",
					},
					hasPreviouslyClaimed: false,
				},
				{
					name: "Third quest",
					experience: 5500,
					progress: 50,
					completionProgress: 50,
					specialReward: {
						kind: "title",
					},
					hasPreviouslyClaimed: false,
				},
				{
					name: "Fourth quest",
					experience: 5500,
					progress: 75,
					completionProgress: 75,
					specialReward: {
						kind: "currency",
						amount: 200,
						currency: "coins",
					},
					hasPreviouslyClaimed: true,
				},
			]}
			onQuestClaim={(quest): void => print(`Attempt to claim ${quest}`)}
			onClose={(): void => print("attempt to close")}
		/>
	));

	return () => {
		cleanup();
	};
};
