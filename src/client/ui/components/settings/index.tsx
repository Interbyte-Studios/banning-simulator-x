import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

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

		const children: Array<Roact.Element> = [];

		if (isMenuButtonVisible) {
			children.push(
				<SettingsMenuButton
					isVisible={isMenuButtonVisible}
					toggleVisibility={(visible: boolean): void => {
						setMenuButtonVisibility(visible);
					}}
				/>,
			);
		}

		return (
			<frame
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={UDim2.fromScale(0.1, 0.1)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				{children}
			</frame>
		);
	}),
);
