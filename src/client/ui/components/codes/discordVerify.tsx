import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

export const DiscordVerify = hooks((_, hooks) => {
	const { useEffect } = hooks;

	const { motor, binding } = useBindingMotor(hooks, {});

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.84, 0.875)}
			Size={UDim2.fromScale(0.25, 0.1)}
			Image={assetIds.images.buttons["long green button"]}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.6)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Verify"}
				Font={font}
			>
				<BaseUIStroke Thickness={1.2} />
			</textlabel>
		</imagebutton>
	);
});
