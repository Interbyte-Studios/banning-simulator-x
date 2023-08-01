debug.setmemorycategory("enhancePet");
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { rollEnhancement } from "server/modules/pets/rollEnhancement";
import { ENHANCEMENT_BASE_COSTS, EnhancePetMetadata } from "shared/configs/enchantments";
import { remotes } from "shared/remotes";
import { EnhancePetFailKind } from "shared/remotes/pets/enhancePet";
import { enhancePet } from "shared/rodux/pets";
import { getEggData } from "shared/util/getEggData";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getZoneData } from "shared/util/getZoneData";

remotes.Server.GetNamespace("pets")
	.Get("enhancePet")
	.SetCallback(
		withPlayerStore((_, store, guid, id, variant) => {
			const currentState = store.getState();

			// check to be sure player owns pet
			const pet = currentState.pets.find((pet) => pet.guid === guid);
			if (pet === undefined) {
				return {
					success: false,
					reason: EnhancePetFailKind.PetDoesNotExist,
				};
			}

			// check that the desired variant slot can be enhanced
			if (pet.variant === "void" && variant === "radiant") {
				return {
					success: false,
					reason: EnhancePetFailKind.RaritySlotUnavailable,
				};
			} else if ((pet.variant === "regular" && variant === "void") || variant === "radiant") {
				return {
					success: false,
					reason: EnhancePetFailKind.RaritySlotUnavailable,
				};
			}

			// check to be sure player has enough currency to purchase enhancement
			const eggName = getEggNameFromPetId(id);
			const eggData = getEggData(eggName);

			let enhancementCost: number | undefined;
			if (eggData.world === "Limited" || eggData.zone === "Limited") {
				enhancementCost = ENHANCEMENT_BASE_COSTS.pets[variant].baseCost;
			} else {
				const zoneData = getZoneData(eggData.world, eggData.zone);

				const scalingNPC = zoneData.npcs.find((npc) => npc.isBoss !== false);
				if (scalingNPC === undefined) {
					warn(`Failed to enhance pet of id: "${id}". Could not get the boss npc.`);
					return {
						success: false,
						reason: EnhancePetFailKind.InternalError,
					};
				}

				enhancementCost = scalingNPC.reward.currency * ENHANCEMENT_BASE_COSTS.pets[variant].bossesBanned;
			}

			if (currentState.currencies.gems < enhancementCost) {
				return {
					success: false,
					reason: EnhancePetFailKind.NotEnoughCurrency,
				};
			}

			// roll enhancement
			const rolledEnhancement = rollEnhancement(variant);
			if (rolledEnhancement === undefined) {
				warn(`Failed to roll "${variant}" enhancement for pet with id: "${id}"`);
				return {
					success: false,
					reason: EnhancePetFailKind.InternalError,
				};
			}

			const enhancementData: EnhancePetMetadata = {
				category: rolledEnhancement.category,
				rarity: rolledEnhancement.rarity,
				variant,
			};

			store.dispatch(enhancePet(guid, enhancementData, enhancementCost));

			return {
				success: true,
			};
		}),
	);
