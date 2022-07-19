/* eslint-disable jsdoc/require-description-complete-sentence */

import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

import { SettingsMenu } from "./menu";
import { SettingsMenuButton } from "./menuIcon";

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): Settings {
	return state.settings;
}

/**
 * **<< Roact Component >>**
 *
 * The highest ordered settings roact component.
 * Displays either the settings menu component as a child or the settings menu icon.
 */
export const SettingsUI = RoactRodux.connect(mapStateToProps)(
	hooks((_, { useState }) => {
		const [isMenuOpen, setMenuVisibility] = useState(false);

		if (isMenuOpen) {
			return (
				<frame
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.3, 0.5)}
				>
					<SettingsMenu hideMenu={(): void => setMenuVisibility(false)} />
				</frame>
			);
		} else {
			return (
				<frame
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.925)}
					Size={UDim2.fromScale(0.1, 0.1)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<SettingsMenuButton showMenu={(): void => setMenuVisibility(true)} />
				</frame>
			);
		}
	}),
);
