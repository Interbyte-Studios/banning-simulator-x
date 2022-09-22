/**
 * Welds a primary object with any given number of secondary objects.
 *
 * @param _partsToWeld The parts to weld.
 * @param primaryWeldingPart The part that will be welded to the other parts.
 */
export function weldObject(_partsToWeld: Array<BasePart>, primaryWeldingPart: BasePart): void {
	const partsToWeld = _partsToWeld;
	const holding: Array<BasePart> = [];

	for (const basePart of partsToWeld) {
		if (!basePart.IsA("BasePart")) {
			continue;
		}

		holding.push(basePart);
	}

	if (holding.size() < 2) {
		warn(`Encountered an issue while welding object.`);
		return;
	}

	for (let i = 1; i < holding.size(); i++) {
		const p1 = primaryWeldingPart ?? holding[1];
		const p0 = holding[i - 1];

		const a1 = p1.Anchored;
		const a0 = p0.Anchored;

		p1.Anchored = true;
		p0.Anchored = true;

		const joint = new Instance("Weld");
		joint.Part0 = p1;
		joint.Part1 = p0;
		joint.C0 = p1.CFrame.ToObjectSpace(p0.CFrame);
		joint.C1 = new CFrame();
		joint.Parent = p1;
		joint.Name = p0.Name;

		p1.Anchored = a1;
		p0.Anchored = a0;
	}
}
