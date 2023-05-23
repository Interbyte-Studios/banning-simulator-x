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
		const { addAnnouncement } = useContext(AnnouncementContext);

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

						// check to be sure weapon can be purchased
						if (weaponInfo.data.cost === undefined) {
							addAnnouncement(
								`There was an internal issue while purchasing "${weaponInfo.name}" (105).`,
								AnnouncementType.Error,
							);
							return;
						}

						// check to be sure player has enough currency to purchase weapon
						if (props.currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
							addAnnouncement(
								`You don't have enough currency to purchase "${weaponInfo.name}".`,
								AnnouncementType.Error,
							);
							return;
						}

						// check to be sure player is required rank
						if (weaponInfo.data.cost.requiredRank !== undefined) {
							if (props.rank < weaponInfo.data.cost.requiredRank) {
								addAnnouncement(
									`You're not a high enough rank to purchase "${weaponInfo.name}".`,
									AnnouncementType.Error,
								);
								return;
							}
						}

						purchaseWeapon.SendToServer(props.currentWeapon);
						addAnnouncement(`You've purchased the "${weaponInfo.name}" weapon!`, AnnouncementType.Announcement);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Purchase",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>
		);
	}),
);
