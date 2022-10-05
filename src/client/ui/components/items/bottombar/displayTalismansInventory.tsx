import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface DisplayTalismansInventoryProps {
	displayTalismansInventory: () => void;
}

/* eslint-disable jsdoc/require-jsdoc */
export const DisplayTalismansInventory = hooks((props: DisplayTalismansInventoryProps, hooks) => {
	const maximizedSize = 0.9;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.825;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.5, value);
			})}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.inventory.icons.talismans}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.displayTalismansInventory(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.9, 0.35)}
				Position={UDim2.fromScale(0.5, 1)}
				Text={"Weapons"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.25, Color: Color3.fromRGB(0, 108, 176) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
