import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { onStoreCreated } from "server/playerStore";
import { remotes } from "shared/remotes";
import { claimBoost, useBoosts, ValidBoostUseRecord } from "shared/rodux/boosts";
import { getBoostMastery } from "shared/util/getBoostMastery";

Players.GetPlayers().forEach((player) =>
	onStoreCreated(player).andThen((store) => {
		task.defer(() => {
			debug.setmemorycategory("boosts");
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const activeBoosts: ValidBoostUseRecord = [];
				for (const [boostName, boostValue] of pairs(store.getState().boosts.active)) {
					if (boostValue < 0) {
						continue;
					}

					activeBoosts.push(boostName);
				}

				store.dispatch(useBoosts(activeBoosts));
				task.wait(1);
			}
		});
	}),
);

Players.PlayerAdded.Connect((player) =>
	onStoreCreated(player).andThen((store) => {
		task.defer(() => {
			debug.setmemorycategory("boosts");
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const activeBoosts: ValidBoostUseRecord = [];
				for (const [boostName, boostValue] of pairs(store.getState().boosts.active)) {
					if (boostValue < 0) {
						continue;
					}

					activeBoosts.push(boostName);
				}

				store.dispatch(useBoosts(activeBoosts));
				task.wait(1);
			}
		});
	}),
);

const useBoostRemote = remotes.Server.Get("useBoost");
useBoostRemote.Connect(
	withPlayerStore((_, store, boostName, boostTime) => {
		debug.setmemorycategory("boosts");
		const currentState = store.getState();

		const storedBoost = currentState.boosts.storage[boostName][boostTime];
		if (storedBoost < 1) {
			return;
		}

		const extendedBoostMultiplier = getBoostMastery(currentState.boosts);
		store.dispatch(claimBoost(boostName, boostTime, extendedBoostMultiplier.extendedDurationMultiplier));
	}),
);
