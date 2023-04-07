import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { TradingIcon } from "./tradingIcon";
import { WheelSpinIcon } from "./wheelSpingIcon";

interface HUDFooterProps {
	displaySpinWheel: () => void;
	displayTradingMenu: () => void;
}

export const HUDFooter = hooks((props: HUDFooterProps) => {
	return (
		<frame
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0, 0.5)}
			Size={UDim2.fromScale(0.9, 0.15)}
			Position={UDim2.fromScale(0.03, 0.84)}
		>
			<uilistlayout
				Padding={new UDim(0.05, 0)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<TradingIcon displayTrading={props.displayTradingMenu} />
			<WheelSpinIcon displayWheelSpinMenu={props.displaySpinWheel} />
		</frame>
	);
});
