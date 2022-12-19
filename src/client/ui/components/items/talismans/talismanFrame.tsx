import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { TalismanGradient } from "client/ui/elements/talismanGradient";
import { TalismanViewport } from "client/ui/elements/talismanViewport";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Talisman } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * An item frame for a specified talisman.
 */
/* eslint-disable jsdoc/require-jsdoc */
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

			additionalElements.push(
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.95)}
					Size={UDim2.fromScale(0.7, 0.2)}
					Font={font}
					Text={capitalizedPhaseName}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<TalismanGradient phase={props.storedTalisman.phase} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>,
			);
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.storedTalisman.id}>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={props.isEquipped ? Color3.fromRGB(85, 255, 127) : Color3.fromRGB(46, 115, 179)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.925, 0.925)}
					Image={""}
					Event={{
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
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0.2)}
						Position={UDim2.fromScale(0.5, 0.1)}
						Text={talismanData.name}
						TextScaled={true}
						Font={font}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
					{additionalElements}
				</imagebutton>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
