import { createContext } from "@rbxts/roact";

import { accoladesRemoteContext } from "./remoteDefinitions/accolades";
import { adminRemoteContext } from "./remoteDefinitions/admin";
import { boostsRemoteContext } from "./remoteDefinitions/boosts";
import { dailyRewardsRemoteContext } from "./remoteDefinitions/dailyRewards";
import { eggsRemoteContext } from "./remoteDefinitions/eggs";
import { fusionRemoteContext } from "./remoteDefinitions/fusion";
import { gamepassEremoteContext } from "./remoteDefinitions/gamepasses";
import { mediaRemoteContext } from "./remoteDefinitions/media";
import { petMasteryRemoteContext } from "./remoteDefinitions/petMastery";
import { petQuestRemoteContext } from "./remoteDefinitions/petQuest";
import { petsRemoteContext } from "./remoteDefinitions/pets";
import { playerLoadedContext } from "./remoteDefinitions/playerLoaded";
import { questsRemoteContext } from "./remoteDefinitions/quests";
import { ranksRemoteContext } from "./remoteDefinitions/ranks";
import { rewardsRemoteContext } from "./remoteDefinitions/rewards";
import { settingsRemoteContext } from "./remoteDefinitions/settings";
import { talismansRemoteContext } from "./remoteDefinitions/talismans";
import { timeTrialsRemoteContext } from "./remoteDefinitions/timeTrials";
import { titlesRemoteContext } from "./remoteDefinitions/titles";
import { tradingRemoteContext } from "./remoteDefinitions/trading";
import { weaponsRemoteContext } from "./remoteDefinitions/weapons";
import { wheelSpinRemoteContext } from "./remoteDefinitions/wheelSpin";
import { worldPrestigeRemoteContext } from "./remoteDefinitions/worldPrestige";
import { zonesRemoteContext } from "./remoteDefinitions/zones";

/**
 * This is the remote context for the remote functions.
 */
export const fakeRemoteContext = {
	...dailyRewardsRemoteContext,
	...playerLoadedContext,
	...petMasteryRemoteContext,
	...petQuestRemoteContext,
	...weaponsRemoteContext,
	...petsRemoteContext,
	...zonesRemoteContext,
	...eggsRemoteContext,
	...adminRemoteContext,
	...mediaRemoteContext,
	...questsRemoteContext,
	...settingsRemoteContext,
	...talismansRemoteContext,
	...ranksRemoteContext,
	...rewardsRemoteContext,
	...titlesRemoteContext,
	...timeTrialsRemoteContext,
	...wheelSpinRemoteContext,
	...accoladesRemoteContext,
	...fusionRemoteContext,
	...tradingRemoteContext,
	...boostsRemoteContext,
	...worldPrestigeRemoteContext,
	...gamepassEremoteContext,
};

export const remoteContext = createContext(fakeRemoteContext);
