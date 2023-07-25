import Roact from "@rbxts/roact";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "../commonValues";
import { SpringImageButton } from "../elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "../elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "../elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "../elements/icons/currencyIcon";

/**
 * The reward screen for time trials.
 *
 * @param props The props for the component.
 * @param props.gearRewards The amount of gear rewards the player has earned.
 * @param props.finish A callback to finish the trial.
 * @returns The roact component.
 */
export const FinishedTrial = (props: { gearRewards: number | undefined; finish: () => void }): Roact.Element => {
	return (
		<>
			<ImageLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.5),
					Size: UDim2.fromScale(0.5, 0.425),
					Image: assetIds.images.ui.codes.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={2.1} />
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.505, 0.115),
						Size: UDim2.fromScale(0.375, 0.185),
						Text: "GearWorx Rewards",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(184, 80, 0) } }}
				/>
				{props.gearRewards === undefined && (
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.465),
							Size: UDim2.fromScale(0.9, 0.45),
							Text: "You did not complete the Trial. You have not received any rewards.",
						}}
						stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
					/>
				)}
				{props.gearRewards !== undefined && (
					<>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.387),
								Size: UDim2.fromScale(0.9, 0.293),
								Text: "You completed the Trial. Congratulations :)",
							}}
							stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
						/>
						<CurrencyIcon
							position={UDim2.fromScale(0.4, 0.65)}
							size={{ minimizedSize: 0.1, maximizedSize: 0.125 }}
							currency={"gears"}
						/>
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.55, 0.662),
								Size: UDim2.fromScale(0.195, 0.137),
								Text: statsAbbreviator.numberToString(props.gearRewards),
								TextXAlignment: Enum.TextXAlignment.Left,
							}}
							stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
						/>
					</>
				)}
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.85),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.125, maxSize: 0.175 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.finish();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Ok",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</ImageLabel>
		</>
	);
};
