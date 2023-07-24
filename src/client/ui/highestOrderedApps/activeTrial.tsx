import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { isTimeTrialDifficulty, TIME_TRIAL_DIFFICULTY_ATTRIBUTE, TimeTrialDifficulty } from "shared/configs/timeTrials";

import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
} from "../commonValues";
import { BaseFrame } from "../elements/baseElements/baseFrame";
import { SpringImageButton } from "../elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "../elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "../hooks";
import { remoteContext } from "../mocks/remoteContext";

/**
 * Controls the interface for an active time trial.
 */
export const ActiveTrial = hooks((props: { stopTrial: () => void }, { useState, useContext, useEffect }) => {
	const { startTimeTrial, stopTimeTrial } = useContext(remoteContext);
	const [difficulty, setDifficulty] = useState<TimeTrialDifficulty>("easy");
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const connection = Players.LocalPlayer.AttributeChanged.Connect((attribute) => {
			if (attribute === TIME_TRIAL_DIFFICULTY_ATTRIBUTE) {
				const attributeValue = Players.LocalPlayer.GetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE);
				if (isTimeTrialDifficulty(attributeValue)) {
					setDifficulty(attributeValue);
				}
			}
		});

		return (): void => connection.Disconnect();
	}, []);

	if (started) {
		return <></>;
	} else {
		return (
			<>
				<BaseFrame
					BackgroundColor3={uiTextStrokeColor}
					BackgroundTransparency={0}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 1.34)}
				/>
				<BaseFrame
					BackgroundColor3={uiDarkStrokeColor}
					BackgroundTransparency={0.2}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 1.32)}
				/>
				<BaseFrame
					BackgroundColor3={uiDarkStrokeColor}
					BackgroundTransparency={0.4}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 1.3)}
				/>
				<BaseFrame
					BackgroundColor3={uiDarkStrokeColor}
					BackgroundTransparency={0.6}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 1.28)}
				/>
				<BaseFrame
					BackgroundColor3={uiDarkStrokeColor}
					BackgroundTransparency={0.8}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 1.26)}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.6, 0.925),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.08, maxSize: 0.1 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							startTimeTrial.SendToServer();
							setStarted(true);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Start",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.4, 0.925),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.08, maxSize: 0.1 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							stopTimeTrial.SendToServer();
							props.stopTrial();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Cancel",
						}}
						stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
					/>
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.85),
						Size: UDim2.fromScale(0.15, 0.05),
						Text: `GearWorx Trials: ${difficulty === "hard" ? "Hard" : difficulty === "medium" ? "Medium" : "Easy"}`,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
			</>
		);
	}
});
