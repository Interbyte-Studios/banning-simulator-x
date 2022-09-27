import { Players, RunService, Workspace } from "@rbxts/services";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

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

	uiStroke.Thickness = screenAverage * ratio;
}

/**
 * Iterates through all ui strokes and set's their properties.
 *
 * @param onlyBillboards Determines whether or not only ui strokes descendant of a billboard gui should be updated.
 */
function updateStrokes(onlyBillboards: boolean): void {
	for (const uiStroke of playerGui.GetDescendants()) {
		if (onlyBillboards) {
			if (uiStroke.FindFirstAncestorWhichIsA("BillboardGui") === undefined) {
				continue;
			}
		}

		if (!uiStroke.IsA("UIStroke")) {
			continue;
		}

		setThickness(uiStroke);
	}
}

updateStrokes(false);

playerGui.DescendantAdded.Connect((uiStroke) => {
	if (!uiStroke.IsA("UIStroke")) {
		return;
	}

	setThickness(uiStroke);
});

camera?.GetPropertyChangedSignal("ViewportSize").Connect(() => {
	updateStrokes(false);
});

let lastCheck: number;
RunService.RenderStepped.Connect(() => {
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
	if (magnitude === lastCheck) {
		return;
	}
	lastCheck = magnitude;

	updateStrokes(true);
});
