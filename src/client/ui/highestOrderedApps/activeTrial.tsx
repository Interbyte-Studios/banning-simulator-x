import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import {
	isTimeTrialDifficulty,
	TIME_TRIAL_DIFFICULTY_ATTRIBUTE,
	TIME_TRIAL_NPCS_REMAINING,
	TIME_TRIAL_TIMER_ATTRIBUTE,
	TIME_TRIAL_WAVE_ATTRIBUTE,
	TimeTrialDifficulty,
} from "shared/configs/timeTrials";
import { StoreState } from "shared/rodux";
import { TimeTrialsState } from "shared/rodux/timeTrials";
import { statsAbbreviator, twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import {
	uiClaimButtonStrokeColor,
	uiDarkStrokeColor,
	uiOffButtonStrokeColor,
	uiTextStrokeColor,
} from "../commonValues";
import { BaseFrame } from "../elements/baseElements/baseFrame";
import { BaseUIStroke } from "../elements/baseElements/baseUIStroke";
import { SpringImageButton } from "../elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "../elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "../elements/icons/currencyIcon";
import { hooks } from "../hooks";
import { remoteContext } from "../mocks/remoteContext";

interface ActiveTrialProps extends ActiveTrialMappedProps {
	stopTrial: (gearRewards: number | undefined) => void;
	finish: (gearRewards: number) => void;
}

interface ActiveTrialMappedProps {
	timeTrials: TimeTrialsState;
}

/**
 * Maps the rodux store state to the component's props.
 *
 * @param state The rodux store state.
 * @returns The mapped props.
 */
export const mapStateToProps = (state: StoreState): ActiveTrialMappedProps => {
	return {
		timeTrials: state.timeTrials,
	};
};

/**
 * Controls the interface for an active time trial.
 */
export const ActiveTrial = RoactRodux.connect(mapStateToProps)(
	hooks((props: ActiveTrialProps, { useState, useContext, useEffect, useValue }) => {
		const { startTimeTrial, stopTimeTrial } = useContext(remoteContext);
		const [difficulty, setDifficulty] = useState<TimeTrialDifficulty>("easy");
		const [started, setStarted] = useState(false);
		const [wave, setWave] = useState(1);
		const [timer, setTimer] = useState(0);
		const [npcsLeft, setNPCsLeft] = useState(0);
		const [health, setHealth] = useState(100);
		const [maxHealth, setMaxHealth] = useState(100);

		const setOriginalHealth = useValue(false);

		useEffect(() => {
			const difficulty = Players.LocalPlayer.GetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE);
			if (difficulty !== undefined && isTimeTrialDifficulty(difficulty)) {
				setDifficulty(difficulty);
			}

			const npcsRemaning = Players.LocalPlayer.GetAttribute(TIME_TRIAL_NPCS_REMAINING);
			if (npcsRemaning !== undefined && t.number(npcsRemaning)) {
				setNPCsLeft(npcsRemaning);
			}

			const connection = Players.LocalPlayer.AttributeChanged.Connect((attribute) => {
				if (attribute === TIME_TRIAL_DIFFICULTY_ATTRIBUTE) {
					const attributeValue = Players.LocalPlayer.GetAttribute(TIME_TRIAL_DIFFICULTY_ATTRIBUTE);
					if (isTimeTrialDifficulty(attributeValue)) {
						setDifficulty(attributeValue);
					}
				}

				if (attribute === TIME_TRIAL_WAVE_ATTRIBUTE) {
					const attributeValue = Players.LocalPlayer.GetAttribute(TIME_TRIAL_WAVE_ATTRIBUTE);
					if (t.number(attributeValue)) {
						setWave(attributeValue);
					}
				}

				if (attribute === TIME_TRIAL_TIMER_ATTRIBUTE) {
					const attributeValue = Players.LocalPlayer.GetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE);
					if (t.number(attributeValue)) {
						setTimer((prev) => {
							if (prev > 0 && attributeValue < 1) {
								const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.35 : 1.45;
								const waveMultiplier = 5 * wave;
								props.finish(waveMultiplier * difficultyMultiplier ** wave);
							}
							return attributeValue;
						});
					}
				}

				if (attribute === TIME_TRIAL_NPCS_REMAINING) {
					const attributeValue = Players.LocalPlayer.GetAttribute(TIME_TRIAL_NPCS_REMAINING);
					if (t.number(attributeValue)) {
						setNPCsLeft(attributeValue);
					}
				}
			});

			return (): void => connection.Disconnect();
		}, [difficulty, wave, timer]);

		useEffect(() => {
			const character = Players.LocalPlayer.Character;
			if (character === undefined) {
				return;
			}

			const humanoid = character.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				return;
			}

			const root = humanoid.RootPart;
			if (root === undefined) {
				return;
			}

			if (started && !setOriginalHealth.value) {
				setOriginalHealth.value = true;
				setHealth(100 + 50 * props.timeTrials["Ban Land"].health);
				setMaxHealth(100 + 50 * props.timeTrials["Ban Land"].health);
			}

			const healthConnection = humanoid.GetPropertyChangedSignal("Health").Connect(() => {
				warn(`Attacked! Health changed to: ${humanoid.Health}`);
				setHealth(humanoid.Health);
				setMaxHealth(humanoid.MaxHealth);
			});

			const diedConnection = humanoid.Died.Connect(() => {
				if (started) {
					const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.35 : 1.45;
					const waveMultiplier = 5 * wave;
					props.stopTrial(waveMultiplier * difficultyMultiplier ** wave);
				}
			});

			return (): void => {
				healthConnection.Disconnect();
				diedConnection.Disconnect();
			};
		}, [started, difficulty, wave, timer]);

		if (started) {
			const difficultyMultiplier = difficulty === "easy" ? 1.25 : difficulty === "medium" ? 1.35 : 1.45;
			const waveMultiplier = 5 * wave;
			return (
				<>
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.5, 0.21),
							Image: assetIds.images.ui.index.Off,
						}}
						size={{ minSize: 0.04, maxSize: 0.05 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								const difficultyMultiplier = difficulty === "easy" ? 1.1 : difficulty === "medium" ? 1.2 : 1.3;
								const waveMultiplier = 5 * wave;
								playSFX(UIEngagement.MajorEngagement);
								stopTimeTrial.SendToServer();
								props.stopTrial(waveMultiplier * difficultyMultiplier ** wave);
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Stop",
							}}
							stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
						/>
					</SpringImageButton>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.02),
							Size: UDim2.fromScale(0.2, 0.05),
							Text: "GearWorx Time Trials",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(163, 58, 7) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.45, 0.07),
							Size: UDim2.fromScale(0.1, 0.05),
							Text: `Wave: ${wave}`,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(163, 58, 7) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.55, 0.07),
							Size: UDim2.fromScale(0.1, 0.05),
							Text: `NPCs: ${npcsLeft}`,
							TextXAlignment: Enum.TextXAlignment.Right,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(163, 58, 7) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.12),
							Size: UDim2.fromScale(0.2, 0.05),
							Text: `Time Left: ${formatTime(timer)}`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(163, 58, 7) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.165),
							Size: UDim2.fromScale(0.2, 0.035),
							Text: `Currency Earned: ${statsAbbreviator.numberToString(
								waveMultiplier * difficultyMultiplier ** wave,
							)}`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(163, 58, 7) } }}
					/>
					<CurrencyIcon
						position={UDim2.fromScale(0.377, 0.164)}
						size={{ minimizedSize: 0.04, maximizedSize: 0.06 }}
						currency={"gears"}
					/>
					<BaseFrame
						Position={UDim2.fromScale(0.5, 0.95)}
						Size={UDim2.fromScale(0.5, 0.05)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(255, 114, 116)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(122, 55, 56) }} />
						<BaseFrame
							AnchorPoint={new Vector2(0, 0)}
							Position={UDim2.fromScale(0, 0)}
							Size={UDim2.fromScale(health / maxHealth, 1)}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						>
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(50, 149, 73) }} />
						</BaseFrame>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.5, 0.9),
								Text: `${twoDpAbbreviator.numberToString(health)} / ${twoDpAbbreviator.numberToString(maxHealth)} HP`,
							}}
							stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(50, 149, 73) } }}
						/>
					</BaseFrame>
				</>
			);
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
								props.stopTrial(undefined);
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
	}),
);
