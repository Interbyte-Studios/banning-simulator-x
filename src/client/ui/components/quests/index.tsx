import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
import { hooks } from "client/roact/hooks";
import { remoteContext } from "client/roact/mocks/remoteContext";
import { QUESTS } from "shared/configs/quests";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";

import { QuestDisplayer } from "./questDisplayer";
import { WorldSelector } from "./worldSelector";
import { ZoneSelector } from "./zoneSelector";

interface QuestProps {
	state: StoreState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): QuestProps {
	return {
		state,
	};
}

/**
 * Renders the quests UI.
 */
export const Quests = RoactRodux.connect(mapStateToProps)(
	hooks((props: QuestProps, { useState, useEffect, useContext }) => {
		const [isVisible, setVisible] = useState(false);
		const [world, setWorld] = useState<WorldName | undefined>(undefined);
		const [zone, setZone] = useState<ZoneNames | "none" | undefined>(undefined);
		const { redeemQuest } = useContext(remoteContext);

		useEffect(() => {
			ContextActionService.BindAction(
				"quests",
				(_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					setVisible(!isVisible);
				},
				false,
				Enum.KeyCode.Q,
			);

			return (): void => {
				ContextActionService.UnbindAction("quests");
			};
		}, [isVisible]);

		if (!isVisible) {
			return <></>;
		}

		if (world === undefined) {
			// display world selector
			return (
				<WorldSelector
					worlds={Object.keys(WORLDS)}
					onWorldSelected={setWorld}
					onClose={(): void => setVisible(false)}
				/>
			);
		}

		if (zone === undefined) {
			// display zone selector
			return (
				<ZoneSelector
					world={world}
					zones={Object.entries(WORLDS[world].zones).map(([name, data]) => ({ name, layoutOrder: data.id }))}
					// if user presses the world, it will set zone to "none" rather than undefined
					onZoneSelected={(zone): void => setZone(zone === undefined ? "none" : zone)}
					onClose={(): void => setWorld(undefined)}
				/>
			);
		}

		// display quests for that zone/world
		let quests = [];
		if (zone === "none") {
			quests = QUESTS[world].world;
		} else {
			quests = QUESTS[world].zone[zone];
		}

		const displayQuests = quests.map((quest) => {
			const { progress, completionProgress } = quest.validate(props.state);
			return {
				name: quest.name,
				progress,
				completionProgress,
				experience: quest.experienceReward,
				specialReward: quest.specialReward,
				hasPreviouslyClaimed: props.state.quests[world].world.has(quest.name),
			};
		});

		return (
			<QuestDisplayer
				quests={displayQuests}
				onQuestClaim={(quest): void => redeemQuest.SendToServer(quest)}
				onClose={(): void => setZone(undefined)}
			/>
		);
	}),
);
