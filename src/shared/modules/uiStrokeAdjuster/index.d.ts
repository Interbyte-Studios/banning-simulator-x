interface UIStrokeAdjuster {
	TagScreenGui(screenGui: ScreenGui): void;
	TagBillboardGui(billboardGui: BillboardGui): void;
}

declare const StrokeAdjuster: UIStrokeAdjuster;
export = StrokeAdjuster;
