import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { getEggImage } from "client/util/getEggImage";
import { EggName } from "shared/configs/eggs";

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
