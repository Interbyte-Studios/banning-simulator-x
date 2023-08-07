import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 5.
 *
 * @returns Roact element.
 */
export const Update5Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.03),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 🌆 Cyber Cities World!",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.12),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 🥚 3 new Eggs",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.21),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 16 new Weapons",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.3),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- 4 New Talismans",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.39),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Notifications",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.48),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Time Trials Balancing",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.57),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- New Accolades",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.66),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Bug Fixes",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
