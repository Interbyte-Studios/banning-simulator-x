import { MarketplaceService, Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { GAMEPASSES, GROUP_ID } from "shared/configs/game";
//import { claimGamepass } from "shared/rodux/gamepasses";
import { setGroupRank } from "shared/rodux/playerIndex";

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	const currentState = store.getState();
	const playerRankInGroup = player.GetRankInGroup(GROUP_ID);

	if (currentState.index.groupRank !== playerRankInGroup) {
		store.dispatch(setGroupRank(playerRankInGroup));
	}

	for (const [name, id] of pairs(GAMEPASSES)) {
		if (currentState.gamepasses[name] === false) {
			let userOwnsGamepass = MarketplaceService.UserOwnsGamePassAsync(player.UserId, id);

			if (userOwnsGamepass === false) {
				userOwnsGamepass = playerRankInGroup > 250;
			}

			if (userOwnsGamepass) {
				//store.dispatch(claimGamepass(name));
			}
		}
	}
});
