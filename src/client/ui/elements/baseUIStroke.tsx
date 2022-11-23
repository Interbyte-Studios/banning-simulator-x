import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { Currency } from "shared/configs/currencies";

import { hooks } from "../hooks";
import { CurrencyGradient } from "./currencyGradient";
import { RankGradient } from "./rankGradient";

interface BaseUIStrokeProps {
	native: Partial<UIStroke>;
	isBillboard?: boolean;
	rankGradient?: number;
	currencyGradient?: Currency;
}

const blackColor = Color3.fromRGB(20, 46, 47);

/**
 * A UIStroke that is tagged so that it can be scaled.
 */
export const BaseUIStroke = hooks((props: BaseUIStrokeProps, hooks) => {
	const { useEffect, useValue } = hooks;

	const uiStrokeRef = useValue(Roact.createRef<UIStroke>());

	useEffect(() => {
		const uiStroke = uiStrokeRef.value.getValue();
		assert(uiStroke, `Failed to get UIStroke roact ref`);

		CollectionService.AddTag(
			uiStroke,
			props.isBillboard !== undefined && props.isBillboard === true ? "Billboard_UIStroke" : "Normal_UIStroke",
		);
	});

	if (props.rankGradient !== undefined) {
		return (
			<uistroke Color={props.native.Color ?? blackColor} {...props.native} Ref={uiStrokeRef.value}>
				<RankGradient Rank={props.rankGradient} />
			</uistroke>
		);
	} else if (props.currencyGradient !== undefined) {
		return (
			<uistroke Color={props.native.Color ?? blackColor} {...props.native} Ref={uiStrokeRef.value}>
				<CurrencyGradient Currency={props.currencyGradient} />
			</uistroke>
		);
	}

	return <uistroke Color={props.native.Color ?? blackColor} {...props.native} Ref={uiStrokeRef.value} />;
});
