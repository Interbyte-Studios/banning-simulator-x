import Roact from "@rbxts/roact";
import { TALISMAN_PHASES, TalismanPhases } from "shared/configs/talismans";

/**
 * A ui gradient component which has its gradient colors set depending on the specified phase.
 *
 * @param props The properties of the rarity gradient.
 * @param props.phase The phase of the talisman.
 * @returns A Roact component.
 */
export function TalismanGradient(props: { phase: TalismanPhases }): Roact.Element {
	const phaseData = TALISMAN_PHASES.find((phase) => phase.phase === props.phase);
	assert(phaseData, `Failed to get talisman data for phase "${props.phase}".`);

	if (phaseData.gradient === undefined) {
		return <></>;
	}

	const talismanColorSequence = new ColorSequence([
		new ColorSequenceKeypoint(0, phaseData.gradient.beginningColor),
		new ColorSequenceKeypoint(1, phaseData.gradient.endingColor),
	]);

	return <uigradient Color={talismanColorSequence} Rotation={-90} />;
}
