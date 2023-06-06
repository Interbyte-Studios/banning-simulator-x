import { createContext } from "@rbxts/roact";

import { accoladesRemoteContext } from "./remoteDefinitions/accolades";
import { adminRemoteContext } from "./remoteDefinitions/admin";
import { eggsRemoteContext } from "./remoteDefinitions/eggs";
import { fusionRemoteContext } from "./remoteDefinitions/fusion";
import { mediaRemoteContext } from "./remoteDefinitions/media";
import { petMasteryRemoteContext } from "./remoteDefinitions/petMastery";
import { petsRemoteContext } from "./remoteDefinitions/pets";
import { questsRemoteContext } from "./remoteDefinitions/quests";
import { ranksRemoteContext } from "./remoteDefinitions/ranks";
import { rewardsRemoteContext } from "./remoteDefinitions/rewards";
import { settingsRemoteContext } from "./remoteDefinitions/settings";
import { talismansRemoteContext } from "./remoteDefinitions/talismans";
import { titlesRemoteContext } from "./remoteDefinitions/titles";
import { tradingRemoteContext } from "./remoteDefinitions/trading";
import { weaponsRemoteContext } from "./remoteDefinitions/weapons";
import { wheelSpinRemoteContext } from "./remoteDefinitions/wheelSpin";
import { zonesRemoteContext } from "./remoteDefinitions/zones";

/**
 * This is the remote context for the remote functions.
 */
export const fakeRemoteContext = {
	...petMasteryRemoteContext,
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
	...wheelSpinRemoteContext,
	...accoladesRemoteContext,
	...fusionRemoteContext,
	...tradingRemoteContext,
};

export const remoteContext = createContext(fakeRemoteContext);
