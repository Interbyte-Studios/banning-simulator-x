import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";
import { Variants } from "shared/configs/pets";

import { ProgressHeader } from "./util/header";
import { ProgressBar } from "./util/progressBar";
import { ViewPetChallenges } from "./util/viewChallenges";

/**
 * Displays the completion percentage of the challenged of the specified pet.
 */
export const PetChallengeProgress = hooks(
	(props: { pet: number; variant: Variants; displayChallenges: () => void }) => {
		return (
			<>
				<ProgressHeader text={"Mastery Challenges"} />
				<ProgressBar pet={props.pet} variant={props.variant} />
				<ViewPetChallenges displayChallenges={props.displayChallenges} />
			</>
		);
	},
);
