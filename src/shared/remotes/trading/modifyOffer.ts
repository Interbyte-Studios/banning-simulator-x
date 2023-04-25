import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import type { PlayerTradeItem } from "server/handlers/trading/trades";
import { isCurrency } from "shared/configs/currencies";

export const modifyOfferDefinition = Net.Definitions.ClientToServerEvent<[newOffer: PlayerTradeItem]>([
	createTypeChecker(
		t.strictInterface({
			pets: t.array(t.string),
			currency: t.optional(
				t.strictInterface({
					type: isCurrency,
					amount: t.numberPositive,
				}),
			),
		}),
	),
]);
export type ModifyOfferDefinition = typeof modifyOfferDefinition;
