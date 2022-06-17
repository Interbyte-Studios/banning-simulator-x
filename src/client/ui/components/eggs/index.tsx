import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { StoreState } from "shared/rodux";

import { hooks } from "../../hooks";
import { EggCost } from "./eggCosts";
import { EggHatch } from "./eggHatch";
import { EggHud } from "./eggHud";

interface EggUIProps extends EggUIMappedProps {
	player: Player;
}
interface EggUIMappedProps {}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): EggUIMappedProps {
	return {};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EggsUI = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggUIProps, { useState, useEffect }) => {
		useEffect(() => {});

		return (
			<frame BackgroundTransparency={1}>
				<EggCost />
				<EggHud />
				<EggHatch eggName={undefined} isVoid={undefined} pets={undefined} />
			</frame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
