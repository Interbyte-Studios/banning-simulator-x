import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";

interface LocalMessageProps {
	messageType: AnnouncementType;
	message: string;
	id: number;
}

const cachedAnnouncements: Array<number> = [];

const LocalMessage = hooks((props: LocalMessageProps, { useBinding, useEffect }) => {
	const [transparency, setTransparency] = useBinding(0);

	const announcementColor = Color3.fromRGB(255, 255, 127);
	const errorColor = Color3.fromRGB(255, 119, 155);

	useEffect(() => {
		task.spawn(() =>
			task.delay(3, () => {
				while (transparency.getValue() < 1) {
					warn(transparency.getValue());
					task.wait(0.03);
					setTransparency(transparency.getValue() + 0.1);
				}

				cachedAnnouncements.push(props.id);
			}),
		);
	}, []);

	return (
		<canvasgroup
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0.048)}
			GroupTransparency={transparency}
		>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(44, 44, 44)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={""}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Text={props.message}
					TextColor3={props.messageType === AnnouncementType.Announcement ? announcementColor : errorColor}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(50, 50, 50) }} />
				</textlabel>
			</imagelabel>
		</canvasgroup>
	);
});

/**
 * Displays messages of specific types to players in the form of an game announcement.
 */
export const LocalMessages = hooks((_, { useContext }) => {
	const { errors } = useContext(AnnouncementContext);

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
			{errors.map((errorData) => {
				const cachedAnnouncement = cachedAnnouncements.find((id) => id === errorData.id);
				if (cachedAnnouncement !== undefined) {
					return <></>;
				}

				return (
					<LocalMessage
						message={errorData.message}
						messageType={AnnouncementType.Error}
						id={errorData.id}
						Key={errorData.id}
					/>
				);
			})}
		</frame>
	);
});
