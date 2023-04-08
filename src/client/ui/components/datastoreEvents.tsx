import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";

import { BaseFrame } from "../elements/baseElements/baseFrame";
import { BaseTextLabel } from "../elements/baseElements/baseTextLabel";
import { hooks } from "../hooks";

type DatastoreEventType = "luck" | "currency" | "experience";
interface DatastoreEventCache {
	eventName: DatastoreEventType;
	multiplier: number;
}

// Displays active events.
export const DatastoreEvents = hooks((props: { enabled: boolean }, { useState, useEffect }) => {
	const [eventsEnabled, setEventsEnabled] = useState<Array<DatastoreEventCache>>([]);

	if (!props.enabled) {
		return <></>;
	}

	useEffect(() => {
		const connections: Array<RBXScriptConnection> = [];

		const currencyConnection = ReplicatedStorage.events.currency.enabled
			.GetPropertyChangedSignal("Value")
			.Connect(() => {
				if (ReplicatedStorage.events.currency.enabled.Value) {
					const cachedEvent = eventsEnabled.find((eventData) => eventData.eventName === "currency");
					if (cachedEvent !== undefined) {
						return;
					}

					if (ReplicatedStorage.events.currency.multiplier.Value < 2) {
						return;
					}

					setEventsEnabled([
						...eventsEnabled,
						{ eventName: "currency", multiplier: ReplicatedStorage.events.currency.multiplier.Value },
					]);
				}
			});
		connections.push(currencyConnection);

		const experienceConnection = ReplicatedStorage.events.experience.enabled
			.GetPropertyChangedSignal("Value")
			.Connect(() => {
				if (ReplicatedStorage.events.experience.enabled.Value) {
					const cachedEvent = eventsEnabled.find((eventData) => eventData.eventName === "experience");
					if (cachedEvent !== undefined) {
						return;
					}

					if (ReplicatedStorage.events.experience.multiplier.Value < 2) {
						return;
					}

					setEventsEnabled([
						...eventsEnabled,
						{ eventName: "experience", multiplier: ReplicatedStorage.events.experience.multiplier.Value },
					]);
				}
			});
		connections.push(experienceConnection);

		const luckConnection = ReplicatedStorage.events.luck.enabled.GetPropertyChangedSignal("Value").Connect(() => {
			if (ReplicatedStorage.events.luck.enabled.Value) {
				const cachedEvent = eventsEnabled.find((eventData) => eventData.eventName === "luck");
				if (cachedEvent !== undefined) {
					return;
				}

				setEventsEnabled([...eventsEnabled, { eventName: "luck", multiplier: 2 }]);
			}
		});
		connections.push(luckConnection);

		return (): void => connections.forEach((conn) => conn.Disconnect());
	});

	const messagesToDisplay: Array<Roact.Element> = [];

	const currencyEvent = eventsEnabled.find((eventData) => eventData.eventName === "currency");
	const experienceEvent = eventsEnabled.find((eventData) => eventData.eventName === "experience");
	const luckEvent = eventsEnabled.find((eventData) => eventData.eventName === "luck");

	if (currencyEvent !== undefined) {
		const currencyMessage = (
			<BaseTextLabel
				native={{
					Text: `🤑${currencyEvent.multiplier} Currency Event🤑`,
					TextColor3: Color3.fromRGB(255, 141, 1),
					LayoutOrder: 1,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(104, 57, 0) } }}
			/>
		);

		messagesToDisplay.push(currencyMessage);
	}

	if (experienceEvent !== undefined) {
		const experienceMessage = (
			<BaseTextLabel
				native={{
					Text: `⭐${experienceEvent.multiplier} Experience Event⭐`,
					TextColor3: Color3.fromRGB(195, 255, 0),
					LayoutOrder: 3,
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(89, 116, 0) } }}
			/>
		);

		messagesToDisplay.push(experienceMessage);
	}

	if (luckEvent !== undefined) {
		const luckMessage = (
			<BaseTextLabel
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
