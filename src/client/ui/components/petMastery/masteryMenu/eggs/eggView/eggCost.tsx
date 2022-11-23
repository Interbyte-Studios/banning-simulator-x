import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyGradient } from "client/ui/elements/currencyGradient";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { EggName } from "shared/configs/eggs";
import { getEggCost } from "shared/util/getEggCost";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * @param props The properties of the roact component.
 * @param props.egg The egg to display the cost of.
 * @returns A Roact component.
 */
export function EggCostView(props: { egg: EggName }): Roact.Element {
	const eggCost = getEggCost(props.egg, false);

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
			<BaseUIStroke Color={Color3.fromRGB(255, 255, 255)} Thickness={1.5}>
				<CurrencyGradient Currency={eggCost.currencyType} />
			</BaseUIStroke>
			<CurrencyIcon
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(-0.175, 0.5)}
				size={{ maximizedSize: 1, minimizedSize: 0.9 }}
				currency={eggCost.currencyType}
			/>
		</textlabel>
	);
}
