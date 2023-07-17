import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { removePrestigeToken } from "shared/rodux/worldPrestige";

remotes.Server.GetNamespace("worldPrestige")
	.Get("purchasePrestigeBoost")
	.Connect(
		withPlayerStore((_, store, worldName, boostName, boostTime) => {
			const currentState = store.getState();

			// we need to be sure they have a prestige token, otherwise they can't purchase the boost
			let cost = 5000;
			let hasEnoughTokens = true;
			switch (boostTime) {
				case 15: {
					cost = 1000000; // can't purchase this from shop
					if (currentState.worldPrestige[worldName].prestigeTokens < cost) {
						hasEnoughTokens = false;
					}
					break;
				}
				case 30: {
					cost = 2;
					if (currentState.worldPrestige[worldName].prestigeTokens < cost) {
						hasEnoughTokens = false;
					}
					break;
				}
				case 60: {
					cost = 4;
					if (currentState.worldPrestige[worldName].prestigeTokens < cost) {
						hasEnoughTokens = false;
					}
					break;
				}
				case 120: {
					cost = 6;
					if (currentState.worldPrestige[worldName].prestigeTokens < cost) {
						hasEnoughTokens = false;
					}
					break;
				}
			}
			if (!hasEnoughTokens) {
				return;
			}

			store.dispatch(storeBoost(boostName, boostTime));
			store.dispatch(removePrestigeToken(worldName, cost));
		}),
	);
