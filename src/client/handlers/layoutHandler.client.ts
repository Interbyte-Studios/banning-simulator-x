import { CollectionService } from "@rbxts/services";

const collectionTag = "ScaledGridLayout";
const defaultAbsoluteContentSize = new Vector2(696.976, 317.317);

/**
 * @param vector The 2d offset.
 * @returns An average size based on a 2 dimensional size (representing a bounding box).
 */
function getAverageSize(vector: Vector2): number {
	return math.min((vector.X + vector.Y) / 2);
}

const defaultAbsoluteContentSizeAverage = getAverageSize(defaultAbsoluteContentSize);

/**
 * Sets the Offset of a UIGridLayout based on the screen size.
 *
 * @param uiGridLayout The UIGridLayout.
 */
function setOffset(uiGridLayout: UIGridLayout): void {
	if (!uiGridLayout.IsA("UIGridLayout")) {
		return;
	}

	const scrollingFrame = uiGridLayout.Parent;
	assert(scrollingFrame, `Failed to get UIGridLayout parent.`);
	assert(scrollingFrame.IsA("ScrollingFrame"), `Scaled UIGridLayout Parent was not a ScrollingFrame`);

	let defaultCellSize = uiGridLayout.GetAttribute("DefaultCellSize") as UDim2;
	if (defaultCellSize === undefined) {
		uiGridLayout.SetAttribute("DefaultCellSize", uiGridLayout.CellSize);
		defaultCellSize = uiGridLayout.CellSize;
	}

	const absoluteContentSizeAverage = getAverageSize(scrollingFrame.AbsoluteSize);

	let ratio = 1;
	if (absoluteContentSizeAverage > defaultAbsoluteContentSizeAverage) {
		ratio = defaultAbsoluteContentSizeAverage / absoluteContentSizeAverage;
	} else {
		ratio = absoluteContentSizeAverage / defaultAbsoluteContentSizeAverage;
	}

	const cellSize = UDim2.fromOffset(defaultCellSize.X.Offset * ratio, defaultCellSize.Y.Offset * ratio);

	uiGridLayout.CellSize = cellSize;

	warn(`SCALED! Ratio: ${tostring(ratio)}`);
}

CollectionService.GetInstanceAddedSignal(collectionTag).Connect((uiGridLayout) => {
	if (!uiGridLayout.IsA("UIGridLayout")) {
		return;
	}

	setOffset(uiGridLayout);

	const scrollingFrame = uiGridLayout.Parent;
	if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
		scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
	}
});

const taggedLayouts = CollectionService.GetTagged(collectionTag);
taggedLayouts.forEach((uiGridLayout) => {
	if (uiGridLayout.IsA("UIGridLayout")) {
		setOffset(uiGridLayout);

		const scrollingFrame = uiGridLayout.Parent;
		if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
			scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
		}
	}
});
