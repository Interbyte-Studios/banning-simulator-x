import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { hooks } from "client/ui/hooks";

import { CoinsCurrency } from "./coinsCurrency";
import { HUDFooter } from "./footer";
import { GemsCurrency } from "./gemsCurrency";
import { HUDHeader } from "./header";
import { RanksViewer } from "./rankViewer";

interface HudProps {
	displayTeleportation: () => void;
	displayItems: () => void;
	displayAutoFight: () => void;
	displayAccount: () => void;
	displayTradingMenu: () => void;
	displayCodes: () => void;
	displaySettings: () => void;
	displayShop: () => void;
	onlyShowCurrency: boolean;
}

export const Hud = hooks((props: HudProps) => {
	if (props.onlyShowCurrency) {
		return (
			<BaseFrame
				AnchorPoint={new Vector2(0, 0.5)}
				Position={UDim2.fromScale(0.005, 0.5)}
				Size={UDim2.fromScale(0.25, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<CoinsCurrency onlyShowCurrencyEnabled={props.onlyShowCurrency} />
				<GemsCurrency onlyShowCurrencyEnabled={props.onlyShowCurrency} />
			</BaseFrame>
		);
	} else {
		return (
			<BaseFrame
				AnchorPoint={new Vector2(0, 0.5)}
				Position={UDim2.fromScale(0.005, 0.5)}
				Size={UDim2.fromScale(0.25, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<HUDHeader
					displayItems={props.displayItems}
					displayAccount={props.displayAccount}
					displayTeleportation={props.displayTeleportation}
					displayAutoFight={props.displayAutoFight}
				/>
				<RanksViewer />
				<CoinsCurrency onlyShowCurrencyEnabled={props.onlyShowCurrency} />
				<GemsCurrency onlyShowCurrencyEnabled={props.onlyShowCurrency} />
				<HUDFooter
					displayTradingMenu={props.displayTradingMenu}
					displayCodes={props.displayCodes}
					displaySettings={props.displaySettings}
					displayShop={props.displayShop}
				/>
			</BaseFrame>
		);
	}
});
