/// <reference types="@rbxts/testez/globals" />

import { HttpService } from "@rbxts/services";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import {
	deserializePetIndexState,
	PetIndexState,
	SerializedPetIndexState,
	serializePetIndexState,
} from "shared/rodux/playerIndex/pets";

const serialized: SerializedPetIndexState = [
	{
		petId: 42,
		fused: { void: 0, radiant: 1 },
		maxLevel: {
			void: {
				cachedMaxLevel: new Set([
					"6535a40f-6ad3-4b0d-855a-e7feee966116",
					"245fe6f8-d4f2-40d4-8e92-54a6bbcf9ad0",
					"c618373a-3123-4201-a08c-6b6e62f6a1e1",
				]),
				amount: 3,
			},
			radiant: { cachedMaxLevel: new Set(["a2f44d85-3cf7-458b-8064-49ebb175de3a"]), amount: 1 },
			regular: { cachedMaxLevel: new Set(), amount: 0 },
		},
		hatched: { void: 9, regular: 0 },
	},
	{
		petId: 43,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set(["7f994cc1-a7b4-49ff-93e3-5227620046d5"]), amount: 1 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 1, regular: 0 },
	},
	{
		petId: 40,
		fused: { void: 0, radiant: 1 },
		maxLevel: {
			void: {
				cachedMaxLevel: new Set(["c5c2c450-bde2-4670-b848-c681c3698438", "e8e88103-25b0-4e12-b404-cf2ad15068d8"]),
				amount: 2,
			},
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 16, regular: 0 },
	},
	{
		petId: 41,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: {
				cachedMaxLevel: new Set([
					"4f1269a0-8f3a-417a-87dc-f5345eb503c6",
					"6789305e-bbba-4b4d-9c01-f8d77acd6a08",
					"50f4ac2f-6480-4f6c-813a-22564c586703",
					"a95cf022-dc34-4825-8f4e-eed0782d5139",
				]),
				amount: 2011,
			},
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 10, regular: 0 },
	},
	{
		petId: 36,
		hatched: { void: 1813, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 37,
		hatched: { void: 1767, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 34,
		hatched: { void: 2666, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 35,
		hatched: { void: 1802, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 39,
		fused: { void: 0, radiant: 1 },
		maxLevel: {
			void: {
				cachedMaxLevel: new Set(["e6561c68-8322-4493-adb5-0f0260f9ecc2", "712d2da0-d881-4a74-954f-403891338771"]),
				amount: 2,
			},
			radiant: { cachedMaxLevel: new Set(["120a1c79-193a-4de0-8847-f35838685fa2"]), amount: 1 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 66, regular: 0 },
	},
	{
		petId: 38,
		fused: { void: 0, radiant: 1 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set(["b79f3933-2671-45e6-a946-424eb97c616f"]), amount: 1 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 91, regular: 0 },
	},
	{
		petId: 10001,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 0, regular: 1 },
	},
	{
		petId: 18,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 2, regular: 0 },
	},
	{
		petId: 19,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 1, regular: 0 },
	},
	{
		petId: 10002,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 0, regular: 1 },
	},
	{
		petId: 16,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 2, regular: 0 },
	},
	{
		petId: 17,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 1, regular: 0 },
	},
	{
		petId: 25,
		hatched: { void: 18, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 15,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 1, regular: 0 },
	},
	{
		petId: 27,
		hatched: { void: 6, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 26,
		hatched: { void: 19, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 1 },
	},
	{
		petId: 28,
		hatched: { void: 1, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 24,
		hatched: { void: 22, regular: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		fused: { void: 0, radiant: 0 },
	},
	{
		petId: 8,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 2, regular: 0 },
	},
	{
		petId: 10,
		fused: { void: 0, radiant: 0 },
		maxLevel: {
			void: { cachedMaxLevel: new Set([]), amount: 0 },
			radiant: { cachedMaxLevel: new Set([]), amount: 0 },
			regular: { cachedMaxLevel: new Set([]), amount: 0 },
		},
		hatched: { void: 1, regular: 0 },
	},
];

const deserialized: PetIndexState = new Map([
	[
		42,
		{
			fused: { void: 0, radiant: 1 },
			maxLevel: {
				void: {
					cachedMaxLevel: new Set([
						"6535a40f-6ad3-4b0d-855a-e7feee966116",
						"245fe6f8-d4f2-40d4-8e92-54a6bbcf9ad0",
						"c618373a-3123-4201-a08c-6b6e62f6a1e1",
					]),
					amount: 3,
				},
				radiant: { cachedMaxLevel: new Set(["a2f44d85-3cf7-458b-8064-49ebb175de3a"]), amount: 1 },
				regular: { cachedMaxLevel: new Set(), amount: 0 },
			},
			hatched: { void: 9, regular: 0 },
		},
	],
	[
		43,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set(["7f994cc1-a7b4-49ff-93e3-5227620046d5"]), amount: 1 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 1, regular: 0 },
		},
	],
	[
		40,
		{
			fused: { void: 0, radiant: 1 },
			maxLevel: {
				void: {
					cachedMaxLevel: new Set(["c5c2c450-bde2-4670-b848-c681c3698438", "e8e88103-25b0-4e12-b404-cf2ad15068d8"]),
					amount: 2,
				},
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 16, regular: 0 },
		},
	],
	[
		41,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: {
					cachedMaxLevel: new Set([
						"4f1269a0-8f3a-417a-87dc-f5345eb503c6",
						"6789305e-bbba-4b4d-9c01-f8d77acd6a08",
						"50f4ac2f-6480-4f6c-813a-22564c586703",
						"a95cf022-dc34-4825-8f4e-eed0782d5139",
					]),
					amount: 2011,
				},
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 10, regular: 0 },
		},
	],
	[
		36,
		{
			hatched: { void: 1813, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		37,
		{
			hatched: { void: 1767, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		34,
		{
			hatched: { void: 2666, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		35,
		{
			hatched: { void: 1802, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		39,
		{
			fused: { void: 0, radiant: 1 },
			maxLevel: {
				void: {
					cachedMaxLevel: new Set(["e6561c68-8322-4493-adb5-0f0260f9ecc2", "712d2da0-d881-4a74-954f-403891338771"]),
					amount: 2,
				},
				radiant: { cachedMaxLevel: new Set(["120a1c79-193a-4de0-8847-f35838685fa2"]), amount: 1 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 66, regular: 0 },
		},
	],
	[
		38,
		{
			fused: { void: 0, radiant: 1 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set(["b79f3933-2671-45e6-a946-424eb97c616f"]), amount: 1 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 91, regular: 0 },
		},
	],
	[
		10001,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 0, regular: 1 },
		},
	],
	[
		18,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 2, regular: 0 },
		},
	],
	[
		19,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 1, regular: 0 },
		},
	],
	[
		10002,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 0, regular: 1 },
		},
	],
	[
		16,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 2, regular: 0 },
		},
	],
	[
		17,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 1, regular: 0 },
		},
	],
	[
		25,
		{
			hatched: { void: 18, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		15,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 1, regular: 0 },
		},
	],
	[
		27,
		{
			hatched: { void: 6, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		26,
		{
			hatched: { void: 19, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 1 },
		},
	],
	[
		28,
		{
			hatched: { void: 1, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		24,
		{
			hatched: { void: 22, regular: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			fused: { void: 0, radiant: 0 },
		},
	],
	[
		8,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 2, regular: 0 },
		},
	],
	[
		10,
		{
			fused: { void: 0, radiant: 0 },
			maxLevel: {
				void: { cachedMaxLevel: new Set([]), amount: 0 },
				radiant: { cachedMaxLevel: new Set([]), amount: 0 },
				regular: { cachedMaxLevel: new Set([]), amount: 0 },
			},
			hatched: { void: 1, regular: 0 },
		},
	],
]);

export = (): void => {
	describe("rodux/playerIndex/pets", () => {
		it("should serialize correctly", () => {
			assertDeepEqual(serializePetIndexState(deserialized), serialized);
		});

		it("should deserialize correctly", () => {
			assertDeepEqual(deserializePetIndexState(serialized), deserialized);
		});

		it("should save correctly", () => {
			// attempt to perform round-trips
			// we first serialize the state and encode it
			// we then decode it and deserialize it
			// this should remain the same
			assertDeepEqual(
				deserializePetIndexState(
					HttpService.JSONDecode(
						HttpService.JSONEncode(serializePetIndexState(deserialized)),
					) as SerializedPetIndexState,
				),
				deserialized,
			);
		});
	});
};
