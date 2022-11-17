import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";

interface weaponLevelUpAnimationProps {
	weaponLevel: number | undefined;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): weaponLevelUpAnimationProps {
	return {
		weaponLevel: state.weapons.find((weaponData) => weaponData.id === state.currentWeapon.id)?.level ?? undefined,
	};
}

export const WeaponLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: weaponLevelUpAnimationProps, hooks) => {
		if (props.weaponLevel === undefined) {
			return <></>;
		}

		/// Level up frame.
		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.319;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const frameBindingMotor = useBindingMotor(hooks, minimizedSize);

		task.defer(() => {
			task.wait(0.2);
			frameBindingMotor.motor.setGoal(maximizedSpring);
			task.wait(2);
			frameBindingMotor.motor.setGoal(minimizedSpring);
		});

		return (
			<frame
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.15)}
				Size={frameBindingMotor.binding.map((value) => {
					return UDim2.fromScale(0.22, value);
				})}
				Visible={frameBindingMotor.binding.map((value) => {
					return value > 0;
				})}
				BackgroundTransparency={1}
			>
				<imagelabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Image={"rbxassetid://11549206357"}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Fit}
				/>
				<textlabel
					Text={"Weapon Leveled UP!!"}
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 1)}
					Size={UDim2.fromScale(1.3, 0.31)}
					Font={font}
					TextScaled={true}
					TextColor3={color3White}
				>
					<BaseUIStroke Thickness={4} Color={Color3.fromRGB(27, 42, 53)} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.495, 0.46)}
					Size={UDim2.fromScale(0.75, 0.75)}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(27, 42, 53)}
					BackgroundTransparency={1}
					Text={tostring(props.weaponLevel)}
				>
					<BaseUIStroke Thickness={4} Color={Color3.fromRGB(27, 42, 53)} />
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.48)}
						Size={UDim2.fromScale(1, 1)}
						TextScaled={true}
						Font={font}
						TextColor3={color3White}
						BackgroundTransparency={1}
						Text={tostring(props.weaponLevel)}
					>
						<BaseUIStroke Thickness={4} Color={Color3.fromRGB(27, 42, 53)} />
					</textlabel>
				</textlabel>
			</frame>
		);
	}),
);
