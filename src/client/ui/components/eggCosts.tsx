import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { EGGS } from "shared/configs/eggs";
import { getEggCost } from "shared/util/getEggCost";

import { EggCostDisplay } from "../elements/eggCostDisplay";

/* eslint-disable jsdoc/require-jsdoc */
export function EggCost(): Roact.Element {
	return (
		<frame Visible={false}>
			{Object.entries(EGGS).map(([eggName]) => {
				const eggModel = Workspace.interactions.eggs[eggName];

				const eggCostRegular = getEggCost(eggName, false);
				const eggCostVoid = getEggCost(eggName, true);

				return (
					<frame Visible={false}>
						<EggCostDisplay
							adornee={eggModel.regular.cost}
							cost={eggCostRegular.amount}
							currency={eggCostRegular.currencyType}
							isVoid={false}
						/>
						<EggCostDisplay
							adornee={eggModel.void.cost}
							cost={eggCostVoid.amount}
							currency={eggCostVoid.currencyType}
							isVoid={true}
						/>
					</frame>
				);
			})}
		</frame>
	);
}
