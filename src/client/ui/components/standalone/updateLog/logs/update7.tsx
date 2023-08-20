import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 7.
 *
 * @returns Roact element.
 */
export const Update7Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.03),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🥚 New Event Egg (Pixel Egg)",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.12),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🏅 Pet Mastery Fixes (Pet Mastery progress was reset for all players)",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.21),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🏅 Pet Mastery UI Improvements",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.3),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🌟 Stats window returned!",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.39),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🏃 Time Trials temporarily disabled",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.48),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "⚠️ Improvements to notifications",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.57),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "⚠️ Massive performance fixes",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.66),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "🐛 Lots of bug fixes",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
