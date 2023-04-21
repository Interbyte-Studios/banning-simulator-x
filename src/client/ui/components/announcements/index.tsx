import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface LocalMessageProps {
	messageType: AnnouncementType;
	message: string;
	id: number;
}

const cachedAnnouncements: Array<number> = [];

const LocalMessage = hooks((props: LocalMessageProps, hooks) => {
	const { useBinding, useEffect } = hooks;
	const [transparency, setTransparency] = useBinding(0);

	useEffect(() => {
		const increaseTransparency = task.delay(3, () => {
			while (transparency.getValue() < 1) {
				task.wait(0.03);
				setTransparency(transparency.getValue() + 0.1);
			}

			cachedAnnouncements.push(props.id);
		});

		return (): void => task.cancel(increaseTransparency);
	}, []);

	return (
		<canvasgroup
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 0.065)}
			GroupTransparency={transparency}
			LayoutOrder={transparency.map((value) => {
				return value >= 1 ? -1 : props.id;
			})}
		>
			<uiaspectratioconstraint AspectRatio={5.2} />
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={
					props.messageType === AnnouncementType.Announcement ? Color3.fromRGB(234, 209, 21) : Color3.fromRGB(126, 0, 0)
				}
				Size={UDim2.fromScale(0.95, 0.715)}
			>
				<uicorner CornerRadius={new UDim(0.4, 0)} />
				<BaseUIStroke
					native={{
						Thickness: 2,
						Color:
							props.messageType === AnnouncementType.Announcement
								? Color3.fromRGB(89, 82, 9)
								: Color3.fromRGB(75, 0, 0),
					}}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.575, 0.5),
						Size: UDim2.fromScale(0.8, 0.95),
						Text: props.message,
					}}
					stroke={{
						native: {
							Thickness: 1.5,
							Color:
								props.messageType === AnnouncementType.Announcement
									? Color3.fromRGB(89, 82, 9)
									: Color3.fromRGB(75, 0, 0),
						},
					}}
				/>
			</BaseFrame>
			<SpringImageLabel
				native={{
					Position: UDim2.fromScale(0.09, 0.5),
					Image:
						props.messageType === AnnouncementType.Announcement
							? assetIds.images.vectors.Announcement
							: assetIds.images.vectors.Error,
				}}
				size={{ minSize: 0.99, maxSize: 1 }}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageLabel>
		</canvasgroup>
	);
});

/**
 * Displays messages of specific types to players in the form of an game announcement.
 */
export const LocalMessages = hooks((_, { useContext }) => {
	const { errors } = useContext(AnnouncementContext);

	return (
		<BaseFrame Position={UDim2.fromScale(0.875, 0.495)} Size={UDim2.fromScale(0.23, 0.99)}>
			<uilistlayout
				Padding={new UDim(0.005, 0)}
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{errors.map((errorData) => {
				const cachedAnnouncement = cachedAnnouncements.find((id) => id === errorData.id);
				if (cachedAnnouncement !== undefined) {
					return <></>;
				}

				return (
					<LocalMessage
						message={errorData.message}
						messageType={errorData.messageType}
						id={errorData.id}
						Key={errorData.id}
					/>
				);
			})}
		</BaseFrame>
	);
});
