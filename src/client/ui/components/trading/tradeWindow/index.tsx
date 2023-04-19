import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiClaimButtonStrokeColor, uiOffButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

import { LocalCurrency } from "./offerUtil/localCurrency";
import { Offer } from "./offerUtil/offer";

interface TradeWindowProps extends TradeWindowMappedProps {}

interface TradeWindowMappedProps {
	pets: PetsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TradeWindowMappedProps {
	return {
		pets: state.pets,
	};
}

export const TradeWindow = RoactRodux.connect(mapStateToProps)(
	hooks((props: TradeWindowProps) => {
		return (
			<BaseFrame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
				<LocalCurrency />
				<Offer offerType={"Local"} />
				<Offer offerType={"Foreign"} />
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.765, 0.755),
						Size: UDim2.fromScale(0.44, 0.1),
						Text: "All trades are final. Be careful and mindful when trading others.",
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.88, 0.89),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Confirm",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.88, 0.89),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.15, maxSize: 0.2 }}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Cancel",
						}}
						stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	}),
);
