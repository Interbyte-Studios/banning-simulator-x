import { CollectionService, Players, RunService, Workspace } from "@rbxts/services";

const player = Players.LocalPlayer;
const normalTag = "Normal_UIStroke";
const billboardTag = "Billboard_UIStroke";

const camera = Workspace.CurrentCamera;

const screenSize = new Vector2(1273, 809);

/**
 * @param vector The 2d offset.
 * @returns An average size based on a 2 dimensional size (representing a bounding box).
 */
function getAverageSize(vector: Vector2): number {
	return math.min((vector.X + vector.Y) / 2);
}

/**
 * @returns The ratio of the current viewport size to studio viewport size.
 */
function getScreenRatio(): number {
	if (camera === undefined) {
		return getAverageSize(screenSize);
	}

	return getAverageSize(camera.ViewportSize) / getAverageSize(screenSize);
}

/**
 * @param instance The instance to get the difference in position for.
 * @returns The position of the instance.
 */
function getInstancePosition(instance: Instance): Vector3 {
	if (instance.IsA("BasePart")) {
		return instance.Position;
	} else if (instance.IsA("Model")) {
		const [cframe] = instance.GetBoundingBox();
		return cframe.Position;
	}

	return new Vector3(0, 0, 0);
}

const studioAverage = getAverageSize(screenSize);

/**
 * Sets the thickness of a ui stroke object based on a general resolution.
 *
 * @param uiStroke The ui stroke object.
 * @param isBillboardStroke Whether or not the stroke is descendant of a billboard gui.
 */
function setThickness(uiStroke: UIStroke, isBillboardStroke: boolean): void {
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

	if (isBillboardStroke) {
		const billboardGui = uiStroke.FindFirstAncestorWhichIsA("BillboardGui");
		if (billboardGui !== undefined) {
			const adornee = billboardGui.Adornee;
			if (adornee === undefined) {
				return;
			}

			const origin = getInstancePosition(adornee);
			const magnitude = camera.CFrame.Position.sub(origin).Magnitude;
			const distanceRatio = 10 / magnitude;

			uiStroke.Thickness = defaultThickness * distanceRatio * getScreenRatio();

			return;
		}
	}

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

		setThickness(uistroke, false);
	}
}

/**
 * Updates the thickness of UIStrokes that are descendant of BillboardGuis.
 */
function updateBillboardStrokes(): void {
	const billboardStrokes = CollectionService.GetTagged(billboardTag);
	for (const uistroke of billboardStrokes) {
		if (!uistroke.IsA("UIStroke")) {
			continue;
		}

		setThickness(uistroke, true);
	}
}

CollectionService.GetInstanceAddedSignal(normalTag).Connect((uiStroke) => {
	if (!uiStroke.IsA("UIStroke")) {
		return;
	}

	setThickness(uiStroke, false);
});

CollectionService.GetInstanceAddedSignal(billboardTag).Connect((uiStroke) => {
	if (!uiStroke.IsA("UIStroke")) {
		return;
	}

	setThickness(uiStroke, true);
});

camera?.GetPropertyChangedSignal("ViewportSize").Connect(() => updateNormalStrokes());

let lastMagnitudeCheck: number;
let lastTimeCheck = 0;
RunService.RenderStepped.Connect(() => {
	const now = time();
	if (now - lastTimeCheck < 0.2) {
		return;
	}
	lastTimeCheck = now;

	if (camera === undefined) {
		return;
	}

	const character = player.Character;
	if (character === undefined) {
		return;
	}

	const head = character.FindFirstChild("Head") as BasePart;
	if (head === undefined) {
		return;
	}

	const magnitude = head.CFrame.Position.sub(camera.CFrame.Position).Magnitude;
	if (magnitude === lastMagnitudeCheck) {
		return;
	}
	lastMagnitudeCheck = magnitude;

	updateBillboardStrokes();
});
