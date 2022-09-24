import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WeaponIndex } from "shared/configs/weapons";

interface FakeWeaponEquipProps {
	weaponName: WeaponIndex;
}

/* eslint-disable jsdoc/require-jsdoc */
export const FakeWeaponEquip = hooks((props: FakeWeaponEquipProps, hooks) => {
	const { useState } = hooks;
	const [isHovering, setHovering] = useState(false);

	const maximizedSize = 0.3;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, minimizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Event={{
				MouseEnter: (): void => {
					setHovering(true);
					motor.setGoal(maximizedSpring);
				},
				MouseLeave: (): void => {
					setHovering(false);
					motor.setGoal(minimizedSpring);
				},
			}}
		>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={binding.map((value) => {
					return UDim2.fromScale(1.35, value);
				})}
				Image={assetIds.images.ui.equip.toolTp}
				ScaleType={Enum.ScaleType.Fit}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					Visible={isHovering}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.6)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={props.weaponName}
					Font={font}
				>
					<BaseUIStroke Thickness={1.5} />
				</textlabel>
			</imagelabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
