import Roact from "@rbxts/roact";
import { font, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";

/**
 * Searches for specific pets.
 *
 * @param props The props for the component.
 * @param props.updateSearch The function to update the search.
 * @returns The Roact element to render.
 */
export const LocalSearch = (props: { updateSearch: (query: string) => void }): Roact.Element => {
	return (
		<BaseFrame
			BackgroundTransparency={0}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.5, 0.09)}
			Size={UDim2.fromScale(0.95, 0.07)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />

			<textbox
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.9)}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={""}
				TextScaled={true}
				PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
				PlaceholderText={"Search..."}
				Change={{
					/**
					 * Called when the textbox is changed.
					 *
					 * @param textBox The textbox that was changed.
					 * @returns A callback to update the current search query state.
					 */
					Text: (textBox): void => props.updateSearch(textBox.Text),
				}}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />
			</textbox>
		</BaseFrame>
	);
};
