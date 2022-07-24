import { QUESTS } from "shared/configs/quests";
import { Store } from "shared/rodux";
import { redeemWorldQuest, redeemZoneQuest } from "shared/rodux/quests";

/**
 * Redeems a given quest for a user.
 *
 * @param store The store to redeem the quest for.
 * @param quest The name of the quest to redeem.
 */
export function redeemQuest(store: Store, quest: string): void {
	// check if store already has quest redeemed
	for (const [, world] of pairs(store.getState().quests)) {
		if (world.world.has(quest)) {
			return;
		}

		for (const [, zone] of pairs(world.zone)) {
			if (zone.has(quest)) {
				return;
			}
		}
	}

	// get quest config
	let questConfig;
	let isWorldQuest = false;
	let questWorld;
	let questZone;
	for (const [worldName, world] of pairs(QUESTS)) {
		questWorld = worldName;
		// look in world quests
		questConfig = world.world.find((x) => quest === x.name);
		if (questConfig) {
			isWorldQuest = true;
			break;
		}

		// look in zone quests
		for (const [zoneName, zone] of pairs(world.zone)) {
			questZone = zoneName;
			questConfig = zone.find((x) => quest === x.name);
			if (questConfig) {
				break;
			}
		}
	}

	assert(questConfig, `Failed to get quest config for quest ${quest}`);
	assert(questWorld !== undefined, `Quest world was not assigned a value`);

	// check user has completed quest requirement
	const { progress, completionProgress } = questConfig.validate(store.getState());
	if (progress !== completionProgress) {
		return;
	}

	// redeem quest
	if (isWorldQuest) {
		store.dispatch(
			redeemWorldQuest(questWorld, questConfig.name, questConfig.experienceReward, questConfig.specialReward),
		);
	} else {
		assert(questZone, `Quest zone was not assigned a value`);
		store.dispatch(
			redeemZoneQuest(questWorld, questZone, questConfig.name, questConfig.experienceReward, questConfig.specialReward),
		);
	}
}
