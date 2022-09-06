import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { CoinsCurrency } from "./coinsCurrency";
import { GemsCurrency } from "./gemsCurrency";

interface HudProps {
	visible: boolean;
	displayQuestsMenu: () => void;
	displaySettingsMenu: () => void;
}

export const Hud = hooks((props: HudProps) => {
	if (props.visible) {
		return (
			<frame
				BackgroundTransparency={0}
				AnchorPoint={new Vector2(0, 0.5)}
				Position={UDim2.fromScale(0.01, 0.5)}
				Size={UDim2.fromScale(0.25, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={0.8} />
				<CoinsCurrency />
				<GemsCurrency />
			</frame>
		);
	}

	return <></>;
});
