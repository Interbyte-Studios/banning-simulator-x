import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";

import { SettingsMenu } from "./menu";

interface SettingsUIProps {
	visible: boolean;
	hideMenu: () => void;
}

/**
 * The highest ordered settings roact component.
 * Displays either the settings menu component as a child or the settings menu icon.
 *
 * @param props The properties of the component.
 * @param props.visible Whether the settings menu is visible.
 * @returns A roact component.
 */
export function SettingsUI(props: SettingsUIProps): Roact.Element {
	if (props.visible) {
		return (
			<frame
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.3, 0.5)}
			>
				<SettingsMenu hideMenu={(): void => props.hideMenu()} />
			</frame>
		);
	}

	return <></>;
}
