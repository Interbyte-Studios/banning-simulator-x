import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { StoreState } from "shared/rodux";
import { ValidGraphicsQuality } from "shared/rodux/settings";

import { ToggleSettingOption } from "../../elements/toggleSettingOption";

interface GraphicsSettingMappedProps {
	quality: ValidGraphicsQuality;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): GraphicsSettingMappedProps {
	return {
		quality: state.settings.visual.graphicsQuality,
	};
}

/**
 * Roact imagebutton component to toggle the graphics setting.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const GraphicsSetting = RoactRodux.connect(mapStateToProps)(
	hooks((props: GraphicsSettingMappedProps, hooks) => {
		const { useContext } = hooks;
		const { toggleGraphics } = useContext(remoteContext);

		return (
			<ToggleSettingOption
				position={UDim2.fromScale(0.5, 0.485)}
				size={UDim2.fromScale(0.95, 0.045)}
				settingName={"Low Graphics"}
				isEnabled={props.quality === "Low"}
				onClicked={(): void => toggleGraphics.SendToServer(props.quality === "High" ? "Low" : "High")}
			/>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
