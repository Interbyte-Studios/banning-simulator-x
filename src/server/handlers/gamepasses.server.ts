import { MarketplaceService, Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { GAMEPASSES, GROUP_ID } from "shared/configs/game";
import { claimGamepass } from "shared/rodux/gamepasses";

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	const currentState = store.getState();

	for (const [name, id] of pairs(GAMEPASSES)) {
		if (currentState.gamepasses[name] === false) {
			let userOwnsGamepass = MarketplaceService.UserOwnsGamePassAsync(player.UserId, id);

			if (userOwnsGamepass === false) {
				userOwnsGamepass = player.IsInGroup(GROUP_ID) && player.GetRankInGroup(GROUP_ID) > 249;
			}

			if (userOwnsGamepass) {
				store.dispatch(claimGamepass(name));
			}
		}
	}
});
