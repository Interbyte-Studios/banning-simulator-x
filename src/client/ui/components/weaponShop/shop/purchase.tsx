import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

interface PurchaseWeaponProps extends PurchaseWeaponMappedProps {
	currentWeapon: number;
}

interface PurchaseWeaponMappedProps {
	weapons: WeaponsState;
	rank: RankState;
	currencies: CurrenciesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PurchaseWeaponMappedProps {
	return {
		weapons: state.weapons,
		rank: state.rank,
		currencies: state.currencies,
	};
}

/**
 * A button which allows the user to purchase the weapon they're viewing.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PurchaseWeapon = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseWeaponProps, hooks) => {
		if (props.weapons.find((weapon) => weapon.id === props.currentWeapon)) {
			return <></>;
		}

		const weaponInfo = getWeaponInfo(props.currentWeapon);
		if (weaponInfo.data.cost === undefined) {
			return <></>;
		}

		const { useContext } = hooks;
		const { purchaseWeapon } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		const maximizedSize = 0.08;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.07;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.925)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.15, value);
				})}
				Image={assetIds.images.ui["weapon shop"]["purchase button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						// check to be sure weapon can be purchased
						if (weaponInfo.data.cost === undefined) {
							addError(`There was an internal issue while purchasing "${weaponInfo.name}" (105).`);
							return;
						}

						// check to be sure player has enough currency to purchase weapon
						if (props.currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
							addError(`You don't have enough currency to purchase "${weaponInfo.name}".`);
							return;
						}

						// check to be sure player is required rank
						if (weaponInfo.data.cost.requiredRank !== undefined) {
							if (props.rank < weaponInfo.data.cost.requiredRank) {
								addError(`You're not a high enough rank to purchase "${weaponInfo.name}".`);
								return;
							}
						}

						purchaseWeapon.SendToServer(props.currentWeapon);
						addError(`You've purchased the "${weaponInfo.name}" weapon!`);
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Text={"Purchase"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 2 }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
