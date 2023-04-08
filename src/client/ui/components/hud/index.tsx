import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { CoinsCurrency } from "./coinsCurrency";
import { HUDFooter } from "./footer";
import { GemsCurrency } from "./gemsCurrency";
import { HUDHeader } from "./header";
import { RanksViewer } from "./rankViewer";

interface HudProps {
	visible: boolean;
	displayTeleportation: () => void;
	displaySpinWheel: () => void;
	displayItems: () => void;
	displayAutoFight: () => void;
	displayAccount: () => void;
	displayTradingMenu: () => void;
}

export const Hud = hooks((props: HudProps) => {
	if (!props.visible) {
		return <></>;
	}

	return (
		<frame
			BackgroundTransparency={1}
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
			<CoinsCurrency />
			<GemsCurrency />
			<HUDFooter displaySpinWheel={props.displaySpinWheel} displayTradingMenu={props.displayTradingMenu} />
		</frame>
	);
});
