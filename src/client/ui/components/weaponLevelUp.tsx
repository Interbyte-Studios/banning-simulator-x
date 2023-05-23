import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { BaseFrame } from "../elements/baseElements/baseFrame";
import { StrokeTextLabel } from "../elements/baseElements/textlabels/strokeTextLabel";
import { WeaponViewport } from "../elements/viewports/weaponViewport";

interface WeaponLevelUpAnimationProps extends WeaponLevelUpAnimationMappedProps {
	enabled: boolean;
}

interface WeaponLevelUpAnimationMappedProps {
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponLevelUpAnimationMappedProps {
	return {
		currentWeapon: state.currentWeapon,
		weapons: state.weapons,
	};
}

const cachedWeapon = {
	id: 0,
	level: 0,
};

/**
 * An animation that plays when a player levels up their weapon.
 */
export const WeaponLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponLevelUpAnimationProps, hooks) => {
		if (!props.enabled) {
			return <></>;
		}

		const storedWeapon = props.weapons.find((weapon) => weapon.id === props.currentWeapon.id);
		assert(storedWeapon, `Expected player to own weapon of id: "${props.currentWeapon}" since they have it equipped.`);

		const weaponLevel = storedWeapon.level;
		if (cachedWeapon.id !== props.currentWeapon.id) {
			cachedWeapon.id = props.currentWeapon.id;
			cachedWeapon.level = weaponLevel;

			return <></>;
		}

		if (weaponLevel === cachedWeapon.level) {
			return <></>;
		} else {
			cachedWeapon.level = weaponLevel;
		}

		/// Level up frame.
		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.2;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const frameBindingMotor = useBindingMotor(hooks, minimizedSize);

		const { useEffect } = hooks;
		useEffect(() => {
			task.defer(() => {
				task.wait(0.2);
				frameBindingMotor.motor.setGoal(maximizedSpring);
				task.wait(5);
				frameBindingMotor.motor.setGoal(minimizedSpring);
			});
		});

		const weaponData = getWeaponInfo(props.currentWeapon.id);

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.125)}
				Size={frameBindingMotor.binding.map((value) => {
					return UDim2.fromScale(0.4, value);
				})}
				Image={assetIds.images.ui.levelup.LevelUp}
				ScaleType={Enum.ScaleType.Fit}
				Visible={frameBindingMotor.binding.map((value) => {
					return value > 0;
				})}
			>
				<uiaspectratioconstraint AspectRatio={2.2} />

				<BaseFrame
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.15, 0.675)}
					Size={UDim2.fromScale(0.25, 0.6)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.175, 0)} />

					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
					<WeaponViewport weaponId={weaponData.data.id} />
				</BaseFrame>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.185),
						Size: UDim2.fromScale(0.6, 0.3),
						Text: "Congratulations",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(185, 81, 1) } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.635, 0.55),
						Size: UDim2.fromScale(0.685, 0.25),
						Text: "Weapon Level Up!",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 100, 163) } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.635, 0.775),
						Size: UDim2.fromScale(0.685, 0.2),
						Text: `Level ${storedWeapon.level}`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 100, 163) } }}
				/>
			</imagelabel>
		);
	}),
);
