import { TELEPORTATIONS } from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";
import { remotes } from "shared/remotes";
import { PurchaseWorldFailKind } from "shared/remotes/purchaseWorld";
import { unlockWorld } from "shared/rodux/worlds";

import { withPlayerStore } from "../modules/net/withPlayerStore";

remotes.Server.Get("purchaseWorld").SetCallback(
	withPlayerStore((player, store, worldName, zoneName) => {
		debug.setmemorycategory("purchaseWorld");
		const currentState = store.getState();

		if (currentState.worlds.find((storedWorld) => storedWorld.name === worldName) !== undefined) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.InternalError,
			};
		}

		const worldData = WORLDS[worldName];
		if (worldData.cost === undefined) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.InternalError,
			};
		}

		if (currentState.currencies[worldData.cost.currencyType] < worldData.cost.amount) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.NotEnoughCurrency,
			};
		}

		if (currentState.rank < worldData.cost.requiredRank) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.NotRequiredRank,
			};
		}

		const teleportation = TELEPORTATIONS.ZONES[zoneName];
		const character = player.Character;
		if (character === undefined) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.InternalError,
			};
		}

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.InternalError,
			};
		}

		const root = humanoid.RootPart;
		if (root === undefined) {
			return {
				success: false,
				reason: PurchaseWorldFailKind.InternalError,
			};
		}

		root.CFrame = new CFrame(teleportation);

		store.dispatch(
			unlockWorld({
				zoneName,
				worldName,
				currency: {
					amount: worldData.cost.amount,
					type: worldData.cost.currencyType,
				},
			}),
		);

		return {
			success: true,
		};
	}),
);
