import { CollectionService } from "@rbxts/services";

const collectionTag = "InventoryGridLayout";
const unscaledCollectionTag = "UnscaledInventoryGridLayout";
let rowSize = 5;

/**
 * @param action The action to change the row size.
 */
export function setPetItemRowSize(action: "shrink" | "expand"): void {
	rowSize = action === "shrink" ? 5 : 7;

	const taggedLayouts = CollectionService.GetTagged(collectionTag);
	taggedLayouts.forEach((uiGridLayout) => {
		if (uiGridLayout.IsA("UIGridLayout")) {
			uiGridLayout.FillDirectionMaxCells = rowSize;
		}
	});
}

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

	const scrollingFrame = uiGridLayout.Parent;
	if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
		setOffset(uiGridLayout);
		scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
		uiGridLayout.GetPropertyChangedSignal("FillDirectionMaxCells").Connect(() => {
			setOffset(uiGridLayout);
		});
	}
});

const taggedLayouts = CollectionService.GetTagged(collectionTag);
taggedLayouts.forEach((uiGridLayout) => {
	if (uiGridLayout.IsA("UIGridLayout")) {
		setOffset(uiGridLayout);

		const scrollingFrame = uiGridLayout.Parent;
		if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
			setOffset(uiGridLayout);
			scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
			uiGridLayout.GetPropertyChangedSignal("FillDirectionMaxCells").Connect(() => {
				setOffset(uiGridLayout);
			});
		}
	}
});

CollectionService.GetInstanceAddedSignal(unscaledCollectionTag).Connect((uiGridLayout) => {
	if (!uiGridLayout.IsA("UIGridLayout")) {
		return;
	}

	const scrollingFrame = uiGridLayout.Parent;
	if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
		setOffset(uiGridLayout);
		scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
	}
});

const unscaledTaggedLayouts = CollectionService.GetTagged(unscaledCollectionTag);
unscaledTaggedLayouts.forEach((uiGridLayout) => {
	if (uiGridLayout.IsA("UIGridLayout")) {
		setOffset(uiGridLayout);

		const scrollingFrame = uiGridLayout.Parent;
		if (scrollingFrame !== undefined && scrollingFrame.IsA("ScrollingFrame")) {
			setOffset(uiGridLayout);
			scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => setOffset(uiGridLayout));
		}
	}
});
