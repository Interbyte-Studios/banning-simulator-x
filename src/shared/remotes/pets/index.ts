import Net from "@rbxts/net";

import { deletePetsDefinition } from "./deletePets";

export const pets = Net.Definitions.Namespace({
	deletePets: deletePetsDefinition,
});
