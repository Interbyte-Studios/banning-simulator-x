import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { WeaponsState } from "shared/rodux/weapons";

interface WeaponLevelUpAnimationProps {
	currentWeapon: CurrentWeaponState;
	weapons: WeaponsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WeaponLevelUpAnimationProps {
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
 * @param props The properties of the Roact component.
 * @param props.level The level of the weapon.
 * @returns A Roact component.
 */
function WeaponLevel(props: { level: number }): Roact.Element {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.8, 0.8)}
			Image={"rbxassetid://11549206357"}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.45)}
				Size={UDim2.fromScale(0.5, 0.5)}
				Font={font}
				Text={tostring(props.level)}
				TextScaled={true}
				TextColor3={Color3.fromRGB(27, 42, 53)}
			>
				<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(20, 46, 47) }} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Font={font}
					Text={tostring(props.level)}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(20, 46, 47) }} />
				</textlabel>
			</textlabel>
		</imagelabel>
	);
}

/**
 * A text label notifying the player they're weapon has leveled up.
 *
 * @returns A Roact component.
 */
function LevelUpNotification(): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.975)}
			Size={UDim2.fromScale(1.2, 0.2)}
			Font={font}
			Text={"Weapon Level Up!"}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
		>
			<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(20, 46, 47) }} />
		</textlabel>
	);
}

/**
 * An animation that plays when a player levels up their weapon.
 */
export const WeaponLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponLevelUpAnimationProps, hooks) => {
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

		const maximizedSize = 0.25;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const frameBindingMotor = useBindingMotor(hooks, minimizedSize);

		const { useEffect } = hooks;
		useEffect(() => {
			task.defer(() => {
				task.wait(0.2);
				frameBindingMotor.motor.setGoal(maximizedSpring);
				task.wait(2);
				frameBindingMotor.motor.setGoal(minimizedSpring);
			});
		});

		return (
			<frame
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.125)}
				Size={frameBindingMotor.binding.map((value) => {
					return UDim2.fromScale(0.15, value);
				})}
				Visible={frameBindingMotor.binding.map((value) => {
					return value > 0;
				})}
				BackgroundTransparency={1}
			>
				<uiaspectratioconstraint AspectRatio={1} />

				<WeaponLevel level={weaponLevel} />
				<LevelUpNotification />
			</frame>
		);
	}),
);
