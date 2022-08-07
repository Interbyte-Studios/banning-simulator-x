import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

import { SettingsIcon } from "./settingsIcon";

interface HudProps {
	visible: boolean;
	displaySettingsMenu: () => void;
}

export const Hud = hooks((props: HudProps) => {
	if (props.visible) {
		return (
			<frame
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.925)}
				Size={UDim2.fromScale(0.08, 0.08)}
			>
				<SettingsIcon showMenu={(): void => props.displaySettingsMenu()} />
			</frame>
		);
	}

	return <></>;
});
