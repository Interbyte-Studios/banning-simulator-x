import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { remotes } from "shared/remotes";
import { purchaseWorldPrestigePetsUpgrade } from "shared/rodux/worldPrestige";

remotes.Server.GetNamespace("worldPrestige")
	.Get("purchaseWorldPrestigePetsUpgrade")
	.Connect(
		withPlayerStore((_, store, worldName) => {
			const currentState = store.getState();

			// we need to be sure they aren't going above the max upgrade amount
			if (currentState.worldPrestige[worldName].additionalPetsUpgrades >= WORLD_PRESTIGE.additionalPets.maxUpgrades) {
				return;
			}

			// we need to be sure they have a prestige token, otherwise they can't purchase the upgrade
			if (currentState.worldPrestige[worldName].prestigeTokens < 1) {
				return;
			}

			store.dispatch(purchaseWorldPrestigePetsUpgrade(worldName));
		}),
	);
