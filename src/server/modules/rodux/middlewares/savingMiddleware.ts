import { Profile } from "@rbxts/profileservice/globals";
import Rodux from "@rbxts/rodux";
import { RunService } from "@rbxts/services";
import { PET_LEVEL_REQUIREMENTS, PET_MAX_LEVELS } from "shared/configs/pets";
import { Store, StoreActions, StoreState } from "shared/rodux";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

/**
 * The saving middleware.
 *
 * @param player The player.
 * @param profile The profile of the player.
 * @returns The middleware.
 */
export const savingMiddleware = (player: Player, profile: Profile<StoreState>): Rodux.Middleware => {
	if (RunService.IsClient()) {
		warn(debug.traceback());
		throw `Attempt to create savingMiddleware on client.`;
	}

	return (nextDispatch, store: Store) => {
		return (_action: StoreActions) => {
			const action = _action;
			const result = nextDispatch(action);

			const storeState = store.getState();
			const playerData = profile.Data;

			switch (action.type) {
				case "addEgg": {
					playerData.eggs = storeState.eggs;
					break;
				}
				case "addPet": {
					// if we ever serialize a pet, we'd do it here not in the rodux store
					playerData.pets = storeState.pets;
					playerData.currencies = storeState.currencies;
					playerData.index = storeState.index;
					break;
				}
				case "addTimePlayed": {
					playerData.index.timePlayed = storeState.index.timePlayed;
					break;
				}
				case "admin_ModifyPetLevel": {
					const pet = playerData.pets.find((pet) => pet.guid === action.guid);
					if (pet === undefined) {
						warn(
							`[Saving Middleware] Attempt to modify pet level of pet that does not exist for player ${player.Name}`,
						);
						break;
					}

					const newLevelData = action.level < PET_MAX_LEVELS[pet.variant] ? action.level : PET_MAX_LEVELS[pet.variant];
					const banResult = PET_LEVEL_REQUIREMENTS[pet.variant] * newLevelData;

					pet.bans = banResult;
					break;
				}
				case "admin_ModifyWeaponLevel": {
					const weapon = playerData.weapons.find((weapon) => weapon.id === action.weaponId);
					if (weapon === undefined) {
						warn(
							`[Saving Middleware] Attempt to modify weapon level of weapon that does not exist for player ${player.Name}. Weapon id is: ${action.weaponId}}`,
						);
						break;
					}

					weapon.level = action.level;

					break;
				}
				case "admin_modifyTalismanLevel": {
					const talisman = playerData.talismans.find((talisman) => talisman.id === action.talismanId);
					if (talisman === undefined) {
						warn(
							`[Saving Middleware] Attempt to modify talisman level of talisman that does not exist for player ${player.Name}. Weapon id is: ${action.talismanId}}`,
						);
						break;
					}

					break;
				}
				case "awardCurrency": {
					playerData.currencies = storeState.currencies;
					break;
				}
				case "changeWeapon": {
					playerData.currentWeapon = storeState.currentWeapon;
					break;
				}
				case "claimAccolade": {
					playerData.accolades = storeState.accolades;
					break;
				}
				case "claimBoost": {
					playerData.boosts = storeState.boosts;
					break;
				}
				case "claimClubReward": {
					playerData.boosts = storeState.boosts;
					playerData.index = storeState.index;
					break;
				}
				case "claimDevProduct": {
					playerData.devProducts = storeState.devProducts;
					break;
				}
				case "claimGamepass": {
					playerData.gamepasses = storeState.gamepasses;
					break;
				}
				case "claimGroupReward": {
					playerData.boosts = storeState.boosts;
					playerData.index = storeState.index;
					break;
				}
				case "claimMastery": {
					playerData.petMastery = storeState.petMastery;
					break;
				}
				case "claimVIPReward": {
					playerData.boosts = storeState.boosts;
					playerData.index = storeState.index;
					break;
				}
				case "createPetTeam": {
					playerData.petTeams = storeState.petTeams;
					break;
				}
				case "deletePet": {
					playerData.pets.filter((pet) => !action.pets.includes(pet.guid));
					playerData.petTeams = storeState.petTeams;
					break;
				}
				case "deletePetTeam": {
					playerData.petTeams = storeState.petTeams;
					break;
				}
				case "enhancePet": {
					warn(`Enhance pet saving has not been implemented`);
					break;
				}
				case "equipPets": {
					playerData.pets.map((pet) => {
						const shouldBeEquipped = action.pets.some((p) => p.guid === pet.guid && p.enabled);
						const shouldBeUnequipped = action.unequipAll || action.pets.some((p) => p.guid === pet.guid && !p.enabled);

						if (shouldBeEquipped) {
							return { ...pet, equipped: true };
						} else if (shouldBeUnequipped) {
							return { ...pet, equipped: false };
						}

						return pet;
					});
					break;
				}
				case "equipTalisman": {
					playerData.currentTalisman = storeState.currentTalisman;
					break;
				}
				case "equipTitle": {
					playerData.title = storeState.title;
					break;
				}
				case "equipWeapon": {
					playerData.currentTalisman = storeState.currentTalisman;
					break;
				}
				case "killNpc": {
					playerData.bans = storeState.bans;
					playerData.currencies = storeState.currencies;
					playerData.experience = storeState.experience;
					playerData.talismans = storeState.talismans;
					playerData.weapons = storeState.weapons;

					playerData.pets.map((pet) => {
						if (!pet.equipped) {
							return pet;
						}

						return { ...pet, bans: pet.bans + 1 * math.ceil(action.petExperienceMultiplier) };
					});
					break;
				}
				case "lockPets": {
					playerData.pets.map((pet) => {
						const petToLock = action.pets.find((p) => p.guid === pet.guid);
						if (petToLock) {
							return { ...pet, locked: petToLock.enabled };
						}
						return pet;
					});
					break;
				}
				case "logGameVersion": {
					playerData.index.gameVersion = storeState.index.gameVersion;
					break;
				}
				case "purchasePetTeam": {
					playerData.petTeams = storeState.petTeams;
					break;
				}
				case "purchaseTalisman": {
					playerData.talismans = storeState.talismans;
					break;
				}
				case "purchaseWeapon": {
					playerData.weapons = storeState.weapons;
					break;
				}
				case "redeemCode": {
					playerData.media.codes = storeState.media.codes;
					break;
				}
				case "redeemQuest": {
					warn(`[Saving Middleware] - Redeeming a quest is not implemented`);
					break;
				}
				case "removeTradeLog": {
					playerData.tradeLogs = storeState.tradeLogs;
					break;
				}
				case "saveTrade": {
					playerData.tradeLogs = storeState.tradeLogs;
					break;
				}
				case "setGroupRank": {
					playerData.index.groupRank = storeState.index.groupRank;
					break;
				}
				case "storeBoost": {
					playerData.boosts = storeState.boosts;
					break;
				}
				case "toggleAuto": {
					playerData.settings.gameplay.autoHatch = storeState.settings.gameplay.autoHatch;
					break;
				}
				case "toggleButtonClickSounds": {
					playerData.settings.sound.buttonClick = storeState.settings.sound.buttonClick;
					break;
				}
				case "toggleEasyLegendariesDelete": {
					playerData.settings.autoDelete.easyLegendaries = storeState.settings.autoDelete.easyLegendaries;
					break;
				}
				case "toggleGraphics": {
					playerData.settings.visual.graphicsQuality = storeState.settings.visual.graphicsQuality;
					break;
				}
				case "toggleMasteryCosmetic": {
					warn(`[Saving Middleware] - Saving mastery cosmetic is not implemented.`);
					break;
				}
				case "toggleMusicVolume": {
					playerData.settings.sound.music = storeState.settings.sound.music;
					break;
				}
				case "togglePetAnimationType": {
					playerData.settings.visual.petAnimationType = storeState.settings.visual.petAnimationType;
					break;
				}
				case "togglePetsDisplayed": {
					playerData.settings.visual.petsDisplayed = storeState.settings.visual.petsDisplayed;
					break;
				}
				case "togglePetsStudsOfDistance": {
					playerData.settings.visual.petsStudsOfDistance = storeState.settings.visual.petsStudsOfDistance;
					break;
				}
				case "togglePublicInventory": {
					playerData.settings.privacy.publicInventory = storeState.settings.privacy.publicInventory;
					break;
				}
				case "togglePublicTradeHistory": {
					playerData.settings.privacy.publicTradeHistory = storeState.settings.privacy.publicTradeHistory;
					break;
				}
				case "toggleRarityDelete": {
					playerData.settings.autoDelete.rarities[action.rarity] =
						storeState.settings.autoDelete.rarities[action.rarity];
					break;
				}
				case "toggleSoundEffectsVolume": {
					playerData.settings.sound.soundEffects = storeState.settings.sound.soundEffects;
					break;
				}
				case "toggleTimeOfDay": {
					playerData.settings.visual.timeOfDay = storeState.settings.visual.timeOfDay;
					break;
				}
				case "toggleTradesEnabled": {
					playerData.settings.privacy.tradesEnabled = storeState.settings.privacy.tradesEnabled;
					break;
				}
				case "toggleWalkSpeed": {
					playerData.settings.gameplay.walkSpeed = storeState.settings.gameplay.walkSpeed;
					break;
				}
				case "unequipTalisman": {
					playerData.currentTalisman = storeState.currentTalisman;
					break;
				}
				case "unequipWeapon": {
					playerData.currentWeapon = storeState.currentWeapon;
					break;
				}
				case "unlockRank": {
					playerData.rank = storeState.rank;
					break;
				}
				case "unlockWorld": {
					playerData.worlds = storeState.worlds;
					break;
				}
				case "unlockZone": {
					const worldData = playerData.worlds.find((world) => world.name === action.worldName);
					if (worldData === undefined) {
						warn(
							`[Saving Middleware] - Unable to save unlocked zone for player ${player.Name}, since they don't own the world the zone is from. Zone name: ${action.zoneName}`,
						);
						break;
					}
					worldData.zones = [...worldData.zones, action.zoneName];

					break;
				}
				case "updateTeamName": {
					playerData.petTeams = storeState.petTeams;
					break;
				}
				case "updateWheelTime": {
					playerData.spinWheel = storeState.spinWheel;
					break;
				}
				case "updateWheelUses": {
					playerData.spinWheel = storeState.spinWheel;
					break;
				}
				case "useBoosts": {
					playerData.boosts = storeState.boosts;
					break;
				}
				case "verifyDiscord": {
					warn(`Saving verified discord has not been implemented.`);
					break;
				}
				default: {
					throw new UnreachableCaseError(action);
				}
			}

			return result;
		};
	};
};
