import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { hooks } from "client/ui/hooks";

import { CodesIcon } from "./codesIcon";
import { SettingsIcon } from "./settingsIcon";
import { ShopIcon } from "./shopIcon";
import { TradingIcon } from "./tradingIcon";

interface HUDFooterProps {
	displayTradingMenu: () => void;
	displayCodes: () => void;
	displaySettings: () => void;
	displayShop: () => void;
}

export const HUDFooter = hooks((props: HUDFooterProps) => {
	return (
		<BaseFrame
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
			<CodesIcon displayIcon={props.displayCodes} />
			<SettingsIcon displayIcon={props.displaySettings} />
			<ShopIcon displayIcon={props.displayShop} />
		</BaseFrame>
	);
});
