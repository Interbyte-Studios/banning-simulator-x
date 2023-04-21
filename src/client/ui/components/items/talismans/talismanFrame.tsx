import Roact from "@rbxts/roact";
import { font, uiDarkStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { TalismanGradient } from "client/ui/elements/gradients/talismanGradient";
import { TalismanViewport } from "client/ui/elements/viewports/talismanViewport";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Talisman } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * An item frame for a specified talisman.
 */
export const TalismanItemFrame = hooks(
	(props: { storedTalisman: Talisman; isEquipped: boolean; displayTalismanInfo: (talismanId: number) => void }) => {
		const talismanData = getTalismanData(props.storedTalisman.id);

		const additionalElements: Array<Roact.Element> = [];
		if (props.storedTalisman.phase !== "normal") {
			const capitalizedPhaseName =
				props.storedTalisman.phase === "artifact"
					? "Artifact"
					: props.storedTalisman.phase === "awakend"
					? "Awakend"
					: "Normal";

			const phaseElement = (
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.95),
						Size: UDim2.fromScale(0.7, 0.2),
						Text: capitalizedPhaseName,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				>
					<TalismanGradient phase={props.storedTalisman.phase} />
				</StrokeTextLabel>
			);

			additionalElements.push(phaseElement);
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.storedTalisman.id}>
				<ImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: props.isEquipped ? Color3.fromRGB(85, 255, 127) : Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.displayTalismanInfo(props.storedTalisman.id);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
					<TalismanViewport talismanId={props.storedTalisman.id} phase={props.storedTalisman.phase} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.2),
							Position: UDim2.fromScale(0.5, 0.1),
							Text: talismanData.name,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					{additionalElements}
				</ImageButton>
			</frame>
		);
	},
);
