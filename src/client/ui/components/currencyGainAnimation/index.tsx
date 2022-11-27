import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";

import { Slot } from "./slot";

interface CurrencyGainAnimationProps {
	currencies: CurrenciesState;
}

/**
 *
 * @param state The current state of the store.
 * @returns The props.
 */
function mapStateToProps(state: StoreState): CurrencyGainAnimationProps {
	return {
		currencies: state.currencies,
	};
}

export const CurrencyGainAnimation = RoactRodux.connect(mapStateToProps)(
	hooks(() => {
		const slots: Array<Roact.Element> = [];
		for (let i = 0; i < 4; i++) {
			slots.push(<Slot animatedTo={UDim2.fromScale(0.1, 0.5)} icon={assetIds.images.vectors.Coin} />);
		}

		return (
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				{slots}
			</frame>
		);
	}),
);
