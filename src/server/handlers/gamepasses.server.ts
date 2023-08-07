import { MarketplaceService, Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { onStoreCreated, retrieveStore } from "server/playerStore";
import { GAMEPASSES, GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { claimGamepass } from "shared/rodux/gamepasses";
import { useGamepassGift } from "shared/rodux/gamepassGifts";
import { setGroupRank } from "shared/rodux/playerIndex/groupRank";

remotes.Server.Get("useGamepassGift").Connect(
	withPlayerStore((player, store, gamepass, targetPlayer) => {
		debug.setmemorycategory("gamepassGifts");
		if (store.getState().gamepassGifts[gamepass] < 1) {
			return;
		}

		const otherPlayerStore = retrieveStore(targetPlayer);
		if (otherPlayerStore === undefined) {
			return;
		}

		otherPlayerStore.dispatch(claimGamepass(gamepass));
		store.dispatch(useGamepassGift(gamepass));
		remotes.Server.Get("gamepassGiftReceived").SendToPlayer(targetPlayer, gamepass, player);
	}),
);

Players.PlayerAdded.Connect(async (player) => {
	debug.setmemorycategory("gamepasses");
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
				userOwnsGamepass = playerRankInGroup > 248;
			}

			if (userOwnsGamepass) {
				store.dispatch(claimGamepass(name));
			}
		}
	}
});
