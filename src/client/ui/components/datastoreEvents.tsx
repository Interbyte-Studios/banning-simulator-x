import Roact, { update } from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";

import { BaseFrame } from "../elements/baseElements/baseFrame";
import { StrokeTextLabel } from "../elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "../hooks";

type DatastoreEventType = "luck" | "currency" | "experience";
interface DatastoreEventCache {
	eventName: DatastoreEventType;
	multiplier: number;
}

const checkForEvent = (eventName: DatastoreEventType, isEnabled: boolean, cachedState: ReadonlyArray<DatastoreEventCache>, updateState: (events: Array<DatastoreEventCache>) => void): void => {
	if (!isEnabled) {
		const cachedEventIndex = cachedState.findIndex((eventData) => eventData.eventName === "currency");
		if (cachedEventIndex === undefined) {
			return;
		}

		const newCachedState = [...cachedState];
		newCachedState.unorderedRemove(cachedEventIndex);
		updateState(newCachedState);
		return;
	}

	const cachedEvent = cachedState.find((eventData) => eventData.eventName === "currency");
	if (cachedEvent !== undefined) {
		return;
	}

	if (eventName === 'luck') {
		updateState([{ eventName: "luck", multiplier: 2 }]);
		return;
	}

	const multiplierIntValue = ReplicatedStorage.events[eventName].FindFirstChildOfClass("IntValue");
	if (multiplierIntValue === undefined) {
		warn(`Failed to display event for ${eventName} because multiplier IntValue was undefined.`);
		return;
	}

	warn(`Displaying event for ${eventName} with multiplier ${multiplierIntValue.Value}.`)
	updateState([{ eventName, multiplier: multiplierIntValue.Value }]);
}

// Displays active events.
export const DatastoreEvents = hooks((props: { enabled: boolean }, { useState, useEffect }) => {
	const [eventsEnabled, setEventsEnabled] = useState<Array<DatastoreEventCache>>([]);

	if (!props.enabled) {
		return <></>;
	}

	useEffect(() => {
		const eventsToEnable: Array<DatastoreEventCache> = [];
		if (ReplicatedStorage.events.luck.enabled.Value) {
			eventsToEnable.push({ eventName: "luck", multiplier: 2 });
		}

		if (ReplicatedStorage.events.currency.enabled.Value) {
			eventsToEnable.push({ eventName: "currency", multiplier: ReplicatedStorage.events.currency.multiplier.Value });
		}

		if (ReplicatedStorage.events.experience.enabled.Value) {
			eventsToEnable.push({ eventName: "experience", multiplier: ReplicatedStorage.events.experience.multiplier.Value });
		}

		setEventsEnabled(eventsToEnable);
	}, []);

	useEffect(() => {
		const connections: Array<RBXScriptConnection> = [];

		const currencyConnection = ReplicatedStorage.events.currency.enabled
			.GetPropertyChangedSignal("Value")
			.Connect(() => checkForEvent(
				"currency",
				ReplicatedStorage.events.currency.enabled.Value,
				eventsEnabled,
				setEventsEnabled
			));
		connections.push(currencyConnection);

		const experienceConnection = ReplicatedStorage.events.experience.enabled
			.GetPropertyChangedSignal("Value")
			.Connect(() => checkForEvent(
				"experience",
				ReplicatedStorage.events.experience.enabled.Value,
				eventsEnabled,
				setEventsEnabled
			));
		connections.push(experienceConnection);

		const luckConnection = ReplicatedStorage.events.luck.enabled.GetPropertyChangedSignal("Value").Connect(() => checkForEvent(
				"luck",
				ReplicatedStorage.events.luck.enabled.Value,
				eventsEnabled,
				setEventsEnabled
			));
		connections.push(luckConnection);

		return (): void => connections.forEach((conn) => conn.Disconnect());
	}, [props.enabled]);

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
