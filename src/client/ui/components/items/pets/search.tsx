import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/**
 * Displays the counters of equipped pets and inventory size.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PetInventorySearch = hooks((props: { setSearch: (text: string) => void }, { useValue, useEffect }) => {
	const textboxRef = useValue(Roact.createRef<TextBox>());
	useEffect(() => {
		const textbox = textboxRef.value.getValue();
		assert(textbox, `Failed to get pet inventory search.`);

		const connection = textbox.GetPropertyChangedSignal("Text").Connect(() => props.setSearch(textbox.Text));
		return (): void => connection.Disconnect();
	});

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.3, 0.1)}
			Position={UDim2.fromScale(0.165, 0.055)}
			Image={assetIds.images.ui.inventory.pets.search}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textbox
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.775, 0.9)}
				Position={UDim2.fromScale(0.575, 0.5)}
				Text={""}
				PlaceholderText={"Enter pet name..."}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
				Ref={textboxRef.value}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 108, 176) }} />
			</textbox>
		</imagelabel>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
