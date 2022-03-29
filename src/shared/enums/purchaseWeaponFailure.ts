export enum PurchaseWeaponFailure {
	/**
	 * The weapon the player is attempting to purchase is already owned.
	 */
	AlreadyOwned,

	/**
	 * The player does not have enough currency to purchase the weapon.
	 */
	NotEnoughCurrency,

	/**
	 * The weapon the player is attempting to purchase is not purchaseable.
	 */
	NotPurchaseable,
}
