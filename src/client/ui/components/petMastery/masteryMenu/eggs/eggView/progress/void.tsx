import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

import { ProgressHeader } from "./util/header";
import { ProgressBar } from "./util/progressBar";
import { ViewPets } from "./util/viewPets";

/**
 * Displays the completion percentage of the pets of void variant in the specified egg.
 */
export const VoidEggProgress = hooks((props: { egg: EggName; displayPets: (variant: Variants) => void }) => {
	return (
		<>
			<ProgressHeader text={"Void Pets"} position={UDim2.fromScale(0.35, 0.635)} variant={"void"} />
			<ProgressBar egg={props.egg} variant={"void"} position={UDim2.fromScale(0.5, 0.735)} />
			<ViewPets
				egg={props.egg}
				variant={"void"}
				position={UDim2.fromScale(0.815, 0.635)}
				displayPets={props.displayPets}
			/>
		</>
	);
});
