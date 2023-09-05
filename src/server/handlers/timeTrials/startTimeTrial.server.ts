debug.setmemorycategory("startTimeTrial");
import { HttpService, ReplicatedStorage, RunService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { currentTimeTrials, TimeTrialStatus } from "server/modules/timeTrials";
import { getTrialStatus } from "server/modules/timeTrials/createTrial";
import { startTrial } from "server/modules/timeTrials/startTrial";
import assetIds from "shared/assets";
import { TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TIME_TRIAL_TIMER_ATTRIBUTE } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";
import { equipWeapon } from "shared/rodux/currentWeapon";
import { addPets } from "shared/rodux/pets";
import { setHighestHardWave } from "shared/rodux/timeTrials";
import { getEggData } from "shared/util/getEggData";
import { getPetData } from "shared/util/getPetData";

const random = new Random();

const hatchExclusiveEggRemote = remotes.Server.GetNamespace("eggs").Get("hatchSingleExclusiveEgg");
const hatchSystemMessage = remotes.Server.GetNamespace("eggs").Get("hatchEggSystemMessage");
remotes.Server.GetNamespace("timeTrials")
	.Get("startTimeTrial")
	.Connect(
		withPlayerStore((player, store) => {
			if (getTrialStatus(player) !== TimeTrialStatus.WaitingForStart) {
				return;
			}

			store.dispatch(equipWeapon());

			const { cleanupHandler, stepHandler } = startTrial(player);
			cleanupHandler.Add(
				RunService.Heartbeat.Connect((delta) => {
					const didComplete = stepHandler(delta);

					if (didComplete) {
						const trials = currentTimeTrials.get(player);
						assert(trials, `Failed to find difficulty for ${player} in time trial`);

						const difficulty = trials.difficulty;
						const wave = trials.wave;

						cleanupHandler.Cleanup();

						player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, undefined);
						player.SetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE, undefined);

						// todo: compute rewards, give them to player, tell player
						const currentState = store.getState();
						const currencyMultiplier = currentState.rebirths.currencyMultipliers.gears * 0.3;

						const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.3 : 1.35;
						const waveMultiplier = 5 * wave;

						const reward = waveMultiplier * difficultyMultiplier ** wave;
						const rewardWithMultiplier = reward + reward * currencyMultiplier;
						store.dispatch(awardCurrency("gears", rewardWithMultiplier));

						if (difficulty === "hard") {
							if (wave > store.getState().timeTrials["Ban Land"].highestHardWave) {
								store.dispatch(setHighestHardWave("Ban Land", wave));
							}

							let selectedPet = 0;
							let chance = random.NextNumber(0, 100);
							const eggData = getEggData("Geometric");
							for (const [, petData] of pairs(eggData.pets)) {
								chance -= petData.chance;
								if (chance > 0) {
									continue;
								}

								selectedPet = petData.id;
								break;
							}
							const pet = getPetData(selectedPet);

							store.dispatch(
								addPets([
									{
										id: selectedPet,
										variant: "regular",
										tradeLocked: false,
										guid: HttpService.GenerateGUID(false),
									},
								]),
							);

							modifyPetCount({
								type: "addPet",
								petId: selectedPet,
								variant: "regular",
							});

							if (pet.rarity === "Secret" || pet.rarity === "Primordial") {
								hatchSystemMessage.SendToAllPlayers(player, pet.id, "regular", "hatched");
								const image = assetIds.images.decals.pets[pet.name as keyof typeof assetIds.images.decals.pets];
								let decalToPass = 0;
								if (image !== undefined) {
									decalToPass = image.match("%d+")[0] as number;
								}

								let existAmount = 0;
								const petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(pet.id) as Configuration;
								if (petExistCache !== undefined) {
									const variantCache = petExistCache.FindFirstChild("regular") as IntValue;
									if (variantCache !== undefined) {
										const variantCache = petExistCache.FindFirstChild("regular") as IntValue;
										if (variantCache !== undefined) {
											existAmount += variantCache.Value;
										}
									}
								}

								task.spawn(() => {
									pcall(() => {
										HttpService.RequestAsync({
											Url: "http://137.184.152.180:8765/hatch",
											Body: HttpService.JSONEncode({
												roblox_uid: player.UserId,
												secret_name: pet.name,
												secret_type: pet.rarity,
												pet_variant: "regular",
												decal: decalToPass,
												exist: existAmount + 1,
											}),
											Method: "POST",
											Headers: {
												"Content-Type": "application/json",
												"X-ACCESS-TOKEN": "V1qijQkozBm1LdD5SsO1",
											},
										});
									});
								});
							} else if (pet.rarity === "Legendary") {
								hatchSystemMessage.SendToAllPlayers(player, pet.id, "regular", "hatched");
							}

							hatchExclusiveEggRemote.SendToPlayer(player, "Geometric", selectedPet);
						}
					}
				}),
			);
		}),
	);
