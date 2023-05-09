import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";

import { app as App } from "./app";
import { AnnouncementAPI } from "./context/AnnouncementsAPI";
import { remoteContext } from "./mocks/remoteContext";
import { accoladeRemotes } from "./remotes/accolades";
import { adminRemotes } from "./remotes/admin";
import { eggsRemotes } from "./remotes/eggs";
import { fusionRemtoes } from "./remotes/fusion";
import { mediaRemotes } from "./remotes/media";
import { petMasteryRemotes } from "./remotes/petMastery";
import { petRemtoes } from "./remotes/pets";
import { questsRemotes } from "./remotes/quests";
import { ranksRemotes } from "./remotes/ranks";
import { settingsRemotes } from "./remotes/settings";
import { talismanRemotes } from "./remotes/talismans";
import { titlesRemtoes } from "./remotes/titles";
import { tradingRemotes } from "./remotes/trading";
import { weaponsRemotes } from "./remotes/weapons";
import { wheelSpinRemotes } from "./remotes/wheelSpin";
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
					...eggsRemotes,
					...fusionRemtoes,
					...mediaRemotes,
					...petRemtoes,
					...petMasteryRemotes,
					...questsRemotes,
					...ranksRemotes,
					...settingsRemotes,
					...talismanRemotes,
					...titlesRemtoes,
					...tradingRemotes,
					...weaponsRemotes,
					...wheelSpinRemotes,
					...zonesRemotes,
				}}
			>
				<AnnouncementAPI>
					<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
						{<App player={player} store={store} />}
					</screengui>
				</AnnouncementAPI>
			</remoteContext.Provider>,
			playerGui,
			"tree",
		);

		print(`Mounted Roact app in ${math.floor((os.clock() - start) * secondLength)}ms`);
	})
	.catch((e) => {
		throw `Failed to mount Roact app due to ${e}`;
	});
