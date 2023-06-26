import { CollectionService, Workspace } from "@rbxts/services";

const normalTag = "Normal_UIStroke";

const camera = Workspace.CurrentCamera;

const screenSize = new Vector2(1273, 809);

/**
 * @param vector The 2d offset.
 * @returns An average size based on a 2 dimensional size (representing a bounding box).
 */
function getAverageSize(vector: Vector2): number {
	return math.min((vector.X + vector.Y) / 2);
}

const studioAverage = getAverageSize(screenSize);

/**
 * Sets the thickness of a ui stroke object based on a general resolution.
 *
 * @param uiStroke The ui stroke object.
 */
function setThickness(uiStroke: UIStroke): void {
	if (!uiStroke.IsA("UIStroke")) {
		return;
	}

	if (camera === undefined) {
		return;
	}

	let defaultThickness = uiStroke.GetAttribute("defaultThickness") as number;
	if (defaultThickness === undefined) {
		uiStroke.SetAttribute("defaultThickness", uiStroke.Thickness);
		defaultThickness = uiStroke.Thickness;
	}

	const screenAverage = getAverageSize(camera.ViewportSize);
	const ratio = defaultThickness / studioAverage;

	uiStroke.Thickness = screenAverage * ratio;
}

/**
 * Updates the thickness of UIStrokes not descendant of BillboardGuis.
 */
function updateNormalStrokes(): void {
	const normalStrokes = CollectionService.GetTagged(normalTag);
	for (const uistroke of normalStrokes) {
		if (!uistroke.IsA("UIStroke")) {
			continue;
		}

		setThickness(uistroke);
	}
}

CollectionService.GetInstanceAddedSignal(normalTag).Connect((uiStroke) => {
	if (!uiStroke.IsA("UIStroke")) {
		return;
	}

	setThickness(uiStroke);
});

camera?.GetPropertyChangedSignal("ViewportSize").Connect(() => updateNormalStrokes());
