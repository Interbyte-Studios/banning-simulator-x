import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { Egg, EggName } from "shared/configs/eggs";

import { EggDecal } from "./eggDecal";
import { EggTitle } from "./title";
import { ViewEgg } from "./viewEgg";

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
			<EggTitle eggName={props.eggName} />
			<ViewEgg eggName={props.eggName} />
		</imagelabel>
	);
});
