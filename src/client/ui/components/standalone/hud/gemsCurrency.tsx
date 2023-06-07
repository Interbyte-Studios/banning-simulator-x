import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { OpenShop } from "./openShop";

interface GemsCurrencyMappedProps {
	gems: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): GemsCurrencyMappedProps {
	return {
		gems: state.currencies.gems,
	};
}

export const GemsCurrency = RoactRodux.connect(mapStateToProps)(
	hooks((props: GemsCurrencyMappedProps) => {
		return (
			<ImageLabel
				native={{
					AnchorPoint: new Vector2(0, 0.5),
					Image: assetIds.images.ui.hud["viewer background"],
					Size: UDim2.fromScale(0.95, 0.155),
					Position: UDim2.fromScale(0.03, 0.675),
				}}
			>
				<uiaspectratioconstraint AspectRatio={4.8} />
				<OpenShop minimizedSize={0.8} maximizedSize={0.9} position={UDim2.fromScale(0.95, 0.5)} />
				<CurrencyIcon
					position={UDim2.fromScale(0.075, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1.05 }}
					currency={"gems"}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.65, 0.9),
						Text: twoDpAbbreviator.numberToString(props.gems),
					}}
					stroke={{
						currencyGradient: "gems",
						native: { Thickness: 1.5, Color: Color3.fromRGB(255, 255, 255) },
					}}
				/>
			</ImageLabel>
		);
	}),
);
