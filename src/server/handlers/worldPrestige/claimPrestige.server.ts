import Object from "@rbxts/object-utils";
import { HttpService, Workspace } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { WORLDS } from "shared/configs/worlds";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";
import { addPets } from "shared/rodux/pets";
import { resetRank } from "shared/rodux/rank";
import { claimPrestige } from "shared/rodux/worldPrestige";
import { resetZones } from "shared/rodux/worlds";

remotes.Server.GetNamespace("worldPrestige")
	.Get("claimPrestige")
	.Connect(
		withPlayerStore((player, store, worldName) => {
			const currentState = store.getState();

			// check that user owns the world and all zones of the world they're prestiging
			const worldConfig = WORLDS[worldName];
			const storedWorldData = currentState.worlds.find((storedWorld) => storedWorld.name === worldName);
			if (storedWorldData === undefined) {
				return;
			}

			/*
                We are still in the process of checking if they own all the zones, but we're also simultaneously getting the id of the last zone.
                We calculate the cost of the prestige here.
                To do that, we get the last zone of the world, and multiply it's cost by 5.
            */
			let lastZoneId = 0;
			let ownsAllZones = true;
			for (const [zoneName, zoneData] of pairs(worldConfig.zones)) {
				const ownsZone = storedWorldData.zones.includes(zoneName);
				if (!ownsZone) {
					ownsAllZones = false;
				} else {
					if (zoneData.id > lastZoneId) {
						lastZoneId = zoneData.id;
					}
				}
			}
			if (!ownsAllZones) {
				return;
			}

			/*
                We calculate the cost of the prestige here.
                To do that, we get the last zone of the world, and multiply it's cost by 5.
            */
			const lastZone = Object.values(worldConfig.zones).find((zoneData) => zoneData.id === lastZoneId);
			if (lastZone === undefined) {
				throw `Could not find last zone of world ${worldName} | Zone ID: ${lastZoneId}`;
			}

			if (lastZone.cost === undefined) {
				throw `The cost of the last zone of world ${worldName} was undefined!`;
			}

			const prestigeCost = lastZone.cost.amount * 5;

			// now we check if the player has enough to prestige
			if (currentState.currencies[lastZone.cost.currency] < prestigeCost) {
				return;
			}

			// they have all the zones, and have enough coins, so they can claim the prestige!
			const currentPrestige = currentState.worldPrestige[worldName].currentPrestige;
			store.dispatch(claimPrestige(worldName, currentPrestige));
			store.dispatch(awardCurrency(worldConfig.reward, -store.getState().currencies[worldConfig.reward]));
			store.dispatch(resetRank());
			store.dispatch(resetZones(worldName));

			// Now we check if they're prestige is a multiple of 10 up until 50, and if it is, we give them a special reward
			const worldPrestigeRewards = WORLD_PRESTIGE.worldRewards[worldName];
			const newPrestige = currentPrestige + 1;
			switch (newPrestige) {
				case 10:
				case 20:
				case 30:
				case 40:
				case 50: {
					const reward = worldPrestigeRewards.find((reward) => reward.prestigeNumber === newPrestige);
					if (reward === undefined) {
						throw `Could not find reward for world ${worldName} and prestige 10`;
					}

					addPets(0, "coins", [
						{
							id: reward.petReward,
							variant: "regular",
							method: "purchase",
							tradeLocked: false,
							autoDeleted: false,
							guid: HttpService.GenerateGUID(false),
						},
					]);

					modifyPetCount({
						type: "addPet",
						petId: reward.petReward,
						variant: "regular",
					});
					break;
				}
			}

			// set character back to spawn
			const character = player.Character;
			if (character === undefined) {
				return;
			}

			const humanoid = character.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				return;
			}

			const rootPart = humanoid.RootPart as BasePart;
			if (rootPart === undefined) {
				return;
			}

			// set character back to spawn
			// will need to change this to be the spawn of the world
			rootPart.CFrame = new CFrame(Workspace.interactions.teleports.Forest.Position);
		}),
	);
