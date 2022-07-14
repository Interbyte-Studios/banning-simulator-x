import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { EnabledButton } from "client/ui/elements/enabledButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface SettingsOptionProps {
	position: UDim2;
	size: UDim2;
	settingName: string;
	isEnabled: boolean;
	onClicked: () => void;
}

export const SettingsOption = hooks((props: SettingsOptionProps) => {
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
				TextSize={20}
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
				minimizedSize={{ x: 0.2, y: 0.8 }}
				maximizedSize={{ x: 0.25, y: 0.85 }}
				onClicked={(): void => props.onClicked()}
			/>
		</imagelabel>
	);
});
