import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";

import { font, vec2Middle } from "../commonValues";
import { BaseUIStroke } from "../elements/baseElements/baseUIStroke";
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
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={`🤑${currencyEvent.multiplier} Currency Event🤑`}
				TextColor3={Color3.fromRGB(255, 141, 1)}
				TextScaled={true}
				LayoutOrder={1}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(104, 57, 0) }} />
			</textlabel>,
		);
	}

	if (experienceEvent !== undefined) {
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={`⭐${experienceEvent.multiplier} Experience Event⭐`}
				TextColor3={Color3.fromRGB(195, 255, 0)}
				TextScaled={true}
				LayoutOrder={3}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(89, 116, 0) }} />
			</textlabel>,
		);
	}

	if (luckEvent !== undefined) {
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={"🍀x2 Luck Event🍀"}
				TextColor3={Color3.fromRGB(0, 178, 42)}
				TextScaled={true}
				LayoutOrder={4}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 90, 21) }} />
			</textlabel>,
		);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.035)}
			Size={UDim2.fromScale(0.8, 0.05)}
		>
			<uigridlayout
				CellPadding={UDim2.fromScale(0, 0.1)}
				CellSize={UDim2.fromScale(0.45, 1)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
			/>
			{messagesToDisplay}
		</frame>
	);
});
