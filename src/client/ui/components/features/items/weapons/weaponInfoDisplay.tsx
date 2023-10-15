import Flipper from "@rbxts/flipper";
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { DamageIcon } from "client/ui/elements/icons/damageIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getWeaponDecal } from "client/util/getWeaponDecal";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WEAPON_LEVELS, WEAPONS } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { RankState } from "shared/rodux/rank";
import { Weapon, WeaponsState } from "shared/rodux/weapons";
import { getWeaponDamage } from "shared/util/getWeaponDamage";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { statsAbbreviator, twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the weapon being viewed in the weapon info display.
 */
const WeaponView = hooks((props: { storedWeapon: Weapon }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<ImageButton
			native={{
				Size: UDim2.fromScale(0.5, 0.5),
				BackgroundTransparency: 0,
				Position: UDim2.fromScale(0.5, 0.165),
				BackgroundColor3: Color3.fromRGB(0, 131, 213),
				Image: "",
			}}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.775, 0.775),
					Position: binding.map((value) => UDim2.fromScale(0.5, value)),
					Image: getWeaponDecal(props.storedWeapon.id),
				}}
			/>
		</ImageButton>
	);
});

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
	rank: RankState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): WeaponInfoDisplayMappedProps {
	return {
		weapons: state.weapons,
		currentWeapon: state.currentWeapon,
		rank: state.rank,
	};
}

/**
 * Equips/Unequips the weapon being viewed.
 */
const EquipWeapon = RoactRodux.connect(mapStateToProps)(
	hooks((props: EquipWeaponProps, hooks) => {
		const { useContext } = hooks;
		const { changeWeapon, equipWeapon, unequipWeapon } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.9),
					Image:
						props.storedWeapon.id === props.currentWeapon.id
							? assetIds.images.ui["weapon shop"].locked
							: assetIds.images.ui["weapon shop"]["purchase button"],
				}}
				size={{ minSize: 0.425, maxSize: 0.5 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						const weaponData = Object.values(WEAPONS).find((weapon) => weapon.id === props.storedWeapon.id);
						if (weaponData === undefined) {
							warn(`Failed to equip weapon | Weapon data could not be found [Items - Weapons]`);
							addAnnouncement(`There was an error while managing your weapon.`, AnnouncementType.Error);
							return;
						}

						if (props.storedWeapon.id === props.currentWeapon.id) {
							if (props.currentWeapon.equipped) {
								unequipWeapon.SendToServer();
								return;
							} else {
								if (props.rank < weaponData.cost.requiredRank) {
									warn(props.rank, weaponData.cost.requiredRank);
									addAnnouncement(`You aren't a high enough rank to equip that weapon!`, AnnouncementType.Error);
									return;
								}

								equipWeapon.SendToServer();
								return;
							}
						}

						if (props.rank < weaponData.cost.requiredRank) {
							addAnnouncement(`You aren't a high enough rank to equip that weapon!`, AnnouncementType.Error);
							return;
						}

						changeWeapon.SendToServer(props.storedWeapon.id);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Text:
							props.storedWeapon.id === props.currentWeapon.id
								? props.currentWeapon.equipped
									? "Sheath"
									: "Unsheath"
								: "Equip",
					}}
					stroke={{
						native: {
							Thickness: 1.5,
							Color:
								props.storedWeapon.id === props.currentWeapon.id
									? Color3.fromRGB(137, 150, 35)
									: Color3.fromRGB(18, 176, 13),
						},
					}}
				/>
			</SpringImageButton>
		);
	}),
);

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

		const progress = storedWeapon.level === 10 ? 1 : storedWeapon.bans / levelReq.requiredBans;

		useEffect(() => {
			if (!props.shouldAnimate) {
				return;
			}

			motor.setGoal(maximizedSpring);
		});

		return (
			<ImageButton
				native={{
					Size: binding.map((value) => UDim2.fromScale(value, value)),
					Position: UDim2.fromScale(-0.2, 0.5),
					Image: assetIds.images.ui.inventory["info sidebar"],
				}}
			>
				<uiaspectratioconstraint AspectRatio={0.56} />

				<WeaponView storedWeapon={storedWeapon} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.08),
						Position: UDim2.fromScale(0.5, 0.35),
						Text: weaponData.name,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.07),
						Position: UDim2.fromScale(0.5, 0.45),
						Text: `Level: ${storedWeapon.level}`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.65),
						Size: UDim2.fromScale(0.45, 0.08),
						TextColor3: Color3.fromRGB(230, 64, 64),
						Text: twoDpAbbreviator.numberToString(getWeaponDamage(storedWeapon)),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) } }}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
				</StrokeTextLabel>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.525)}
					Size={UDim2.fromScale(0.9, 0.05)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />
					<uicorner CornerRadius={new UDim(0.5)} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(progress, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.95),
							Text: storedWeapon.level === 10 ? "Max Level" : `${statsAbbreviator.numberToString(progress * 100)}%`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				<EquipWeapon storedWeapon={storedWeapon} />

				<ExitButton
					Position={UDim2.fromScale(0.965, 0.025)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => {
						motor.setGoal(minimizedSpring);
						task.delay(0.3, () => props.hideDisplay());
					}}
				/>
			</ImageButton>
		);
	}),
);
