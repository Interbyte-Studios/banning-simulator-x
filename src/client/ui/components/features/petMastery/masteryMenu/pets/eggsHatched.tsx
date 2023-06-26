// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface EggsHatchedCounterProps extends EggsHatchedCounterMappedProps {
	egg: EggName;
	variant: "regular" | "void";
}

interface EggsHatchedCounterMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggsHatchedCounterMappedProps {
	return {
		index: state.index,
	};
}

/**
 * The "Header" text for the Pet Mastery component, displaying the number of eggs hatched.
 *
 * @returns A roact element.
 */
export const EggsHatchedCounter = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggsHatchedCounterProps) => {
		const eggsHatched = props.index.eggs.get(props.egg);

		const message =
			eggsHatched !== undefined
				? `${twoDpAbbreviator.numberToString(eggsHatched[props.variant])} "${props.egg}" hatched.`
				: `You have not hatched any "${props.egg}" eggs.`;

		return (
			<StrokeTextLabel
				native={{
					Position: new UDim2(0.51, 0, 0.06, 0),
					Size: new UDim2(0.375, 0, 0.1, 0),
					Text: message,
				}}
				stroke={{ native: { Thickness: 3 } }}
			/>
		);
	}),
);
