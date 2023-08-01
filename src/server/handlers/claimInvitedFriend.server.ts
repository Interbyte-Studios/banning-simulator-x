import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { claimInvitedFriend } from "shared/rodux/invitedFriend";
import { addPets } from "shared/rodux/pets";

remotes.Server.Get("claimInvitedFriend").Connect(
	withPlayerStore((_, store) => {
		debug.setmemorycategory("claimInvitedFriend");
		const currentState = store.getState();
		if (currentState.invitedFriend) {
			return;
		}

		store.dispatch(claimInvitedFriend());
		store.dispatch(
			addPets([
				{
					id: 10007,
					variant: "regular",
					tradeLocked: false,
					guid: HttpService.GenerateGUID(false),
				},
			]),
		);

		modifyPetCount({
			type: "addPet",
			petId: 10007,
			variant: "regular",
		});

		store.dispatch(storeBoost("x2 Currency", 120));
		store.dispatch(storeBoost("x2 Hatching Luck", 120));
	}),
);
