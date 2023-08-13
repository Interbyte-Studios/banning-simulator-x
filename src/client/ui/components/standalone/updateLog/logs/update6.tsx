import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 6.
 *
 * @returns Roact element.
 */
export const Update6Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.03),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 🌆 Cyber Cities Extension!",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.12),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 🥚 1 new Egg",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.21),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 4 new Weapons",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.3),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 1 New Talisman",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.39),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Improvements to Notifications",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.48),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Pet Mastery Improvements",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.57),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- REBIRTHS",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.66),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Balance Changes",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
