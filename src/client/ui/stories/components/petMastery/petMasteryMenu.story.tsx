import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { PetMasteryMenu } from "client/ui/components/petMastery/masteryMenu";
import { EggName } from "shared/configs/eggs";

import { createMockStory } from "../../createMockStory";

export = (target: GuiBase): (() => void) => {
	const { cleanup } = createMockStory(
		{
			index: {
				pets: new Map<
					number,
					{
						hatched: {
							regular: number;
							void: number;
						};
						fused: {
							void: number;
							radiant: number;
						};
						maxLevel: {
							regular: number;
							void: number;
							radiant: number;
						};
					}
				>([
					[
						1,
						{
							hatched: {
								regular: 5000,
								void: 50,
							},
							fused: {
								void: 5,
								radiant: 5,
							},
							maxLevel: {
								regular: 5,
								void: 5,
								radiant: 5,
							},
						},
					],
				]),
				eggs: new Map<EggName, { regular: number; void: number }>([["Starter", { regular: 50000, void: 50000 }]]),
			},
		},
		target,
		(_, store) => (
			<RoactRodux.StoreProvider store={store}>
				<PetMasteryMenu world={"Ban Land"} hideMenu={(): void => {}} />
			</RoactRodux.StoreProvider>
		),
	);
	return () => {
		cleanup();
	};
};
