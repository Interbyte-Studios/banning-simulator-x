import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface CodesMenuProps {
	visible: boolean;
	hideMenu: () => void;
}

export const CodesMenu = hooks((props: CodesMenuProps) => {
	if (!props.visible) {
		return <></>;
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.35, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.codes.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.06)}
				Size={UDim2.fromScale(0.4, 0.125)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Media"}
				Font={font}
			>
				<BaseUIStroke Thickness={3} />
			</textlabel>
			<ExitButton
				Position={UDim2.fromScale(0.95, 0.075)}
				minimizedSize={0.1}
				maximizedSize={0.125}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
