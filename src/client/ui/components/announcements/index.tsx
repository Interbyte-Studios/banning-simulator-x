import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";

export enum LocalMessageType {
	Error,
	Announcement,
}

interface LocalMessageProps {
	messageType: LocalMessageType;
	message: string;
}

const LocalMessage = hooks((props: LocalMessageProps, { useBinding, useEffect }) => {
	const [transparency, setTransparency] = useBinding(0);

	const announcementColor = Color3.fromRGB(255, 255, 127);
	const errorColor = Color3.fromRGB(255, 119, 155);

	useEffect(() => {
		task.wait(3);

		for (let i = 0; i < 1; i++) {
			task.wait(0.1);
			setTransparency(transparency.getValue() + 0.1);
		}
	});

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(44, 44, 44)}
			Size={UDim2.fromScale(1, 0.048)}
			Image={""}
			BackgroundTransparency={transparency.getValue()}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				Text={props.message}
				TextColor3={props.messageType === LocalMessageType.Announcement ? announcementColor : errorColor}
				TextScaled={true}
				Font={font}
				Transparency={transparency.getValue()}
			>
				<BaseUIStroke Thickness={1} Color={Color3.fromRGB(50, 50, 50)} />
			</textlabel>
		</imagelabel>
	);
});

/**
 * Displays messages of specific types to players in the form of an game announcement.
 */
export const LocalMessages = hooks((_, { useContext }) => {
	const { errors } = useContext(AnnouncementContext);
	print(errors);

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.905, 0.495)}
			Size={UDim2.fromScale(0.17, 0.99)}
		>
			<uilistlayout
				Padding={new UDim(0.005, 0)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
			/>
		</frame>
	);
});
