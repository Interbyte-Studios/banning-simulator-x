import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for Update 4.
 *
 * @returns Roact element.
 */
export const Update4Log = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.01),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "🎥 New Content 🎥",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.03),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "- Throwback Egg (Limited)🥚! Only available till update 5.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.05),
					Size: UDim2.fromScale(0.96, 0.018),
					Text: "- Prestige Leaderboard",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.07),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "- Time Trials Leaderboard (Highest Wave on Hard Mode)",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.09),
					Size: UDim2.fromScale(0.96, 0.018),
					Text: `- Currency purchases in shop`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.11),
					Size: UDim2.fromScale(0.96, 0.018),
					Text: `- New titles for World Prestige!`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.13),
					Size: UDim2.fromScale(0.96, 0.017),
					Text: `- New titles for Time Trials!`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.15),
					Size: UDim2.fromScale(0.96, 0.017),
					Text: "- Pet Mastery now supports exclusive / limited pets!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.178),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Friendship rewards! If you're in a game with friends, all currencies obtained are increased!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.215),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Daily Rewards have been added! Earn currency, boost, and Robux eggs just by logging in to play",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.25),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Bi-Weekly Event Pet Quest! You can now complete a quest one per week to earn a free, decently statted pet!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.28),
					Size: UDim2.fromScale(0.96, 0.017),
					Text: "- Secret Hatch Bot added to our server!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.305),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "🍃 Quality of Life Improvements 🍃",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.335),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- HUD UI remaster. Pet Index, Mastery, and Accolades have been moved to the front of the UI.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.37),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Auto Delete now works through the hatching interface. Select a pet to register it for auto-deletion.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.405),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Rarity pet searching! Searching a rarity instead of a pet name in the inventory will display all pets of that rarity!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.44),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Combined Stats! There's now a stat in the stats window for seeing your total damage and total bans output (for pets only)",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.48),
					Size: UDim2.fromScale(0.96, 0.04),
					Text: "- Scrollbars in UI's have been properly aligned with the right side of the UI, and their color has been changed to fit in with the UI better.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.51),
					Size: UDim2.fromScale(0.96, 0.014),
					Text: "- Renamed Prismatic rarity to Secret rarity.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.535),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "⚖️ Balance Changes ⚖️",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.565),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Robux pets have had their stats rebalanced based on community feedback.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.59),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "- Time trials has undergone some balance changes.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.615),
					Size: UDim2.fromScale(0.96, 0.02),
					Text: "🐛 Bug Fixes 🐛",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.645),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Talismans now teleport with you (same as pets) when teleporting to another area in the game",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.68),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Some issues caused by character reset have been fixed, including UI's",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.705),
					Size: UDim2.fromScale(0.96, 0.018),
					Text: "- Issues regarding the Pet mastery have been fixed",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.725),
					Size: UDim2.fromScale(0.96, 0.018),
					Text: "- NPCs colliding with map objects in Time Trials has been fixed!",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.745),
					Size: UDim2.fromScale(0.96, 0.015),
					Text: "- Time Trials bug fixes",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.485, 0.77),
					Size: UDim2.fromScale(0.96, 0.03),
					Text: "- Wheel Spin visual issues fixed including inaccurate timer displaying the time until the next available spin.",
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
