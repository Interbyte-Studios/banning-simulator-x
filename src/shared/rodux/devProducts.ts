import Rodux from "@rbxts/rodux";

export type DevProductState = Array<{ productId: number; purchaseId: string }>;
export type DevProductActions = ClaimDevProduct;

interface ClaimDevProduct extends Rodux.Action<"claimDevProduct"> {
	productId: number;
	purchaseId: string;
}

/**
 * @param productId The id of the purchased product.
 * @param purchaseId The unique id of the purchase.
 * @returns The Rodux action to dispatch.
 */
export function claimDevProduct(productId: number, purchaseId: string): ClaimDevProduct & Rodux.AnyAction {
	return {
		type: "claimDevProduct",
		productId,
		purchaseId,
	};
}

export const defaultDevProductState: DevProductState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const devProductReducer = Rodux.createReducer<DevProductState, DevProductActions>(defaultDevProductState, {
	claimDevProduct: (state, action) => {
		return [...state, { productId: action.productId, purchaseId: action.purchaseId }];
	},
});
/* eslint-enable jsdoc/require-jsdoc */
