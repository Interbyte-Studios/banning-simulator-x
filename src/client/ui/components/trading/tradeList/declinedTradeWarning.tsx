// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { setIsTrading } from "client/modules/isTradingCache";
import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * Displays a warning when a trade is declined.
 *
 * @param props The props for the component.
 * @param props.player The player to display the warning for.
 * @param props.hideMenu The function to hide the menu.
 * @returns The Roact element to render.
 */
export const DeclinedTradeWarning = (props: { player: Player; hideMenu: () => void }): Roact.Element => {
	return (
		<BaseFrame Size={UDim2.fromScale(0.975, 0.9)}>
			<ImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.9),
					Size: UDim2.fromScale(0.3, 0.3),
					Image: assetIds.images.ui.index.Claim,
				}}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);
						setIsTrading(false);
						props.hideMenu();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Ok!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</ImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.426),
					Size: UDim2.fromScale(0.95, 0.311),
					Text: `${props.player === Players.LocalPlayer ? "You've" : props.player.Name} declined ${
						props.player === Players.LocalPlayer ? "/ cancelled" : ""
					} your trade request. You can try again, or try trading with someone else.`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
			/>
		</BaseFrame>
	);
};
