import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getWeaponDecal } from "client/util/getWeaponDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WEAPON_LEVELS } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { Weapon, WeaponsState } from "shared/rodux/weapons";
import { getWeaponDamage } from "shared/util/getWeaponDamage";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the weapon being viewed in the weapon info display.
 */
/* eslint-disable jsdoc/require-jsdoc */
const WeaponView = hooks((props: { storedWeapon: Weapon }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.5, 0.165)}
			Size={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Image={""}
			Event={{
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.775, 0.775)}
				Position={binding.map((value) => {
					return UDim2.fromScale(0.5, value);
				})}
				Image={getWeaponDecal(props.storedWeapon.id)}
				ScaleType={Enum.ScaleType.Fit}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
			/>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

interface WeaponInfoDisplayProps extends WeaponInfoDisplayMappedProps {
	id: number;
	shouldAnimate: boolean;
	hideDisplay: () => void;
}

interface EquipWeaponProps extends WeaponInfoDisplayMappedProps {
	storedWeapon: Weapon;
}

interface WeaponInfoDisplayMappedProps {
	weapons: WeaponsState;
	currentWeapon: CurrentWeaponState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): WeaponInfoDisplayMappedProps {
	return {
		weapons: state.weapons,
		currentWeapon: state.currentWeapon,
	};
}

/**
 * Equips/Unequips the weapon being viewed.
 */
/* eslint-disable jsdoc/require-jsdoc */
const EquipWeapon = RoactRodux.connect(mapStateToProps)(
	hooks((props: EquipWeaponProps, hooks) => {
		const maxSize = 0.5;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.425;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		const { useContext } = hooks;
		const { changeWeapon, equipWeapon, unequipWeapon } = useContext(remoteContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.9)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={
					props.storedWeapon.id === props.currentWeapon.id
						? assetIds.images.ui["weapon shop"].locked
						: assetIds.images.ui["weapon shop"]["purchase button"]
				}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.storedWeapon.id === props.currentWeapon.id) {
							if (props.currentWeapon.equipped) {
								unequipWeapon.SendToServer();
								return;
							} else {
								equipWeapon.SendToServer();
								return;
							}
						}

						changeWeapon.SendToServer(props.storedWeapon.id);
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={
						props.storedWeapon.id === props.currentWeapon.id
							? props.currentWeapon.equipped
								? "Sheath"
								: "Unsheath"
							: "Equip"
					}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke
						native={{
							Thickness: 1.5,
							Color:
								props.storedWeapon.id === props.currentWeapon.id
									? Color3.fromRGB(137, 150, 35)
									: Color3.fromRGB(18, 176, 13),
						}}
					/>
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays all the information about a stored weapon.
 */
export const WeaponInfoDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponInfoDisplayProps, hooks) => {
		const { useEffect } = hooks;

		const maximizedSize = 1.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

		const storedWeapon = props.weapons.find((weapon) => weapon.id === props.id);
		if (storedWeapon === undefined) {
			//warn(`Failed to display pet information for pet with guid: "${props.guid}".`);
			return <></>;
		}

		const weaponData = getWeaponInfo(storedWeapon.id);

		const nextLevel = storedWeapon.level === 10 ? 10 : storedWeapon.level + 1;

		const levelReq = WEAPON_LEVELS.find((wepReq) => wepReq.level === nextLevel);
		assert(levelReq, `Failed to get level requirements for weapon level: "${nextLevel}"`);

		const progress = nextLevel === 10 ? 1 : storedWeapon.bans / levelReq.requiredBans;

		useEffect(() => {
			if (!props.shouldAnimate) {
				return;
			}

			motor.setGoal(maximizedSpring);
		});

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(-0.2, 0.5)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.4, value);
				})}
				Image={assetIds.images.ui.inventory["info sidebar"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={0.56} />

				<WeaponView storedWeapon={storedWeapon} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.08)}
					Position={UDim2.fromScale(0.5, 0.35)}
					Text={weaponData.name}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.07)}
					Position={UDim2.fromScale(0.5, 0.45)}
					Text={`Level: ${storedWeapon.level}`}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.71, 0.65)}
					Size={UDim2.fromScale(0.45, 0.08)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(230, 64, 64)}
					Text={twoDpAbbreviator.numberToString(getWeaponDamage(storedWeapon))}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) }} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.525)}
					Size={UDim2.fromScale(0.9, 0.05)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					<uicorner CornerRadius={new UDim(0.5)} />
					<frame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(progress, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</frame>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						Font={font}
						Text={storedWeapon.level === 10 ? "Max Level" : `${progress * 100}%`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
				</frame>
				<EquipWeapon storedWeapon={storedWeapon} />
				<ExitButton
					Position={UDim2.fromScale(0.965, 0.025)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => {
						motor.setGoal(minimizedSpring);
						task.spawn(() => task.delay(0.3, () => props.hideDisplay()));
					}}
				/>
			</imagelabel>
		);
	}),
);
