import { HttpService } from "@rbxts/services";
import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";
import { Store } from "shared/rodux";
import { codeData, redeemCode } from "shared/rodux/media";

const validCodes: Array<codeData> = [
	{
		name: "Release",
		currency: {
			amount: 500,
			name: "gems",
		},
	},
	{
		name: "BanningSimX",
		currency: {
			amount: 750,
			name: "gems",
		},
	},
	{
		name: "Interbyte",
		currency: {
			amount: 750,
			name: "coins",
		},
	},
	{
		name: "FreeCoins",
		currency: {
			amount: 500,
			name: "coins",
		},
	},
	{
		name: "FreeGems",
		currency: {
			amount: 500,
			name: "gems",
		},
	},
	{
		name: "FreeLuck",
		boosts: {
			name: "x2 Hatching Luck",
			time: 15,
		},
	},
	{
		name: "FreeCurrency",
		boosts: {
			name: "x2 Currency",
			time: 15,
		},
	},
	{
		name: "FreePet",
		pet: {
			id: 5,
			guid: HttpService.GenerateGUID(false),
			variant: "void",
		},
	},
	{
		name: "Dungeons",
		boosts: {
			name: "x2 Rank Experience",
			time: 15,
		},
	},
	{
		name: "TimeTrials",
		boosts: {
			name: "x2 Rank Experience",
			time: 15,
		},
	},
	{
		name: "Collection",
		boosts: {
			name: "x2 Hatching Luck",
			time: 15,
		},
	},
	{
		name: "Armor",
		boosts: {
			name: "x2 Currency",
			time: 30,
		},
	},
];

/**
 * Redeems a code.
 *
 * @param store The player store.
 * @param code The code to redeem.
 * @returns Whether or not the code was redeemed.
 */
export function checkRedeemCode(
	store: Store,
	code: string,
): { success: true } | { success: false; reason: RedeemCodeFailKind } {
	const codeData = validCodes.find((c) => c.name === code);
	if (codeData === undefined) {
		return {
			success: false,
			reason: RedeemCodeFailKind.InvalidCode,
		};
	}

	const alreadyRedeemed = store.getState().media.codes.includes(code);
	if (alreadyRedeemed) {
		return {
			success: false,
			reason: RedeemCodeFailKind.AlreadyRedeemed,
		};
	}

	store.dispatch(redeemCode(codeData.name, codeData.currency, codeData.boosts, codeData.pet, codeData.experience));

	return {
		success: true,
	};
}
