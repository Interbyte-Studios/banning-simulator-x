import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { StoreState } from "shared/rodux";
import { EggsState } from "shared/rodux/eggs";
import { getEggCost } from "shared/util/getEggCost";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface EggCostViewProps extends EggCostViewMappedProps {
	egg: EggName;
}

interface EggCostViewMappedProps {
	eggs: EggsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): EggCostViewMappedProps {
	return {
		eggs: state.eggs,
	};
}

/**
 * @param props The properties of the roact component.
 * @param props.egg The egg to display the cost of.
 * @returns A Roact component.
 */
export const EggCostView = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggCostViewProps) => {
		const eggMasteryReducedMultiplier = getEggsMastery(props.eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(props.egg, false, eggMasteryReducedMultiplier);

		return (
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.4, 0.1)}
				Position={UDim2.fromScale(0.8, 0.2)}
				Font={font}
				Text={twoDpAbbreviator.numberToString(eggCost.amount)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseUIStroke
					native={{ Color: Color3.fromRGB(255, 255, 255), Thickness: 1.5 }}
					currencyGradient={eggCost.currencyType}
				/>
				<CurrencyIcon
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(-0.175, 0.5)}
					size={{ maximizedSize: 1, minimizedSize: 0.9 }}
					currency={eggCost.currencyType}
				/>
			</textlabel>
		);
	}),
);
