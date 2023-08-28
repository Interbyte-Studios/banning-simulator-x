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
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { RankState } from "shared/rodux/rank";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

interface PurchaseTalismanProps extends PurchaseTalismanMappedProps {
	talismanId: number;
}

interface PurchaseTalismanMappedProps {
	talismans: TalismansState;
	rank: RankState;
	currencies: CurrenciesState;
	curerntTalisman: CurrentTalismanState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PurchaseTalismanMappedProps {
	return {
		talismans: state.talismans,
		rank: state.rank,
		currencies: state.currencies,
		curerntTalisman: state.currentTalisman,
	};
}

/**
 * A button which allows the user to purchase the talisman they're viewing.
 */
export const PurchaseTalisman = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseTalismanProps, hooks) => {
		const { useContext } = hooks;
		const { equipTalisman, unequipTalisman, purchaseTalisman } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const storedTalisman = props.talismans.find((talisman) => talisman.id === props.talismanId);
		const talismanData = getTalismanData(props.talismanId);

		const talismanOwned = storedTalisman !== undefined;
		const talismanEquipped = talismanOwned && props.curerntTalisman === props.talismanId;

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

						// Handle equipping/unequipping
						if (talismanOwned) {
							if (talismanEquipped) {
								unequipTalisman.SendToServer();
							} else {
								// check that user is a high enough rank to equip the talisman
								if (props.rank < talismanData.cost.rank) {
									addAnnouncement(`You aren't a high enough rank to equip that talisman!`, AnnouncementType.Error);
									return;
								}

								equipTalisman.SendToServer(props.talismanId);
							}
						}
						// Handle purchasing
						else {
							// check to be sure player has enough currency to purchase talisman
							if (props.currencies[talismanData.cost.currency] < talismanData.cost.amount) {
								addAnnouncement(
									`You don't have enough currency to purchase "${talismanData.name}".`,
									AnnouncementType.Error,
								);
								return;
							}

							// check to be sure player is required rank
							if (props.rank < talismanData.cost.rank) {
								addAnnouncement(
									`You're not a high enough rank to purchase "${talismanData.name}".`,
									AnnouncementType.Error,
								);
								return;
							}

							addAnnouncement(`You've purchased the "${talismanData.name}" talisman!`, AnnouncementType.Announcement);
							purchaseTalisman.SendToServer(props.talismanId);
						}
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: talismanEquipped ? "Unequip" : talismanOwned ? "Equip" : "Purchase",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
				<uiaspectratioconstraint AspectRatio={3.4} />
			</SpringImageButton>
		);
	}),
);
