import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { CoinsCurrency } from "./coinsCurrency";
import { HUDFooter } from "./footer";
import { GemsCurrency } from "./gemsCurrency";
import { HUDHeader } from "./header";
import { RanksViewer } from "./rankViewer";

interface HudProps {
	visible: boolean;
	displayQuestsMenu: () => void;
	displaySettingsMenu: () => void;
}

export const Hud = hooks((props: HudProps) => {
	if (props.visible) {
		return (
			<frame
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={UDim2.fromScale(0.005, 0.5)}
				Size={UDim2.fromScale(0.25, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<HUDHeader />
				<RanksViewer />
				<CoinsCurrency />
				<GemsCurrency />
				<HUDFooter />
			</frame>
		);
	}

	return <></>;
});
