import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { Currency, isCurrency } from "shared/configs/currencies";

export const admin_ModifyCurrencyDefinition = Net.Definitions.ClientToServerEvent<
	[targetPlayerId: number, currency: Currency, amount: number]
>([createTypeChecker(t.number, isCurrency, t.number)]);
export type Admin_ModifyCurrencyDefinition = typeof admin_ModifyCurrencyDefinition;
