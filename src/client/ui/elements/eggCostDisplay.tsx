import Roact from "@rbxts/roact";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import { Currency } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { font, vec2Middle } from "../commonValues";

interface eggCostDisplayProps {
	adornee: BasePart;
	cost: number;
	currency: Currency;
	isVoid: boolean;
}

/* eslint-disable jsdoc/require-jsdoc */
export function EggCostDisplay(props: eggCostDisplayProps): Roact.Element {
	return (
		<surfacegui
			Adornee={props.adornee}
			Face={Enum.NormalId.Front}
			LightInfluence={0.8}
			ResetOnSpawn={false}
			SizingMode={"PixelsPerStud"}
			PixelsPerStud={50}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={new UDim2(0.6, 0, 0.5, 0)}
				Size={new UDim2(0.8, 0, 0.7, 0)}
				Font={font}
				Text={twoDpAbbreviator.numberToString(props.cost)}
				TextScaled={true}
				TextColor3={props.isVoid ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0)}
			>
				<imagelabel
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(0.05, 0, 0.5, 0)}
					Size={new UDim2(0.35, 0, 0.8, 0)}
					Image={getCurrencyIcon(props.currency)}
					ScaleType={Enum.ScaleType.Fit}
				/>
			</textlabel>
		</surfacegui>
	);
}
