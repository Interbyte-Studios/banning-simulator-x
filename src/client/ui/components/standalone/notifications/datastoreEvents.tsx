import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";

import { BaseFrame } from "../../../elements/baseElements/baseFrame";
import { StrokeTextLabel } from "../../../elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "../../../hooks";

type DatastoreEventType = "luck" | "currency" | "experience";
interface DatastoreEventCache {
	eventName: DatastoreEventType;
	multiplier: number;
}

// Displays active events.
export const DatastoreEvents = hooks((_, { useState, useEffect }) => {
	const [eventsEnabled, setEventsEnabled] = useState<Array<DatastoreEventCache>>([]);

	useEffect(() => {
		const eventsToEnable: Array<DatastoreEventCache> = [];
		if (ReplicatedStorage.events.luck.enabled.Value) {
			eventsToEnable.push({ eventName: "luck", multiplier: 2 });
		}

		if (ReplicatedStorage.events.currency.enabled.Value) {
			eventsToEnable.push({ eventName: "currency", multiplier: ReplicatedStorage.events.currency.multiplier.Value });
		}

		if (ReplicatedStorage.events.experience.enabled.Value) {
			eventsToEnable.push({
				eventName: "experience",
				multiplier: ReplicatedStorage.events.experience.multiplier.Value,
			});
		}

		setEventsEnabled(eventsToEnable);
	}, []);

	useEffect(() => {
		const connection = ReplicatedStorage.events.timeUpdated.GetPropertyChangedSignal("Value").Connect(() => {
			task.wait(1);
			const eventsToEnable: Array<DatastoreEventCache> = [];

			if (ReplicatedStorage.events.luck.enabled.Value) {
				eventsToEnable.push({ eventName: "luck", multiplier: 2 });
			}

			if (ReplicatedStorage.events.currency.enabled.Value) {
				if (ReplicatedStorage.events.currency.multiplier.Value > 2) {
					eventsToEnable.push({
						eventName: "currency",
						multiplier: ReplicatedStorage.events.currency.multiplier.Value,
					});
				}
			}

			if (ReplicatedStorage.events.experience.enabled.Value) {
				if (ReplicatedStorage.events.experience.multiplier.Value > 2) {
					eventsToEnable.push({
						eventName: "experience",
						multiplier: ReplicatedStorage.events.experience.multiplier.Value,
					});
				}
			}

			setEventsEnabled(eventsToEnable);
		});

		return (): void => connection.Disconnect();
	}, []);

	const messagesToDisplay: Array<Roact.Element> = [];

	const currencyEvent = eventsEnabled.find((eventData) => eventData.eventName === "currency");
	if (currencyEvent !== undefined) {
		const currencyMessage = (
			<StrokeTextLabel
				native={{
					Text: `🤑x${currencyEvent.multiplier} Currency Event🤑`,
					TextColor3: Color3.fromRGB(255, 141, 1),
					LayoutOrder: 1,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(104, 57, 0) } }}
			/>
		);

		messagesToDisplay.push(currencyMessage);
	}

	const experienceEvent = eventsEnabled.find((eventData) => eventData.eventName === "experience");
	if (experienceEvent !== undefined) {
		const experienceMessage = (
			<StrokeTextLabel
				native={{
					Text: `⭐x${experienceEvent.multiplier} Experience Event⭐`,
					TextColor3: Color3.fromRGB(195, 255, 0),
					LayoutOrder: 3,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(89, 116, 0) } }}
			/>
		);

		messagesToDisplay.push(experienceMessage);
	}

	const luckEvent = eventsEnabled.find((eventData) => eventData.eventName === "luck");
	if (luckEvent !== undefined) {
		const luckMessage = (
			<StrokeTextLabel
				native={{
					Text: `🍀x2 Luck Event🍀`,
					TextColor3: Color3.fromRGB(0, 178, 42),
					LayoutOrder: 2,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(0, 90, 21) } }}
			/>
		);

		messagesToDisplay.push(luckMessage);
	}

	return (
		<BaseFrame Position={UDim2.fromScale(0.5, 0.035)} Size={UDim2.fromScale(0.8, 0.05)}>
			<uigridlayout
				CellPadding={UDim2.fromScale(0, 0.1)}
				CellSize={UDim2.fromScale(0.45, 1)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{messagesToDisplay}
		</BaseFrame>
	);
});
