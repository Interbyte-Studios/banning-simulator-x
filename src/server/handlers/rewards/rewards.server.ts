debug.setmemorycategory("rewards");
import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { BoostProduct, GROUP_PET_ID, VIP_PET_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { addPets } from "shared/rodux/pets";
import { claimClubReward } from "shared/rodux/playerIndex/clubRewards";
import { claimGroupReward } from "shared/rodux/playerIndex/groupRewards";
import { claimVIPReward } from "shared/rodux/playerIndex/vipRewards";

const rewardRemotes = remotes.Server.GetNamespace("rewards");
rewardRemotes.Get("claimClubReward").SetCallback(
	withPlayerStore((player, store) => {
		const now = DateTime.now();

		const currentState = store.getState();
		if (currentState.index.groupRank === 0) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.clubRewards.lastClaimed;
		const canClaim = now.UnixTimestamp - previousClaims.UnixTimestamp > 86400;

		if (!canClaim) {
			return {
				success: false,
			};
		}

		const random = new Random();
		const reward = random.NextInteger(1, 4);

		let boost: BoostProduct = "x2 Currency";
		switch (reward) {
			case 1:
				boost = "x2 Currency";
				break;
			case 2:
				boost = "x2 Hatching Luck";
				break;
			case 3:
				boost = "x2 Rank Experience";
				break;
			case 4:
				boost = "x2 Pet Experience";
				break;
		}
		store.dispatch(claimClubReward(now, boost));

		return {
			success: true,
			boost: {
				name: boost,
				duration: 15,
			},
		};
	}),
);

rewardRemotes.Get("claimGroupReward").SetCallback(
	withPlayerStore((player, store) => {
		const now = DateTime.now();

		const currentState = store.getState();
		if (currentState.index.groupRank === 0) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.groupRewards.lastClaimed;
		const canClaim = now.UnixTimestamp - previousClaims.UnixTimestamp > 86400;

		if (!canClaim) {
			return {
				success: false,
			};
		}

		const random = new Random();
		const reward = random.NextInteger(1, 4);

		let boost: BoostProduct = "x2 Currency";
		switch (reward) {
			case 1:
				boost = "x2 Currency";
				break;
			case 2:
				boost = "x2 Hatching Luck";
				break;
			case 3:
				boost = "x2 Rank Experience";
				break;
			case 4:
				boost = "x2 Pet Experience";
				break;
		}

		const hasClaimedPet = currentState.index.groupRewards.lastPetIdClaimed === GROUP_PET_ID;
		store.dispatch(claimGroupReward(now, boost, hasClaimedPet ? undefined : GROUP_PET_ID));
		if (!hasClaimedPet) {
			modifyPetCount({
				type: "addPet",
				petId: GROUP_PET_ID,
				variant: "regular",
			});
			store.dispatch(
				addPets([
					{
						id: GROUP_PET_ID,
						variant: "regular",
						tradeLocked: false,
						guid: HttpService.GenerateGUID(false),
					},
				]),
			);
		}

		return {
			success: true,
			boost: {
				name: boost,
				duration: 15,
			},
			petId: !hasClaimedPet ? GROUP_PET_ID : undefined,
		};
	}),
);

rewardRemotes.Get("claimVIPReward").SetCallback(
	withPlayerStore((player, store) => {
		const now = DateTime.now();

		const currentState = store.getState();
		if (!currentState.gamepasses.VIP) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.vipRewards.lastClaimed;
		const canClaim = now.UnixTimestamp - previousClaims.UnixTimestamp > 86400;

		if (!canClaim) {
			return {
				success: false,
			};
		}

		const random = new Random();
		const reward = random.NextInteger(1, 4);

		let boost: BoostProduct = "x2 Currency";
		switch (reward) {
			case 1:
				boost = "x2 Currency";
				break;
			case 2:
				boost = "x2 Hatching Luck";
				break;
			case 3:
				boost = "x2 Rank Experience";
				break;
			case 4:
				boost = "x2 Pet Experience";
				break;
		}

		const hasClaimedPet = currentState.index.vipRewards.lastPetIdClaimed === VIP_PET_ID;
		store.dispatch(claimVIPReward(now, boost, hasClaimedPet ? undefined : VIP_PET_ID));
		if (!hasClaimedPet) {
			modifyPetCount({
				type: "addPet",
				petId: VIP_PET_ID,
				variant: "regular",
			});
			store.dispatch(
				addPets([
					{
						id: VIP_PET_ID,
						variant: "regular",
						tradeLocked: false,
						guid: HttpService.GenerateGUID(false),
					},
				]),
			);
		}

		return {
			success: true,
			boost: {
				name: boost,
				duration: 15,
			},
			petId: !hasClaimedPet ? VIP_PET_ID : undefined,
		};
	}),
);
