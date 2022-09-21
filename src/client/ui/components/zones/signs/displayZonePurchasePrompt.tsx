import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { tryPurchaseZone } from "client/modules/tryPurchaseZone";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { Zone } from "shared/configs/zones";

interface DisplayZonePurchasePromptProps {
	worldName: WorldName;
	zoneData: Zone;
	setViewedZone: (world: WorldName, zone: number) => void;
}

/**
 * Ineraction UI roact component for displaying a zone's purchase prompt.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const DisplayZonePurchasePrompt = hooks((props: DisplayZonePurchasePromptProps, hooks) => {
	const minimizedSize = 0.21;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.25;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.85)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.4, value);
			})}
			Image={assetIds.images.buttons["green toggle button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.setViewedZone(props.worldName, props.zoneData.id),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.7)}
				Text={"Purchase"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				Font={font}
			>
				<BaseUIStroke Thickness={4} />
			</textlabel>
		</imagebutton>
	);
});

/* eslint-enable jsdoc/require-jsdoc */
