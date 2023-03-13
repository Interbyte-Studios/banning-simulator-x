import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { RightComponentHeader } from "../util/rightComponentHeader";

interface TradeHistoryProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * Displays a players trade history.
 */
export const TradeHistory = hooks((props: TradeHistoryProps) => {
	return (
		<>
			<RightComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Trades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		</>
	);
});
