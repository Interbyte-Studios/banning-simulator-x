import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

export enum Difficulty {
	Easy = "Easy",
	Medium = "Medium",
	Hard = "Hard",
}

/**
 * Time Trials.
 */
export const TimeTrialsDifficultySelection = hooks((_, { useState }) => {
	const [difficulty, setDifficulty] = useState<Difficulty | undefined>(undefined);

	if (difficulty !== undefined) {
		return (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.25),
						Size: UDim2.fromScale(0.97, 0.08),
						Text: "You're about to enter Time Trials.",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.325),
						Size: UDim2.fromScale(0.97, 0.07),
						Text: `Difficulty: ${difficulty}`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.55),
						Size: UDim2.fromScale(0.9, 0.25),
						Text: `You may enter whenever you're ready. When you are teleported, you can start the Time Trial whenever you're ready as well by pressing the "Start" button.`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.885),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.195, maxSize: 0.21 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.8),
							Text: "Start",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(41, 175, 79) } }}
					/>
				</SpringImageButton>
			</>
		);
	} else {
		return (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.285),
						Size: UDim2.fromScale(0.97, 0.16),
						Text: "Time Trials is a wave-based combat feature. You have 10 minutes to complete as many waves as possible. The higher the wave, the harder the enemies are to ban.",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.46),
						Size: UDim2.fromScale(0.97, 0.15),
						Text: "NPCs will spawn on the outside of the map and walk inwards towards your position. When NPCs are close enough, they will attack you. Be quick, or you will die!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.63),
						Size: UDim2.fromScale(0.97, 0.15),
						Text: "You can purchase upgrades, weapons, and pets with currency earned from Time Trials, which will help you in harder difficulties.",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.8),
						Size: UDim2.fromScale(0.97, 0.065),
						Text: "Select Difficulty",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.18, 0.9),
						Image: assetIds.images.ui.timeTrials.green,
					}}
					size={{ minSize: 0.225, maxSize: 0.245 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setDifficulty(Difficulty.Easy);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.35} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Easy",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(41, 175, 79) } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.9),
						Image: assetIds.images.ui.timeTrials.yellow,
					}}
					size={{ minSize: 0.225, maxSize: 0.245 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setDifficulty(Difficulty.Medium);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.35} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Medium",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(157, 165, 39) } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.825, 0.9),
						Image: assetIds.images.ui.timeTrials.red,
					}}
					size={{ minSize: 0.225, maxSize: 0.245 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setDifficulty(Difficulty.Hard);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.35} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Hard",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(173, 51, 65) } }}
					/>
				</SpringImageButton>
			</>
		);
	}
});
