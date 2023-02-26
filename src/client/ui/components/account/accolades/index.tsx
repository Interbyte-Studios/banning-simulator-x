import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { RightComponentHeader } from "../util/rightComponentHeader";

interface AccoladesProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * An accolades section displaying user achievements.
 */
export const Accolades = hooks((props: AccoladesProps) => {
	return (
		<>
			<RightComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Accolades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		</>
	);
});
