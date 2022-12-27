import { AsyncServerFunctionDeclaration } from "@rbxts/net/out/definitions/Types";
import { HatchEggDefinition } from "shared/remotes/eggs/hatchEgg";

import { fakeFunctionCall } from "./remoteContext/fakeFunctionCall";

let requestIndex = -1;
const results: Array<HatchEggDefinition extends AsyncServerFunctionDeclaration<Array<unknown>, infer P> ? P : never> = [
	// triple egg hatch w no auto delete
	{
		success: true,
		pets: [
			{
				autoDeleted: false,
				id: 1,
				guid: "1",
				rarity: "Basic",
				variant: "regular",
				method: "hatch",
				egg: "Starter",
			},
			{
				autoDeleted: false,
				id: 2,
				guid: "2",
				rarity: "Basic",
				variant: "regular",
				method: "hatch",
				egg: "Starter",
			},
			{
				autoDeleted: false,
				id: 3,
				guid: "3",
				rarity: "Basic",
				variant: "regular",
				method: "hatch",
				egg: "Starter",
			},
		],
	},
	// failure
	{
		success: false,
	},
	// single hatch
	{
		success: true,
		pets: [
			{
				id: 1,
				guid: "1",
				autoDeleted: false,
				rarity: "Legendary",
				variant: "radiant",
				method: "hatch",
				egg: "Starter",
			},
		],
	},
	// double hatch
	{
		success: true,
		pets: [
			{ id: 2, guid: "2", autoDeleted: false, rarity: "Primordial", variant: "void", method: "hatch", egg: "Starter" },
			{
				id: 3,
				guid: "3",
				autoDeleted: false,
				rarity: "Prismatic",
				variant: "regular",
				method: "hatch",
				egg: "Starter",
			},
		],
	},
	// triple hatch with auto deleted
	{
		success: true,
		pets: [
			{
				id: 1,
				guid: "1",
				autoDeleted: false,
				rarity: "Legendary",
				variant: "radiant",
				method: "hatch",
				egg: "Starter",
			},
			{ id: 2, guid: "2", autoDeleted: false, rarity: "Primordial", variant: "void", method: "hatch", egg: "Starter" },
			{ id: 3, guid: "3", autoDeleted: true, rarity: "Prismatic", variant: "regular", method: "hatch", egg: "Starter" },
		],
	},
];

export const fakeHatchEgg = fakeFunctionCall<HatchEggDefinition>("hatchEgg", () => {
	requestIndex++;
	if (requestIndex === results.size()) {
		requestIndex = -1;
	}

	return results[requestIndex];
});
