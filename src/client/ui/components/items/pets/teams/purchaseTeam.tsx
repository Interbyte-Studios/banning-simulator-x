import Roact from "@rbxts/roact";
import { MarketplaceService, Players } from "@rbxts/services";
import { uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PURCHASE_PET_TEAM_PRODUCT, PURCHASE_PET_TEAM_PRODUCT_COST } from "shared/configs/game";

interface PurchasePetTeamProps {
	layoutId: number;
}

/**
 * A card that allows the player to create pet teams.
 *
 * @param props The component props.
 * @returns The component.
 */
export const PurchasePetTeam = (props: PurchasePetTeamProps): Roact.Element => {
	return (
		<BaseFrame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(0, 131, 212)}
			Size={UDim2.fromScale(0.975, 0.25)}
			LayoutOrder={props.layoutId}
		>
			<uiaspectratioconstraint AspectRatio={6.95} />
			<uicorner CornerRadius={new UDim(0.1, 0)} />

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.3),
					Size: UDim2.fromScale(0.55, 0.5),
					Text: "Purchase Pet Team",
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
			/>
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.75),
					Image: assetIds.images.ui["weapon shop"]["purchase button"],
				}}
				size={{ minSize: 0.325, maxSize: 0.35 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						MarketplaceService.PromptProductPurchase(Players.LocalPlayer, PURCHASE_PET_TEAM_PRODUCT);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Text: `R$${PURCHASE_PET_TEAM_PRODUCT_COST}`,
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) } }}
				/>
			</SpringImageButton>
		</BaseFrame>
	);
};
