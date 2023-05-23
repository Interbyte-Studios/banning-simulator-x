// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { tryPurchaseZone } from "client/modules/tryPurchaseZone";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.75, 0.85),
					Image: assetIds.images.ui.index.Claim,
				}}
				size={{ minSize: 0.175, maxSize: 0.2 }}
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
				<uiaspectratioconstraint AspectRatio={2} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Purchase",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
