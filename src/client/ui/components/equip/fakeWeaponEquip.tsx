import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
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

/* eslint-disable jsdoc/require-jsdoc */
export const FakeWeaponEquip = RoactRodux.connect(mapStateToProps)(
	hooks((props: FakeWeaponEquipProps, hooks) => {
		const { useState, useContext, useEffect } = hooks;
		const [isHovering, setHovering] = useState(false);
		const { equipWeapon, unequipWeapon } = useContext(remoteContext);

		const maximizedSize = 0.3;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

		useEffect(() => {
			ContextActionService.BindAction(
				"equipWeapon",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					if (props.weaponEquipped) {
						unequipWeapon.SendToServer();
					} else {
						equipWeapon.SendToServer();
					}
				},
				false,
				Enum.KeyCode.Z,
			);
		});

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.weaponEquipped) {
							unequipWeapon.SendToServer();
						} else {
							equipWeapon.SendToServer();
						}
					},
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
						<BaseUIStroke native={{ Thickness: 1.5 }} />
					</textlabel>
				</imagelabel>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.1, 0.9)}
					Size={UDim2.fromScale(0.3, 0.3)}
					BackgroundColor3={Color3.fromRGB(48, 173, 252)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<uistroke Color={Color3.fromRGB(5, 112, 179)} Thickness={2} />
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Z"}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5 }} />
					</textlabel>
				</imagelabel>
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.9, 0.9)}
					Size={UDim2.fromScale(0.3, 0.3)}
					BackgroundColor3={props.weaponEquipped ? Color3.fromRGB(79, 255, 84) : Color3.fromRGB(255, 79, 79)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<uistroke
						Color={props.weaponEquipped ? Color3.fromRGB(38, 130, 23) : Color3.fromRGB(82, 5, 5)}
						Thickness={2}
					/>
				</imagelabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
