import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { RightComponentHeader } from "../util/rightComponentHeader";

interface MasteryProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * A mastery section showing the player's mastery of the game.
 */
export const Mastery = hooks((props: MasteryProps) => {
	return (
		<>
			<RightComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Mastery`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		</>
	);
});
