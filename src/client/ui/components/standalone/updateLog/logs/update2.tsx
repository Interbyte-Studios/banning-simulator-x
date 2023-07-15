import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 2.
 *
 * @returns Roact element.
 */
export const Update2Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.025),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "🤩 Content Implementations 🤩",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.075),
					Size: UDim2.fromScale(0.96, 0.056),
					Text: "- NPC's are highlighted red for a brief period when damaged.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.134),
					Size: UDim2.fromScale(0.96, 0.056),
					Text: "- NPCs display damage numbers when damaged.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.185),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- Leaderboard overhead ranks",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.235),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Fusion now simply displays possible pets to fuse instead of organizing them by zone",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.295),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Fixed a bug where fusions inaccurately affect the global pet exist store",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.34),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- New Contributor Title",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.375),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- New Official Fan Title (Met a developer in-game)",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.43),
					Size: UDim2.fromScale(0.96, 0.07),
					Text: "- The number of prismatics and Primordials required to fuse to the next variant have been increase to 6 and 4 respectively.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.485),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- Wheel spin has been added and is available to Premium Users.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.53),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Boost Bundles have been added to the game. Get more boost for significantly cheaper.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.575),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- In-game Update Log has been added",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.62),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Pet Mastery no longer counts Prismatics or Primordials towards progress",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.665),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- New 500k visits Event Egg (2 Prismatics, 1 Primordial)",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.735),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: "- New exclusive pets available in the shop for purchase",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.78),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Premium players are now boosted with an inherent 10% additional luck when hatching",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.835),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Pet Mastery now has an option for Exclusive Pets, however, there are no challenges for limited pets.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
