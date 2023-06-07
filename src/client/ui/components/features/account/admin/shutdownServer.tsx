import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

import { FullComponentHeader } from "../util/fullComponentHeader";

/* eslint-disable jsdoc/require-jsdoc */
export const ShutdownServer = hooks((props: { setActiveAction: () => void }, hooks) => {
	const { useContext } = hooks;

	const { admin_ShutdownServer } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const maximizedSize = 0.15;

	return (
		<>
			<FullComponentHeader
				storeFound={true}
				headerText={`Shutdown this server?`}
				returnToSelection={(): void => props.setActiveAction()}
				displayReturn={true}
			/>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.2),
					Text: "Are you sere you want to shut down this server?",
				}}
				stroke={{
					native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
				}}
			/>
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.75, 0.675),
					Image: assetIds.images.ui.index.Claim,
				}}
				size={{ maxSize: maximizedSize, minSize: minimizedSize }}
				events={{
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);
						props.setActiveAction();
						admin_ShutdownServer.SendToServer();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "Yes!",
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) },
					}}
				/>
			</SpringImageButton>
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.25, 0.675),
					Image: assetIds.images.ui.index.Off,
				}}
				size={{ maxSize: maximizedSize, minSize: minimizedSize }}
				events={{
					Activated: (): void => {
						playSFX(UIEngagement.MajorEngagement);
						props.setActiveAction();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.8),
						Text: "No!",
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(140, 28, 104) },
					}}
				/>
			</SpringImageButton>
		</>
	);
});
