// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

import { ProgressHeader } from "./util/header";
import { ProgressBar } from "./util/progressBar";
import { ViewPets } from "./util/viewPets";

/**
 * Displays the completion percentage of the pets of regular variant in the specified egg.
 */
export const RegularEggProgress = hooks((props: { egg: EggName; displayPets: (variant: Variants) => void }) => {
	return (
		<>
			<ProgressHeader text={"Regular Pets"} position={UDim2.fromScale(0.35, 0.425)} variant={"regular"} />
			<ProgressBar egg={props.egg} variant={"regular"} position={UDim2.fromScale(0.5, 0.525)} />
			<ViewPets
				egg={props.egg}
				variant={"regular"}
				position={UDim2.fromScale(0.815, 0.425)}
				displayPets={props.displayPets}
			/>
		</>
	);
});
