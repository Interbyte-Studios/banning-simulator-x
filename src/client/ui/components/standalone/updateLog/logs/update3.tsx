import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 3.
 *
 * @returns Roact element.
 */
export const Update3Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.025),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "🎥New Content🎥",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.077),
					Size: UDim2.fromScale(0.96, 0.066),
					Text: "- New wheel spin feature. One free spin daily. Exclusive pets, boost, and currency rewards available.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.13),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: "- Boost Bundles! Purchase a vast amount of boost for significantly cheaper.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.195),
					Size: UDim2.fromScale(0.96, 0.06),
					Text: "- Time Trials ⌛... Challenge yourself... Last 10 minutes against endless waves of NPCs that get significantly stronger each wave. Beware... they fight back!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.255),
					Size: UDim2.fromScale(0.96, 0.05),
					Text: `- 4 New weapons purchasable with "Gears", the new currency granted through Time Trials!`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.3),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: `- New Talisman purchasable with "Gears"!`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.335),
					Size: UDim2.fromScale(0.96, 0.025),
					Text: `- New Permanent Time Trials egg!`,
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
					Position: UDim2.fromScale(0.485, 0.375),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "⚖️ Balance Changes⚖️",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.44),
					Size: UDim2.fromScale(0.96, 0.08),
					Text: "- We've decided that the community knows best, and for the time being, we will only have robux eggs available for purchase in the shop. Each robux egg be available for 3 weeks to a month at a time.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.58),
					Size: UDim2.fromScale(0.96, 0.045),
					Text: "- World Prestige boost costs have been increased. 30 minute boosts, 1 hour boosts, and 2 hour boosts, have all had their costs increased to 2, 4, and 6 prestige tokens respectively",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.64),
					Size: UDim2.fromScale(0.96, 0.065),
					Text: "- x2 FASTER EGG HATCHING FOR ALL PLAYERS (including P2P). This change has been implemented based on community feedback. It's a permanent balance change. 🙂",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.695),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "- Robux pets have been nerfed significantly, based on community feedback.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.735),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "🐛 Bug Fixes🐛",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.78),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "- Keybind functionality has been improved. Should be much smoother now.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.83),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "- UI's will maintain their functionality upon re-rendering. This should fix a lot of issues players have been experiencing.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.88),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "- Chunk system / Streaming Enabled support has been added, significantly improving the performance of clients.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
