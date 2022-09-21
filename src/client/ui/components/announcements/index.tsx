import Roact from "@rbxts/roact";
import { font } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";

interface LocalMessagesProps {
	currentMessage: { message: string; announcementType: "errors" | "announcements" } | undefined;
}

/**
 * Roact component to handle errors.
 */
export const LocalMessages = hooks((props: LocalMessagesProps) => {
	const display: Array<Roact.Element> = [];

	if (props.currentMessage) {
		const element = (
			<textlabel
				Size={UDim2.fromScale(1, 0.8)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={
					props.currentMessage.announcementType === "errors"
						? Color3.fromRGB(232, 128, 128)
						: Color3.fromRGB(237, 209, 122)
				}
				Text={props.currentMessage.message}
				Font={font}
			>
				<BaseUIStroke Thickness={1.5} />
			</textlabel>
		);

		display.push(element);
	}

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.6, 0.075)}
			Position={UDim2.fromScale(0.5, 0.025)}
		>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			{display}
		</frame>
	);
});
