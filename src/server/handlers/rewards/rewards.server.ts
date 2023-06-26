import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { BoostProduct, GROUP_PET_ID, VIP_PET_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { addPets } from "shared/rodux/pets";
import { claimClubReward, claimGroupReward, claimVIPReward } from "shared/rodux/playerIndex";

const rewardRemotes = remotes.Server.GetNamespace("rewards");
rewardRemotes.Get("claimClubReward").SetCallback(
	withPlayerStore((player, store) => {
		const now = DateTime.now();
		const timeStamp = now.UnixTimestamp;

		const currentState = store.getState();
		if (currentState.index.groupRank === undefined) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.clubRewardClaimed.lastClaimed;
		const canClaim = timeStamp - previousClaims > 86400;

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
		store.dispatch(claimClubReward(timeStamp, boost));

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
		const timeStamp = now.UnixTimestamp;

		const currentState = store.getState();
		if (currentState.index.groupRank === undefined) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.groupRewardClaimed.lastClaimed;
		const canClaim = timeStamp - previousClaims > 86400;

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

		const hasClaimedPet = currentState.index.groupRewardClaimed.petIdClaimed === GROUP_PET_ID;
		store.dispatch(claimGroupReward(timeStamp, boost, hasClaimedPet ? undefined : GROUP_PET_ID));
		if (!hasClaimedPet) {
			modifyPetCount({
				type: "addPet",
				petId: GROUP_PET_ID,
				variant: "regular",
			});
			store.dispatch(
				addPets(0, "coins", [
					{
						id: GROUP_PET_ID,
						variant: "regular",
						method: "hatch",
						tradeLocked: false,
						guid: HttpService.GenerateGUID(false),
						autoDeleted: false,
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
		const timeStamp = now.UnixTimestamp;

		const currentState = store.getState();
		if (!currentState.gamepasses.VIP) {
			return {
				success: false,
			};
		}

		const previousClaims = currentState.index.vipRewardClaimed.lastClaimed;
		const canClaim = timeStamp - previousClaims > 86400;

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

		const hasClaimedPet = currentState.index.vipRewardClaimed.petIdClaimed === VIP_PET_ID;
		store.dispatch(claimVIPReward(timeStamp, boost, hasClaimedPet ? undefined : VIP_PET_ID));
		if (!hasClaimedPet) {
			modifyPetCount({
				type: "addPet",
				petId: VIP_PET_ID,
				variant: "regular",
			});
			store.dispatch(
				addPets(0, "coins", [
					{
						id: VIP_PET_ID,
						variant: "regular",
						method: "hatch",
						tradeLocked: false,
						guid: HttpService.GenerateGUID(false),
						autoDeleted: false,
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
