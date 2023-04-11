// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
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
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

interface PurchaseTalismanProps extends PurchaseTalismanMappedProps {
	currentTalisman: number;
}

interface PurchaseTalismanMappedProps {
	talismans: TalismansState;
	rank: RankState;
	currencies: CurrenciesState;
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
	};
}

/**
 * A button which allows the user to purchase the talisman they're viewing.
 */
export const PurchaseTalisman = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseTalismanProps, hooks) => {
		const storedTalisman = props.talismans.find((talisman) => talisman.id === props.currentTalisman);
		if (storedTalisman !== undefined) {
			return <></>;
		}

		const { useContext } = hooks;
		const { purchaseTalisman } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const talismanInfo = getTalismanData(props.currentTalisman);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.925),
					Image: assetIds.images.ui["weapon shop"]["purchase button"],
				}}
				size={{ minSize: 0.07, maxSize: 0.08 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);

						// check to be sure they've bought the previous talisman
						const previousTalismanId = props.currentTalisman - 1;
						if (previousTalismanId > 0) {
							const ownsPreviousTalisman = props.talismans.find((talisman) => talisman.id === previousTalismanId);
							if (ownsPreviousTalisman === undefined) {
								addAnnouncement(`You don't own the previous talisman!`, AnnouncementType.Error);
								return;
							}
						}

						// check to be sure player has enough currency to purchase talisman
						if (props.currencies[talismanInfo.cost.currency] < talismanInfo.cost.amount) {
							addAnnouncement(
								`You don't have enough currency to purchase "${talismanInfo.name}".`,
								AnnouncementType.Error,
							);
							return;
						}

						// check to be sure player is required rank
						if (props.rank < talismanInfo.cost.rank) {
							addAnnouncement(
								`You're not a high enough rank to purchase "${talismanInfo.name}".`,
								AnnouncementType.Error,
							);
							return;
						}

						addAnnouncement(`You've purchased the "${talismanInfo.name}" talisman!`, AnnouncementType.Announcement);

						purchaseTalisman.SendToServer(props.currentTalisman);
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Purchase",
					}}
					stroke={{ native: { Thickness: 2 } }}
				/>
			</SpringImageButton>
		);
	}),
);
