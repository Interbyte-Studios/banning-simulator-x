import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
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
		task.spawn(() =>
			task.delay(3, () => {
				while (transparency.getValue() < 1) {
					task.wait(0.03);
					setTransparency(transparency.getValue() + 0.1);
				}

				cachedAnnouncements.push(props.id);
			}),
		);
	}, []);

	const maxSize = 1;
	const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

	const minSize = 0.99;
	const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maxSize);

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
			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={
					props.messageType === AnnouncementType.Announcement ? Color3.fromRGB(234, 209, 21) : Color3.fromRGB(126, 0, 0)
				}
				Position={UDim2.fromScale(0.5, 0.5)}
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
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.575, 0.5)}
					Size={UDim2.fromScale(0.8, 0.95)}
					Text={props.message}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke
						native={{
							Thickness: 1.5,
							Color:
								props.messageType === AnnouncementType.Announcement
									? Color3.fromRGB(89, 82, 9)
									: Color3.fromRGB(75, 0, 0),
						}}
					/>
				</textlabel>
			</frame>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, value);
				})}
				Position={UDim2.fromScale(0.09, 0.5)}
				Image={
					props.messageType === AnnouncementType.Announcement
						? assetIds.images.vectors.Announcement
						: assetIds.images.vectors.Error
				}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					/* eslint-disable jsdoc/require-jsdoc */
					MouseLeave: (): void => motor.setGoal(maxSpring),
					MouseEnter: (): void => motor.setGoal(minSpring),
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
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
			Position={UDim2.fromScale(0.875, 0.495)}
			Size={UDim2.fromScale(0.23, 0.99)}
		>
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
		</frame>
	);
});
