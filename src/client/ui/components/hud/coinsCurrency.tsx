import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { OpenShop } from "./openShop";

interface CoinsCurrencyMappedProps {
	coins: number;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): CoinsCurrencyMappedProps {
	return {
		coins: state.currencies.coins,
	};
}

export const CoinsCurrency = RoactRodux.connect(mapStateToProps)(
	hooks((props: CoinsCurrencyMappedProps) => {
		return (
			<imagelabel
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0, 0.5)}
				Image={assetIds.images.ui.hud["viewer background"]}
				ScaleType={Enum.ScaleType.Fit}
				Size={UDim2.fromScale(0.95, 0.155)}
				Position={UDim2.fromScale(0.01, 0.45)}
			>
				<uiaspectratioconstraint AspectRatio={4.8} />
				<OpenShop minimizedSize={0.8} maximizedSize={0.9} position={UDim2.fromScale(0.95, 0.5)} />
				<CurrencyIcon
					position={UDim2.fromScale(0.075, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1.05 }}
					currency={"coins"}
				/>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.65, 0.9)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Font={font}
					Text={twoDpAbbreviator.numberToString(props.coins)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<uistroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1.5}>
						<CurrencyGradient Currency={"coins"} />
					</uistroke>
				</textlabel>
			</imagelabel>
		);
	}),
);
