import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

interface AccountIconProps {
	dispayAccount: () => void;
}

/* eslint-disable jsdoc/require-jsdoc */
export const AccountIcon = hooks((props: AccountIconProps) => {
	return (
		<SpringImageButton
			native={{
				Image: assetIds.images.ui.hud.icons.rewards,
				LayoutOrder: 2,
			}}
			size={{
				maxSize: maximizedSize,
				minSize: minimizedSize,
			}}
			events={{
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MinorEngagement);
					props.dispayAccount();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.35),
					Position: UDim2.fromScale(0.5, 1),
					Text: "Account",
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
