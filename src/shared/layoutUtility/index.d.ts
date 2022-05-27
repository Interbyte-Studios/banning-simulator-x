interface LayoutUtil {
	/**
	 * Resizes the ScrollingFrame's CanvasSize based off the size of it's children.
	 */
	ResizeCanvas(): void;
	/**
	 * Resizes the ScrollingFrame's children based off the size of the CanvasSize.
	 *
	 * Calls `ResizeCanvas` internally.
	 */
	ResizeContent(): void;
	/**
	 * Subscribes a series of events to handle the scaling.
	 */
	Bind(): void;
	/**
	 * Destroys all connections that automatically handle the scaling.
	 */
	Unbind(): void;
}

interface LayoutUtilList {
	/**
	 * Changes the default padding.
	 *
	 * @param padding The default padding to apply.
	 */
	SetDefault(padding: UDim): void;
	/**
	 * Adds an object to the resize cache.
	 *
	 * @param object The object to add.
	 */
	AddObject(object: GuiObject): void;
	/**
	 * Removes an object from the resize cache.
	 *
	 * @param object The object to remove.
	 */
	RemoveObject(object: GuiObject): void;
}
interface LayoutUtilGrid {
	/**
	 * Changes the default CellPadding and CellSize.
	 *
	 * @param padding The `CellPadding` to apply.
	 * @param size The `CellSize` to apply.
	 */
	SetDefault(padding: UDim2, size: UDim2): void;
}

interface SharedConfig {
	/**
	 * If instant binding should occur. Defaults to `true`.
	 */
	Bind: boolean;
	/**
	 * If the canvas should be able to be resized. Defaults to `true`.
	 */
	ResizeCanvas: boolean;
	/**
	 * If the content should be able to be resized. Defaults to `true`.
	 */
	ResizeContent: boolean;
	/**
	 * If the layout should update when it is resized. Defaults to `true`.
	 */
	OnResize: boolean;
	/**
	 * If the layout should update when the content size changes. Defaults to `true`.
	 */
	OnWindowResize: boolean;
}

type UIListLayoutConfig = {
	/**
	 * The default padding.
	 */
	Padding: UDim;
	/**
	 * If the layout should update when `FillDirection` changes.
	 */
	OnAxisChange: boolean;
	/**
	 * If objects should be added to the resize cache when parented to the frame.
	 */
	OnAdd: boolean;
	/**
	 * If objects should be removed from the resize cache when ancestry to the frame is lost.
	 */
	OnRemove: boolean;
};
type UIGridLayoutConfig = {
	/**
	 * The default `CellPadding`. Defaults to the `UIGridLayout`'s `CellPadding` property.
	 */
	CellPadding: UDim2;
	/**
	 * The default `CellSize`. Defaults to the `UIGridLayout`'s `CellSize` property.
	 */
	CellSize: UDim2;
};

interface LayoutUtilConstructor {
	/**
	 * Immediately sets up the UILayout's auto-scaling features.
	 */
	new <T extends UIListLayout | UIGridLayout>(
		layout: T & { Parent: ScrollingFrame },
		config?: Partial<SharedConfig> &
			(T extends UIListLayout ? Partial<UIListLayoutConfig> : Partial<UIGridLayoutConfig>),
	): LayoutUtil & (T extends UIListLayout ? LayoutUtilList : LayoutUtilGrid);

	/**
	 * Converts a UILayout's size and padding to scale.
	 *
	 * @param layout The UILayout to convert to scale.
	 */
	ConvertToScale(layout: UIListLayout | UIGridLayout): void;
}

declare const LayoutUtil: LayoutUtilConstructor;
export = LayoutUtil;
