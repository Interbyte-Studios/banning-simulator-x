import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { hooks } from "client/ui/hooks";
import { EGGS, isEventEgg } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { EggsState } from "shared/rodux/eggs";
import { getEggCost } from "shared/util/getEggCost";
import { getEggsMastery } from "shared/util/getEggsMastery";

import { EggCostDisplay } from "./eggCostDisplay";

interface EggCostMappedProps {
	eggs: EggsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): EggCostMappedProps {
	return {
		eggs: state.eggs,
	};
}

/**
 * Creates an egg cost component for every egg in the game.
 *
 * @returns A roact element.
 */
export const EggCost = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggCostMappedProps) => {
		return (
			<BaseFrame>
				<>
					{Object.entries(EGGS).map(([eggName, eggData]) => {
						if (!eggData.hatchable) {
							return <></>;
						}
						const eggModel = Workspace.interactions.eggs[eggName];
						const regularCost = eggModel.regular.FindFirstChild("cost") as BasePart;

						// find reduced egg cost provided by player mastery
						const eggMasteryReducedMultiplier = getEggsMastery(props.eggs).reducedEggCostMultiplier;
						const eggCostRegular = getEggCost(eggName, false, eggMasteryReducedMultiplier);

						if (isEventEgg(eggName)) {
							return (
								<>
									{regularCost !== undefined && (
										<EggCostDisplay
											adornee={regularCost}
											cost={eggCostRegular.amount}
											currency={eggCostRegular.currencyType}
											isVoid={false}
										/>
									)}
								</>
							);
						}

						const voidCost = eggModel.void.FindFirstChild("cost") as BasePart;
						const eggCostVoid = getEggCost(eggName, true, eggMasteryReducedMultiplier);

						return (
							<>
								{regularCost !== undefined && (
									<EggCostDisplay
										adornee={regularCost}
										cost={eggCostRegular.amount}
										currency={eggCostRegular.currencyType}
										isVoid={false}
									/>
								)}
								{voidCost !== undefined && (
									<EggCostDisplay
										adornee={voidCost}
										cost={eggCostVoid.amount}
										currency={eggCostVoid.currencyType}
										isVoid={true}
									/>
								)}
							</>
						);
					})}
				</>
			</BaseFrame>
		);
	}),
);
