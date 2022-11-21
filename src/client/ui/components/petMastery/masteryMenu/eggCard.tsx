import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { getEggImage } from "client/util/getEggImage";
import assetIds from "shared/assets";
import { Egg, EggName } from "shared/configs/eggs";

/**
 * @param props The properties of the roact component.
 * @param props.eggName The name of the egg.
 * @returns A roact component displaying the name of the specified egg.
 */
export function EggName(props: { eggName: EggName }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.6, 0.2)}
			Size={UDim2.fromScale(0.7, 0.3)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={`${props.eggName} Egg`}
			Font={font}
		>
			<BaseUIStroke Thickness={3} />
		</textlabel>
	);
}

/**
 * @param props The properties of the roact component.
 * @param props.eggName The name of the egg.
 * @returns A roact component displaying the decal of the specified egg.
 */
export function EggDecal(props: { eggName: EggName }): Roact.Element {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.175, 0.9)}
			Position={UDim2.fromScale(0.12, 0.5)}
			Image={getEggImage(props.eggName)}
			ScaleType={Enum.ScaleType.Fit}
		/>
	);
}

/**
 * An index card of a specified egg.
 */
export const PetMasteryEggCard = hooks((props: { eggName: EggName; eggData: Egg }) => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromOffset(545, 133)}
			Image={assetIds.images.ui.index.eggBackground}
			ScaleType={Enum.ScaleType.Fit}
			LayoutOrder={props.eggData.id}
		>
			<EggDecal eggName={props.eggName} />
			<EggName eggName={props.eggName} />
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.6, 0.2)}
				Size={UDim2.fromScale(0.7, 0.3)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={`${props.eggName} Egg`}
				Font={font}
			>
				<BaseUIStroke Thickness={3} />
			</textlabel>
		</imagelabel>
	);
});
