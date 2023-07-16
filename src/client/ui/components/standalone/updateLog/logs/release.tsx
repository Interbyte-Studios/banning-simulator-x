import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * The update log for the release of the game.
 *
 * @returns Roact element.
 */
export const ReleaseLog = (): Roact.Element => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.15),
					Size: UDim2.fromScale(0.95, 0.185),
					Text: "Hey guys! Thanks for being so patient with us. We’re happy to finally bring you Interbyte’s latest production, Banning Simulator X!",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.425),
					Size: UDim2.fromScale(0.95, 0.2),
					Text: "We’ve been working really hard on this game for quite a while, and we’ve got a lot of really cool content planned for some future updates!",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.8),
					Size: UDim2.fromScale(0.95, 0.365),
					Text: "We hope you guys do enjoy. We’ve tried to iron out as many bugs as possible before the release, but in the event that you run into any issues, please join our Discord and report them to a Quality Assurance team member or Developer. We will try to get on it as fast as we can.",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 108, 176) } }}
			/>
		</>
	);
};
