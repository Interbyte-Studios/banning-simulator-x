import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";

import { ProgressHeader } from "./util/header";
import { ProgressBar } from "./util/progressBar";
import { ViewPets } from "./util/viewPets";

/**
 * Displays the completion percentage of the pets of radiant variant in the specified egg.
 */
export const RadiantEggProgress = hooks((props: { egg: EggName }) => {
	return (
		<>
			<ProgressHeader text={"Radiant Pets"} position={UDim2.fromScale(0.35, 0.85)} />
			<ProgressBar egg={props.egg} position={UDim2.fromScale(0.5, 0.95)} />
			<ViewPets egg={props.egg} variant={"radiant"} position={UDim2.fromScale(0.815, 0.85)} />
		</>
	);
});
