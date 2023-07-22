import Roact from "@rbxts/roact";

import { TimeTrialsInteractionPrompts } from "./interactPrompt";

interface TimeTrialsProps {
	isVisible: boolean;
	setVisibility: (value: boolean) => void;
}

/**
 * @param props The props for the component.
 * @param props.isVisible Whether the component is visible.
 * @param props.setVisibility The function that will be called when the component should be hidden.
 * @returns The Roact component.
 */
export const TimeTrials = (props: TimeTrialsProps): Roact.Element => {
	if (props.isVisible) {
		return <></>;
	} else {
		return <TimeTrialsInteractionPrompts displayInterface={(): void => props.setVisibility(true)} />;
	}
};
