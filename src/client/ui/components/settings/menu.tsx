import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, udim2BottomRight, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { Settings } from "shared/rodux/settings";

import { ModifySettingOption } from "./modifySettingOption";
import { ToggleSettingOption } from "./toggleSettingOption";

interface SettingsMenuProps extends SettingsMenuMappedProps {
	isVisible: boolean;
	toggleVisibility: (visible: boolean) => void;
}

interface SettingsMenuMappedProps {
	settings: Settings;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): SettingsMenuMappedProps {
	return {
		settings: state.settings,
	};
}

export const SettingsMenu = RoactRodux.connect(mapStateToProps)(
	hooks((props: SettingsMenuProps, { useContext }) => {
		// remotes
		const { toggleAuto } = useContext(remoteContext);

		// component
		if (props.isVisible) {
			return (
				<imagebutton
					AnchorPoint={vec2Middle}
					Size={udim2BottomRight}
					Position={udim2Middle}
					BackgroundTransparency={1}
					Image={assetIds.images.backgrounds.dark.Settings}
					ScaleType={Enum.ScaleType.Fit}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.02)}
						Size={UDim2.fromScale(0.75, 0.35)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Settings"}
						Font={font}
					>
						<BaseUIStroke Thickness={4} />
					</textlabel>
					<scrollingframe
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						BorderSizePixel={0}
						Size={UDim2.fromScale(0.9, 0.8)}
						Position={udim2Middle}
						ScrollBarThickness={6}
					>
						<textlabel
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(0.5, 0.04)}
							Size={UDim2.fromScale(0.4, 0.04)}
							BackgroundTransparency={1}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Text={"Sound"}
							Font={font}
						>
							<BaseUIStroke Thickness={2} />
						</textlabel>
						<ToggleSettingOption
							position={UDim2.fromScale(0.5, 0.09)}
							size={UDim2.fromScale(0.95, 0.045)}
							settingName={`Button Click`}
							isEnabled={props.settings.sound.buttonClick}
							onClicked={(): void => {}}
						/>
						<ModifySettingOption
							position={UDim2.fromScale(0.5, 0.145)}
							size={UDim2.fromScale(0.95, 0.045)}
							settingName={`Master Volume`}
							isEnabled={props.settings.sound.masterVolume}
							onClicked={(): void => {}}
						/>
					</scrollingframe>
					<ExitButton
						Position={UDim2.fromScale(0.975, 0.065)}
						minimizedSize={0.125}
						maximizedSize={0.15}
						onClose={(): void => props.toggleVisibility(!props.isVisible)}
					/>
				</imagebutton>
			);
		} else {
			return <></>;
		}
	}),
);
