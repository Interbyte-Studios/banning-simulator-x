import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";

import { font, vec2Middle } from "../commonValues";
import { BaseUIStroke } from "../elements/baseUIStroke";
import { hooks } from "../hooks";

type DatastoreEventType = "x2Luck" | "x2Experience" | "x2Currency" | "x3Currency";

// Displays active events.
export const DatastoreEvents = hooks((props: { enabled: boolean }, { useState, useEffect }) => {
	const [eventsEnabled, setEventsEnabled] = useState<Array<DatastoreEventType>>([]);

	if (!props.enabled) {
		return <></>;
	}

	useEffect(() => {
		const connections: Array<RBXScriptConnection> = [];

		const x2CurrencyConnection = ReplicatedStorage.events.x2Currency.GetPropertyChangedSignal("Value").Connect(() => {
			if (ReplicatedStorage.events.x2Currency.Value) {
				if (eventsEnabled.includes("x2Currency")) {
					return;
				}

				setEventsEnabled([...eventsEnabled, "x2Currency"]);
			} else {
				if (eventsEnabled.includes("x2Currency")) {
					setEventsEnabled([...eventsEnabled.filter((eventType) => eventType !== "x2Currency")]);
				}
			}
		});
		connections.push(x2CurrencyConnection);

		const x3CurrencyConnection = ReplicatedStorage.events.x3Currency.GetPropertyChangedSignal("Value").Connect(() => {
			if (ReplicatedStorage.events.x3Currency.Value) {
				if (eventsEnabled.includes("x3Currency")) {
					return;
				}

				setEventsEnabled([...eventsEnabled, "x3Currency"]);
			} else {
				if (eventsEnabled.includes("x3Currency")) {
					setEventsEnabled([...eventsEnabled.filter((eventType) => eventType !== "x3Currency")]);
				}
			}
		});
		connections.push(x3CurrencyConnection);

		const x2LuckConnection = ReplicatedStorage.events.x2Luck.GetPropertyChangedSignal("Value").Connect(() => {
			if (ReplicatedStorage.events.x2Currency.Value) {
				if (eventsEnabled.includes("x2Luck")) {
					return;
				}

				setEventsEnabled([...eventsEnabled, "x2Luck"]);
			} else {
				if (eventsEnabled.includes("x2Luck")) {
					setEventsEnabled([...eventsEnabled.filter((eventType) => eventType !== "x2Luck")]);
				}
			}
		});
		connections.push(x2LuckConnection);

		const x2ExperienceConnection = ReplicatedStorage.events.x2Experience
			.GetPropertyChangedSignal("Value")
			.Connect(() => {
				if (ReplicatedStorage.events.x2Currency.Value) {
					if (eventsEnabled.includes("x2Experience")) {
						return;
					}

					setEventsEnabled([...eventsEnabled, "x2Experience"]);
				} else {
					if (eventsEnabled.includes("x2Experience")) {
						setEventsEnabled([...eventsEnabled.filter((eventType) => eventType !== "x2Experience")]);
					}
				}
			});
		connections.push(x2ExperienceConnection);

		return (): void => connections.forEach((conn) => conn.Disconnect());
	});

	const messagesToDisplay: Array<Roact.Element> = [];
	if (eventsEnabled.includes("x2Currency")) {
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={"🤑x2 Currency Event🤑"}
				TextColor3={Color3.fromRGB(255, 141, 1)}
				TextScaled={true}
				LayoutOrder={1}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(104, 57, 0) }} />
			</textlabel>,
		);
	}

	if (eventsEnabled.includes("x3Currency")) {
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={"🤑x3 Currency Event🤑"}
				TextColor3={Color3.fromRGB(255, 141, 1)}
				TextScaled={true}
				LayoutOrder={2}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(104, 57, 0) }} />
			</textlabel>,
		);
	}

	if (eventsEnabled.includes("x2Experience")) {
		messagesToDisplay.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Font={font}
				Text={"⭐x2 Experience Event⭐"}
				TextColor3={Color3.fromRGB(195, 255, 0)}
				TextScaled={true}
				LayoutOrder={3}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(89, 116, 0) }} />
			</textlabel>,
		);
	}

	if (eventsEnabled.includes("x2Luck")) {
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
