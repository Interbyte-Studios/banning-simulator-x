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

export const SettingsUI = RoactRodux.connect(mapStateToProps)(
	hooks((_, { useState }) => {
		const [isMenuButtonVisible, setMenuButtonVisibility] = useState(true);

		let component: Roact.Element;

		if (isMenuButtonVisible) {
			component = (
				<frame
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.925)}
					Size={UDim2.fromScale(0.1, 0.1)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<SettingsMenuButton
						isVisible={isMenuButtonVisible}
						toggleVisibility={(visible: boolean): void => {
							setMenuButtonVisibility(visible);
						}}
					/>
				</frame>
			);
		} else {
			component = (
				<frame
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.3, 0.5)}
				>
					<SettingsMenu
						isVisible={!isMenuButtonVisible}
						toggleVisibility={(visible: boolean): void => {
							setMenuButtonVisibility(!visible);
						}}
					/>
				</frame>
			);
		}

		return component;
	}),
);
