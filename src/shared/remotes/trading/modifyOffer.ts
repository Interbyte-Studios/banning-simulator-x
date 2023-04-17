import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import type { Trading } from "server/handlers/trading/trades";

export const modifyOfferDefinition = Net.Definitions.ClientToServerEvent<[newOffer: Trading["items"][number]["items"]]>(
	[createTypeChecker(t.array(t.string))],
);
export type ModifyOfferDefinition = typeof modifyOfferDefinition;
