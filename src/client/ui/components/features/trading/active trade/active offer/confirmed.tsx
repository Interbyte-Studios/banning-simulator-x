import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";

/**
 * Shows that a player has confirmed their offer.
 *
 * @param props The properties of the component.
 * @param props.player The player that has confirmed their offer.
 * @returns The Roact element to render.
 */
export const ActiveOfferConfirmed = (props: { player: Player }): Roact.Element => {
	const isLocalPlayer = props.player.UserId === Players.LocalPlayer.UserId;
	if (isLocalPlayer) {
		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				Position={UDim2.fromScale(0.5, 0.965)}
				Size={UDim2.fromScale(0.85, 0.08)}
			>
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(14, 112, 173) }} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Confirmed",
						TextColor3: Color3.fromRGB(85, 255, 127),
					}}
					stroke={{ native: { Color: Color3.fromRGB(45, 136, 66), Thickness: 2 } }}
				/>
			</BaseFrame>
		);
	}

	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.8),
				Size: UDim2.fromScale(0.8, 0.1),
				Text: "Confirmed",
				TextColor3: Color3.fromRGB(85, 255, 127),
			}}
			stroke={{ native: { Color: Color3.fromRGB(45, 136, 66), Thickness: 2 } }}
		/>
	);
};
