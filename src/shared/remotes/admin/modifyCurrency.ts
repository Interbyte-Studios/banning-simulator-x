import Net from "@rbxts/net";
import { Currency } from "shared/configs/currencies";

export const admin_ModifyCurrencyDefinition = Net.Definitions.ClientToServerEvent<
	[targetPlayerId: number, currency: Currency, amount: number]
>([]);
export type Admin_ModifyCurrencyDefinition = typeof admin_ModifyCurrencyDefinition;
