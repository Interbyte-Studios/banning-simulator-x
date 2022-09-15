import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";
import { Store } from "shared/rodux";
import { codeData, redeemCode } from "shared/rodux/media";

const validCodes: Array<codeData> = [
	{
		name: "Test",
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
