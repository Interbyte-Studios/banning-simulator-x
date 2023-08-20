// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { RankState } from "shared/rodux/rank";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

interface PurchaseWeaponProps extends PurchaseWeaponMappedProps {
	weaponId: number;
}

interface PurchaseWeaponMappedProps {
	weapons: WeaponsState;
	rank: RankState;
	currencies: CurrenciesState;
	currentWeapon: CurrentWeaponState;
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
		currentWeapon: state.currentWeapon,
	};
}

/**
 * A button which allows the user to purchase the weapon they're viewing.
 */
export const PurchaseWeapon = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseWeaponProps, hooks) => {
		const { useContext } = hooks;
		const { purchaseWeapon, equipWeapon, unequipWeapon, changeWeapon } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const storedWeapon = props.weapons.find((weapon) => weapon.id === props.weaponId);
		const weaponInfo = getWeaponInfo(props.weaponId);

		const weaponOwned = storedWeapon !== undefined;
		const weaponEquipped = weaponOwned && props.currentWeapon.id === props.weaponId;
		const weaponIsSheathed = weaponEquipped && !props.currentWeapon.equipped;

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.475, 0.925),
					Image: assetIds.images.ui["weapon shop"]["purchase button"],
				}}
				size={{ minSize: 0.145, maxSize: 0.155 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);

						// If they own the weapon, handle equip/unequip instead
						if (weaponOwned) {
							// if weapon is owned, but not equipped, handle equipping
							if (props.currentWeapon.id !== props.weaponId) {
								// check that they have the required rank to equip the weapon
								if (props.rank < weaponInfo.data.cost.requiredRank) {
									addAnnouncement(`You aren't a high enough rank to equip that weapon!`, AnnouncementType.Error);
									return;
								}

								changeWeapon.SendToServer(props.weaponId);
							}
							// if the weapon is equipped, but sheathed, handle unsheathing
							else if (weaponIsSheathed) {
								// check that they have the required rank to equip the weapon
								if (props.rank < weaponInfo.data.cost.requiredRank) {
									addAnnouncement(`You aren't a high enough rank to equip that weapon!`, AnnouncementType.Error);
									return;
								}

								equipWeapon.SendToServer();
							}
							// unequip if no other conditions are met.
							else {
								unequipWeapon.SendToServer();
							}
						} else {
							// check to be sure player has enough currency to purchase weapon
							if (props.currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
								addAnnouncement(
									`You don't have enough currency to purchase "${weaponInfo.name}".`,
									AnnouncementType.Error,
								);
								return;
							}

							// check to be sure player owns the required rank
							if (props.rank < weaponInfo.data.cost.requiredRank) {
								addAnnouncement(
									`You're not a high enough rank to purchase "${weaponInfo.name}".`,
									AnnouncementType.Error,
								);
								return;
							}

							purchaseWeapon.SendToServer(props.weaponId);
							addAnnouncement(`You've purchased the "${weaponInfo.name}" weapon!`, AnnouncementType.Announcement);
						}
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text:
							weaponIsSheathed || (weaponOwned && props.currentWeapon.id !== props.weaponId)
								? "Equip"
								: weaponEquipped
								? "Unequip"
								: "Purchase",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
				<uiaspectratioconstraint AspectRatio={3.4} />
			</SpringImageButton>
		);
	}),
);
