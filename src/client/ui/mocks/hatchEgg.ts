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
				variant: "regular",
				tradeLocked: false,
			},
			{
				autoDeleted: false,
				id: 2,
				guid: "2",
				variant: "regular",
				tradeLocked: false,
			},
			{
				autoDeleted: false,
				id: 3,
				guid: "3",
				variant: "regular",
				tradeLocked: false,
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
				variant: "void",
				tradeLocked: false,
			},
		],
	},
	// double hatch
	{
		success: true,
		pets: [
			{
				id: 2,
				guid: "2",
				autoDeleted: false,
				variant: "void",
				tradeLocked: false,
			},
			{
				id: 3,
				guid: "3",
				autoDeleted: false,
				variant: "regular",
				tradeLocked: false,
			},
		],
	},
	// triple hatch with auto deleted
	{
		success: true,
		pets: [
			{
				id: 2,
				guid: "2",
				autoDeleted: false,
				variant: "void",
				tradeLocked: false,
			},
			{
				id: 3,
				guid: "3",
				autoDeleted: true,
				variant: "regular",
				tradeLocked: false,
			},
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
