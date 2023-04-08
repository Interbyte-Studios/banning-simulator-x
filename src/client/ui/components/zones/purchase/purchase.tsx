// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { tryPurchaseZone } from "client/modules/tryPurchaseZone";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseImageButton } from "client/ui/elements/baseElements/baseImageButton";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneFailKind } from "shared/remotes/purchaseZone";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";

interface PurchaseZoneButtonProps extends PurchaseZoneButtonMappedProps {
	world: WorldName;
	zone: ZoneNames;
	hideMenu: () => void;
}

interface PurchaseZoneButtonMappedProps {
	currencies: CurrenciesState;
	worlds: WorldsState;
	rank: RankState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PurchaseZoneButtonMappedProps {
	return {
		currencies: state.currencies,
		worlds: state.worlds,
		rank: state.rank,
	};
}

/**
 * Ineraction UI roact component for purchasing a zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PurchaseZoneButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseZoneButtonProps, hooks) => {
		const { useContext } = hooks;
		const { purchaseZone } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		return (
			<BaseImageButton
				native={{
					Position: UDim2.fromScale(0.75, 0.85),
					Image: assetIds.images.ui.zones.purchase,
				}}
				size={{ minSize: 0.15, maxSize: 0.175 }}
				events={{
					Activated: async (): Promise<void> => {
						playSFX(UIEngagement.MajorEngagement);

						const checkZonePurchaseRequirements = tryPurchaseZone(
							props.currencies,
							props.worlds,
							props.rank,
							props.world,
							props.zone,
						);

						if (checkZonePurchaseRequirements.success === false) {
							switch (checkZonePurchaseRequirements.reason) {
								case PurchaseZoneFailKind.InternalError: {
									addAnnouncement(`There was an error while purchasing "${props.zone}" zone.`, AnnouncementType.Error);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NotEnoughCurrency: {
									addAnnouncement(`You don't have enough to purchase "${props.zone}".`, AnnouncementType.Error);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NotRequiredRank: {
									addAnnouncement(`You aren't a high enough rank to purchase "${props.zone}".`, AnnouncementType.Error);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NonlinearProgression: {
									addAnnouncement(
										`You don't meet the requirements to purchase "${props.zone}".`,
										AnnouncementType.Error,
									);
									props.hideMenu();
									return;
								}
							}
						} else {
							const requestZonePurchase = await purchaseZone.CallServerAsync(props.world, props.zone);
							if (requestZonePurchase.success === true) {
								addAnnouncement(`You have purchased the "${props.zone}" zone.`, AnnouncementType.Announcement);
								props.hideMenu();
								return;
							} else {
								switch (requestZonePurchase.reason) {
									case PurchaseZoneFailKind.InternalError: {
										addAnnouncement(
											`There was an error while purchasing "${props.zone}" zone.`,
											AnnouncementType.Error,
										);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NotEnoughCurrency: {
										addAnnouncement(`You don't have enough to purchase "${props.zone}".`, AnnouncementType.Error);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NotRequiredRank: {
										addAnnouncement(
											`You aren't a high enough rank to purchase "${props.zone}".`,
											AnnouncementType.Error,
										);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NonlinearProgression: {
										addAnnouncement(
											`You don't meet the requirements to purchase "${props.zone}".`,
											AnnouncementType.Error,
										);
										props.hideMenu();
										return;
									}
								}
							}
						}
					},
				}}
			>
				<BaseTextLabel
					native={{
						Size: UDim2.fromScale(0.85, 0.6),
						Text: "Purchase",
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
			</BaseImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
