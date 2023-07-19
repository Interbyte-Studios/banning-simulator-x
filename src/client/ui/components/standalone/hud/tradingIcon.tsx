import Roact from "@rbxts/roact";
import { Players, PolicyService } from "@rbxts/services";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

/* eslint-disable jsdoc/require-jsdoc */
export const TradingIcon = hooks((props: { displayTrading: () => void }, { useState, useEffect, useContext }) => {
	const [canTrade, setCanTrade] = useState(true);
	useEffect(() => {
		if (!canTrade) {
			return;
		}

		task.spawn(() => {
			const userRestrictions = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
			if (!userRestrictions.IsPaidItemTradingAllowed) {
				setCanTrade(false);
			}
		});
	});

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	return (
		<SpringImageButton
			native={{
				Image: assetIds.images.ui.hud.icons.trading,
				LayoutOrder: 5,
			}}
			size={{
				maxSize: maximizedSize,
				minSize: minimizedSize,
			}}
			events={{
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MinorEngagement);

					if (!canTrade) {
						addAnnouncement(`Your region does not allow you to trade.`, AnnouncementType.Error);
						return;
					}

					props.displayTrading();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.35),
					Position: UDim2.fromScale(0.5, 1),
					Text: "Trading",
				}}
				stroke={{
					native: { Thickness: 1, Color: Color3.fromRGB(0, 108, 176) },
				}}
			/>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
