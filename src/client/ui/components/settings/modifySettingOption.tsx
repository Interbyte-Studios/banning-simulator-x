import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DecreaseButton } from "client/ui/elements/decreaseButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface ModifySettingOptionProps {
	position: UDim2;
	size: UDim2;
	settingName: string;
	onIncrease: () => void;
	onDecrease: () => void;
}

export const ModifySettingOption = hooks((props: ModifySettingOptionProps) => {
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
			<DecreaseButton minimizedSize={0} maximizedSize={0} onPressed={(): void => {}} />
		</imagelabel>
	);
});
