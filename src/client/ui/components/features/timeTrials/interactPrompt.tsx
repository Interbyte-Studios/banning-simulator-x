// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { uiClaimButtonStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

/**
 * Displays a custom proximity prompt interface allowing the player to intract with time trials.
 *
 * @param props  The props for the component.
 * @param props.adornee The part that the prompt will be attached to.
 * @param props.displayInterface The function that will be called when the player interacts with the prompt.
 * @returns The Roact component.
 */
const Prompt = (props: { adornee: BasePart; displayInterface: () => void }): Roact.Element => (
	<billboardgui
		Active={true}
		AlwaysOnTop={true}
		LightInfluence={0}
		Size={UDim2.fromScale(12, 10)}
		StudsOffsetWorldSpace={new Vector3(0, 5, 0)}
		MaxDistance={80}
		Adornee={props.adornee}
	>
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.5, 0.2),
				Image: assetIds.images.vectors.Shield,
			}}
			size={{ minSize: 0.4, maxSize: 0.5 }}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.5),
				Size: UDim2.fromScale(1.5, 0.25),
				FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
				Text: "Time Trials",
				TextColor3: Color3.fromRGB(255, 255, 255),
			}}
			stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
		>
			<uigradient
				Rotation={90}
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(0, 255, 255)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(0, 85, 255)),
					])
				}
			/>
		</StrokeTextLabel>
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.7),
				Size: UDim2.fromScale(1.1, 0.2),
				FontFace: new Font("FredokaOne", Enum.FontWeight.Regular, Enum.FontStyle.Italic),
				Text: "Face waves of enemies!",
			}}
			stroke={{ native: { Thickness: 3.5, Color: Color3.fromRGB(0, 0, 0) } }}
		/>

		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.5, 0.95),
				Image: assetIds.images.ui.index.Claim,
			}}
			size={{ minSize: 0.4, maxSize: 0.5 }}
			events={{
				/**
				 *
				 */
				Activated: (): void => {
					playSFX(UIEngagement.MajorEngagement);
					props.displayInterface();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.8, 0.8),
					Text: "Open (E)",
				}}
				stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
			/>
			<uiaspectratioconstraint AspectRatio={2} />
		</SpringImageButton>
	</billboardgui>
);

/**
 * Displays a custom proximity prompt interface allowing the player to intract with the talisman tower.
 */
export const TimeTrialsInteractionPrompts = hooks((props: { displayInterface: () => void }) => {
	const prompts: Array<Roact.Element> = [];
	for (const adornee of Workspace.interactions.timeTrials.GetChildren()) {
		if (!adornee.IsA("BasePart")) continue;

		prompts.push(<Prompt adornee={adornee} displayInterface={props.displayInterface} />);
	}

	return <>{prompts}</>;
});
