import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DecreaseButton } from "client/ui/elements/decreaseButton";
import { IncreaseButton } from "client/ui/elements/increaseButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface ModifySettingOptionProps {
	position: UDim2;
	size: UDim2;
	settingName: string;
	displayValue: string;
	displayPercentage: boolean;
	onIncrease: () => void;
	onDecrease: () => void;
}

/**
 * An option component that displays buttons for the user to either increase or decrease the value of a setting.
 *
 * @param props Properties of the modify option component.
 * @param props.position The position of the component.
 * @param props.size The size of the component.
 * @param props.settingName The name of the setting that is being displayed in the component.
 * @param props.displayValue The state of the setting to display in the component.
 * @param props.onIncrease A function used to increase the value of the setting.
 * @param props.onDecrease A function used to decrease the value of the setting.
 */
export const ModifySettingOption = hooks((props: ModifySettingOptionProps) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			Position={props.position}
			Size={props.size}
			BackgroundTransparency={1}
			Image={assetIds.images.ui.settings["setting background"]}
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
			<DecreaseButton
				Position={UDim2.fromScale(0.625, 0.5)}
				minimizedSize={0.75}
				maximizedSize={0.85}
				onPressed={(): void => props.onDecrease()}
			/>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.775, 0.5)}
				Size={UDim2.fromScale(0.175, 0.9)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={props.displayValue}
				Font={font}
			>
				<BaseUIStroke Thickness={2} />
			</textlabel>
			<IncreaseButton
				Position={UDim2.fromScale(0.925, 0.5)}
				minimizedSize={0.75}
				maximizedSize={0.85}
				onPressed={(): void => props.onIncrease()}
			/>
		</imagelabel>
	);
});
