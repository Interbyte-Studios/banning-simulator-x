export interface PetCreated {
	guid: string;
	id: number;
	model: Model;
	owner: Player;
	alignOrientation: AlignOrientation;
	alignPosition: AlignPosition;
	petType: "Walk" | "Fly";
}

interface PlayerAnimationCache {
	player: Player;
	petsDisplayed: BoolValue;
	distance: NumberValue;
	animationType: StringValue;
	pets: Array<PetCreated>;
}
const settingsCache: Array<PlayerAnimationCache> = [];

/**
 * @param player The player to cache settings for.
 * @returns The newly created cache.
 */
export const createPetAnimationCache = (player: Player): PlayerAnimationCache => {
	const playerCache: PlayerAnimationCache = {
		player,
		petsDisplayed: new Instance("BoolValue"),
		distance: new Instance("NumberValue"),
		animationType: new Instance("StringValue"),
		pets: [],
	};
	settingsCache.push(playerCache);
	return playerCache;
};

/**
 * @param player The player to remove cache data for.
 */
export const removePetAnimationCache = (player: Player): void => {
	const cacheIndex = settingsCache.findIndex((cacheData) => cacheData.player === player);
	if (cacheIndex === undefined) {
		warn(`Failed to remove pet animation cache for player ${player.Name}`);
		return;
	}

	settingsCache.unorderedRemove(cacheIndex);
};

/**
 * @returns The current state of the pet animation settings cache.
 */
export const getPetAnimationCache = (): Array<PlayerAnimationCache> => {
	return settingsCache;
};
