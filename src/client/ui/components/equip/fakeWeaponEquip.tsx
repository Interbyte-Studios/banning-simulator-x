import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WeaponIndex } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";

interface FakeWeaponEquipProps extends FakeWeaponEquipMappedProps {
	weaponName: WeaponIndex;
}

interface FakeWeaponEquipMappedProps {
	weaponEquipped: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): FakeWeaponEquipMappedProps {
	return {
		weaponEquipped: state.currentWeapon.equipped,
	};
}

export const FakeWeaponEquip = RoactRodux.connect(mapStateToProps)(
	hooks((props: FakeWeaponEquipProps, hooks) => {
		const { useState, useContext } = hooks;
		const [isHovering, setHovering] = useState(false);
		const { equipWeapon, unequipWeapon } = useContext(remoteContext);

		const maximizedSize = 0.3;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

		return (
			<ImageButton
				native={{
					Size: UDim2.fromScale(1, 1),
				}}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						print(props.weaponEquipped);

						if (props.weaponEquipped) {
							unequipWeapon.SendToServer();
						} else {
							equipWeapon.SendToServer();
						}
					},
					// eslint-disable-next-line jsdoc/require-jsdoc
					MouseEnter: (): void => {
						setHovering(true);
						motor.setGoal(maximizedSpring);
					},
					// eslint-disable-next-line jsdoc/require-jsdoc
					MouseLeave: (): void => {
						setHovering(false);
						motor.setGoal(minimizedSpring);
					},
				}}
			>
				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0),
						Size: binding.map((value) => UDim2.fromScale(1.35, value)),
						Image: assetIds.images.ui.equip.toolTp,
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: props.weaponName,
							Visible: isHovering,
						}}
						stroke={{ native: { Thickness: 1.5 } }}
					/>
				</ImageLabel>

				<ImageLabel
					native={{
						BackgroundTransparency: 0,
						Position: UDim2.fromScale(0.1, 0.9),
						Size: UDim2.fromScale(0.3, 0.3),
						BackgroundColor3: Color3.fromRGB(48, 173, 252),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2.5, Color: Color3.fromRGB(5, 112, 179) }} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Text: "Z",
						}}
						stroke={{ native: { Thickness: 1.5 } }}
					/>
				</ImageLabel>

				<ImageLabel
					native={{
						BackgroundTransparency: 0,
						Position: UDim2.fromScale(0.9, 0.9),
						Size: UDim2.fromScale(0.3, 0.3),
						BackgroundColor3: props.weaponEquipped ? Color3.fromRGB(79, 255, 84) : Color3.fromRGB(255, 79, 79),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke
						native={{
							Thickness: 2,
							Color: props.weaponEquipped ? Color3.fromRGB(38, 130, 23) : Color3.fromRGB(82, 5, 5),
						}}
					/>
				</ImageLabel>
			</ImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
