import { CollectionService } from "@rbxts/services";

const collectionTag = "ScaledGridLayout";

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

	const offset =
		(scrollingFrame.AbsoluteSize.X - uiGridLayout.CellPadding.X.Offset * uiGridLayout.FillDirectionMaxCells) /
		uiGridLayout.FillDirectionMaxCells;

	uiGridLayout.CellSize = UDim2.fromOffset(offset, offset);
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
