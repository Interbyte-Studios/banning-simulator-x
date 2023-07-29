import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { remotes } from "shared/remotes";

import { AnnouncementAPI } from "./context/AnnouncementsAPI";
import { Control } from "./highestOrderedApps/control";
import { remoteContext } from "./mocks/remoteContext";
import { accoladeRemotes } from "./remotes/accolades";
import { adminRemotes } from "./remotes/admin";
import { boostRemotes } from "./remotes/boosts";
import { dailyRewardsRemotes } from "./remotes/dailyRewards";
import { eggsRemotes } from "./remotes/eggs";
import { fusionRemtoes } from "./remotes/fusion";
import { gamepassRemotes } from "./remotes/gamepasses";
import { mediaRemotes } from "./remotes/media";
import { petMasteryRemotes } from "./remotes/petMastery";
import { petQuestRemotes } from "./remotes/petQuest";
import { petRemtoes } from "./remotes/pets";
import { playerLoadedRemtoes } from "./remotes/playerLoaded";
import { questsRemotes } from "./remotes/quests";
import { ranksRemotes } from "./remotes/ranks";
import { rewardRemotes } from "./remotes/rewards";
import { settingsRemotes } from "./remotes/settings";
import { talismanRemotes } from "./remotes/talismans";
import { timeTrialsRemotes } from "./remotes/timeTrials";
import { titlesRemtoes } from "./remotes/titles";
import { tradingRemotes } from "./remotes/trading";
import { weaponsRemotes } from "./remotes/weapons";
import { wheelSpinRemotes } from "./remotes/wheelSpin";
import { worldPrestigeRemotes } from "./remotes/worldPrestige";
import { zonesRemotes } from "./remotes/zones";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const start = os.clock();
const secondLength = 1000;

onStoreCreated(player)
	.andThen((store) => {
		Roact.mount(
			<remoteContext.Provider
				value={{
					...accoladeRemotes,
					...adminRemotes,
					...boostRemotes,
					...dailyRewardsRemotes,
					...eggsRemotes,
					...fusionRemtoes,
					...gamepassRemotes,
					...mediaRemotes,
					...petRemtoes,
					...petQuestRemotes,
					...petMasteryRemotes,
					...playerLoadedRemtoes,
					...questsRemotes,
					...ranksRemotes,
					...rewardRemotes,
					...settingsRemotes,
					...talismanRemotes,
					...timeTrialsRemotes,
					...titlesRemtoes,
					...tradingRemotes,
					...weaponsRemotes,
					...wheelSpinRemotes,
					...worldPrestigeRemotes,
					...zonesRemotes,
				}}
			>
				<AnnouncementAPI>
					<>
						<Control player={player} store={store} />
					</>
				</AnnouncementAPI>
			</remoteContext.Provider>,
			playerGui,
			"tree",
		);

		print(`Mounted Roact app in ${math.floor((os.clock() - start) * secondLength)}ms`);
	})
	.andThen(() => {
		remotes.Client.GetNamespace("playerLoaded").Get("roactMounted").SendToServer();
	})
	.catch((e) => {
		throw `Failed to mount Roact app due to ${e}`;
	});
