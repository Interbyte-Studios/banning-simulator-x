import { EggName, EGGS } from "shared/configs/eggs";
import { LIMITED_EGG } from "shared/configs/game";
import { getEggData } from "shared/util/getEggData";

const invalidEggChances: Array<{ name: EggName; chance: number }> = [];

// first we want to check that all the egg's pet chances add up to 100.
for (const [eggName, eggData] of pairs(EGGS)) {
	if (!eggData.hatchable) {
		continue;
	}

	let chance = 0;
	for (const [, petData] of pairs(eggData.pets)) {
		chance += petData.chance;
	}

	if (100 - chance > 0.00000001) {
		invalidEggChances.push({
			name: eggName,
			chance,
		});
	}
}

// next we want to ensure that the limited egg in rotation also has pet chances that add to 100
const limitedEggData = getEggData(LIMITED_EGG);
let limitedEggTotalChance = 0;
for (const [, petData] of pairs(limitedEggData.pets)) {
	limitedEggTotalChance += petData.chance;
}

if (limitedEggTotalChance !== 100) {
	invalidEggChances.push({
		name: LIMITED_EGG,
		chance: limitedEggTotalChance,
	});
}

if (invalidEggChances.size() > 0) {
	invalidEggChances.forEach((eggChanceData) => warn(`Name: ${eggChanceData.name} | Chance: ${eggChanceData.chance}`));
	throw `Issue with pet chances!`;
}
