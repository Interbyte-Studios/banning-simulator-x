import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { hatchHatchableEgg } from "server/modules/pets/hatchEgg";
import { canHatch } from "server/modules/pets/hatchSpy";
import { remotes } from "shared/remotes";
import { hatchEgg } from "shared/rodux/eggs";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { getTradeStatus, TradeStatus } from "./trading/trades";

const eggsNamespace = remotes.Server.GetNamespace("eggs");
const hatchEggRemote = eggsNamespace.Get("hatchEgg");
const conveyHatch = eggsNamespace.Get("conveyHatch");
hatchEggRemote.Connect(
	withPlayerStore((player, store, amount, eggName, isVoid) => {
		const currentState = store.getState();

		// check that they are not trading
		const isTrading = getTradeStatus(player) !== undefined && getTradeStatus(player) !== TradeStatus.TradeSent;
		if (isTrading) {
			return;
		}

		// check that they're not hatching an amount of eggs they shouldn't be able to
		if (amount !== 1) {
			// If they're trying to hatch 4 or 5, they have to have the gamepass.
			if (amount > 3 && !currentState.gamepasses["Triple Hatch"]) {
				return;
			}

			if (amount === 2 && currentState.rebirths.additionalEggs !== 1) {
				return;
			}

			if (amount === 3 && !(currentState.rebirths.additionalEggs === 2 || currentState.gamepasses["Triple Hatch"])) {
				return;
			}

			if (amount === 4 && currentState.rebirths.additionalEggs !== 1) {
				return;
			}

			if (amount === 5 && currentState.rebirths.additionalEggs !== 2) {
				return;
			}
		}

		// find reduced egg cost provided by player mastery
		const eggData = getEggData(eggName);
		if (eggData.hidden || !eggData.hatchable) {
			return;
		}

		// check that user owns world
		const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
		if (ownsWorld === undefined) {
			return;
		}

		// check that user owns zone
		const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
		if (ownsZone === undefined) {
			return;
		}

		// check inventory space
		if (currentState.pets.size() + amount > getPetInventorySize(currentState.gamepasses)) {
			return;
		}

		// check cost
		const eggMasteryReducedMultiplier = getEggsMastery(store.getState().eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(eggName, isVoid, eggMasteryReducedMultiplier);
		if (currentState.currencies[eggCost.currencyType] < eggCost.amount * amount) {
			return;
		}

		// check that user is within distance
		const character = player.Character;
		if (character === undefined) {
			return;
		}

		const isWithinDistance = withinDistanceToHatch(character, eggName, isVoid);
		if (!isWithinDistance) {
			return;
		}

		// check that they're not hatching to fast
		const checksOut = canHatch(player, currentState.gamepasses["Fast Hatch"], currentState.rebirths.fastHatch);
		if (!checksOut) {
			return warn(`Cannot Hatch!`);
		}

		// find the eggs to hatch
		const hatchedEggs = hatchHatchableEgg(player, currentState, eggName, amount, isVoid ? "void" : "regular");

		// dispatch the pets
		store.dispatch(hatchEgg(eggCost.amount * hatchedEggs.size(), eggCost.currencyType, hatchedEggs));
		conveyHatch.SendToPlayer(player, eggName, hatchedEggs, isVoid);
	}),
);
