import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 1.
 *
 * @returns Roact element.
 */
export const Update1Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.025),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "🐛 Bug Fixes 🐛",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.077),
					Size: UDim2.fromScale(0.96, 0.066),
					Text: "- A slight delay between hatches has been added to prevent Auto Hatch from randomly disabling itself.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.123),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- The delay when opening the shop has been fixed!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.16),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- The stats window breaking has been fixed!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.213),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "🤩 New Content 🤩",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.261),
					Size: UDim2.fromScale(0.96, 0.056),
					Text: "- New Interaction Prompts for Weapon Shops, Talismans, Masteries, World Prestige, and all vendors.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.335),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- World Prestige has been added! Prestige your progress in Ban Land to gain Prestige Tokens which are spent to gain powerful permanent upgrades and boost!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.415),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- Trading has also been added! There might be a few issues here and there, but don’t worry! We’re working hard to fix them as fast as we can and ensure quality to all of our playerbase",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.465),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- 3 New Zones!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.505),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- 12 New Weapons!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.545),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- New Permanent “Jester” Egg",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.585),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "New Limited “Radioactive” Egg",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
