import Roact from "@rbxts/roact";

import { hooks } from "../hooks";

/**
 * Updates the size of the ScrollingFrame's CanvasSize every time AbsoluteContentSize is changed.
 *
 * @param scrollingFrame The ScrollingFrame to update.
 * @param gridLayout The GridLayout associated with the ScrollingFrame.
 * @returns The resize connection.
 */
export function updateContentSize(scrollingFrame: ScrollingFrame, gridLayout: UIGridStyleLayout): RBXScriptConnection {
	/**
	 * Updates the CanvasSize of the ScrollingFrame.
	 */
	function resizeCanvas(): void {
		scrollingFrame.CanvasSize = UDim2.fromOffset(gridLayout.AbsoluteContentSize.X, gridLayout.AbsoluteContentSize.Y);
	}

	resizeCanvas();
	const resizeConnection = gridLayout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(resizeCanvas);

	return resizeConnection;
}

interface RescalingScrollingFrameProps extends Partial<ScrollingFrame> {}

/**
 * A component that automatically rescales the CanvasSize of the ScrollingFrame every time the AbsoluteContentSize changes.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const RescalingScrollingFrame = hooks((props: RescalingScrollingFrameProps, { useValue, useEffect }) => {
	const ref = useValue(Roact.createRef<ScrollingFrame>());

	useEffect(() => {
		const scrollingFrame = ref.value.getValue();
		assert(scrollingFrame, "Failed to get ScrollingFrame");

		const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridStyleLayout");
		assert(gridLayout, `No UIGridStyleLayout was found in ${scrollingFrame.GetFullName()}`);

		const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
		return (): void => {
			resizeConnection.Disconnect();
		};
	}, []);

	return <scrollingframe {...props} Ref={ref.value} />;
});
/* eslint-enable jsdoc/require-jsdoc */
