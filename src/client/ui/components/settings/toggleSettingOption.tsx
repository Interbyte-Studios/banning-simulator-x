/* eslint-disable jsdoc/require-description-complete-sentence */

import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { EnabledButton } from "client/ui/elements/enabledButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface ToggleSettingOptionProps {
	position: UDim2;
	size: UDim2;
	settingName: string;
	isEnabled: boolean;
	onClicked: () => void;
}

/**
 * **<< Roact Component >>**
 *
 * An option component that displays a button to either disable or enable the features of a setting.
 *
 * @param props Properties of the toggle option component.
 * @param props.position The position of the component.
 * @param props.size The size of the component.
 * @param props.settingName The name of the setting that is being displayed in the component.
 * @param props.isEnabled Whether or not the features of the setting are currently enabled.
 * @param props.onClicked A function used to change the toggleable setting.
 */
export const ToggleSettingOption = hooks((props: ToggleSettingOptionProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			Position={props.position}
			Size={props.size}
			BackgroundTransparency={1}
			Image={assetIds.images.backgrounds.dark.SettingsOption}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.3, 0.5)}
				Size={UDim2.fromScale(0.5, 1)}
				BackgroundTransparency={1}
				TextSize={18.5}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
				Text={props.settingName}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>
			<EnabledButton
				AnchorPoint={vec2Middle}
				isEnabled={props.isEnabled}
				Position={UDim2.fromScale(0.85, 0.5)}
				minimizedSize={{ x: 0.225, y: 0.8 }}
				maximizedSize={{ x: 0.25, y: 0.85 }}
				onClicked={(): void => props.onClicked()}
			/>
		</imagelabel>
	);
});
