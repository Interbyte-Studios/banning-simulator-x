import Roact from "@rbxts/roact";
import { font, udim2Middle, vec2Middle } from "client/ui/commonValues";
import { BaseTextLabel } from "client/ui/elements/baseTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { QuestReward } from "shared/configs/quests";

interface QuestDisplayerProps {
	quests: Array<{
		name: string;
		progress: number;
		completionProgress: number;
		experience: number;
		specialReward: QuestReward;
		hasPreviouslyClaimed: boolean;
	}>;
	onQuestClaim: (quest: string) => void;
}

/**
 * @param props The props to create the ClaimButton.
 * @param props.progress The progress of completion the user has completed.
 * @param props.completionProgress The progress of completion the user needs to complete.
 * @param props.onClaimQuest A callback to run when the user attempts to claim the quest.
 * @param props.hasPreviouslyClaimed If the user has previously claimed this quest.
 * @returns The Roact component to render.
 */
function ClaimButton(props: {
	progress: number;
	completionProgress: number;
	hasPreviouslyClaimed: boolean;
	onClaimQuest: () => void;
}): Roact.Element {
	if (props.progress !== props.completionProgress) {
		return <></>;
	}

	return (
		<textbutton
			Size={UDim2.fromScale(0.2, 0.75)}
			Position={UDim2.fromScale(0.7875, 0.125)}
			Text={props.hasPreviouslyClaimed ? "Claimed!" : "Claim Reward!"}
			Font={font}
			TextColor3={Color3.fromRGB(0, 0, 0)}
			TextScaled={true}
			BorderColor3={Color3.fromRGB(0, 255 / 2, 0)}
			BackgroundColor3={Color3.fromRGB(0, 255, 0)}
			Event={{ Activated: props.hasPreviouslyClaimed ? undefined : props.onClaimQuest }}
		/>
	);
}

/**
 * Displays the quests completion progress.
 *
 * @param props The props to create the quest displayer with.
 * @returns The quests UI to display.
 */
export function QuestDisplayer(props: QuestDisplayerProps): Roact.Element {
	return (
		<RescalingScrollingFrame
			Position={udim2Middle}
			Size={UDim2.fromScale(0.65, 0.6)}
			AnchorPoint={vec2Middle}
			ScrollBarThickness={0}
			ScrollingDirection={Enum.ScrollingDirection.Y}
			BorderSizePixel={0}
		>
			<uigridlayout CellSize={UDim2.fromScale(1, 0.15)} SortOrder={Enum.SortOrder.LayoutOrder} />
			{props.quests.map((quest, i) => (
				<frame BackgroundTransparency={1} LayoutOrder={i}>
					{/* display quest name */}
					<BaseTextLabel Size={UDim2.fromScale(0.2, 1)} Position={UDim2.fromScale(0.125, 0.5)} Text={quest.name} />
					{/* display quest progress */}
					<frame
						Size={UDim2.fromScale(0.375 * (quest.progress / quest.completionProgress), 0.5)}
						Position={UDim2.fromScale(0.275, 0.25)}
						BackgroundColor3={Color3.fromRGB(0, 255, 0)}
					/>
					<BaseTextLabel
						Size={UDim2.fromScale(0.1, 0.75)}
						Position={UDim2.fromScale(0.725, 0.5)}
						Text={`${quest.progress} / ${quest.completionProgress}`}
					/>
					<ClaimButton
						progress={quest.progress}
						completionProgress={quest.completionProgress}
						hasPreviouslyClaimed={quest.hasPreviouslyClaimed}
						onClaimQuest={(): void => props.onQuestClaim(quest.name)}
					/>
				</frame>
			))}
		</RescalingScrollingFrame>
	);
}
