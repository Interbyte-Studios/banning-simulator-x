import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { vec2Middle } from "client/ui/commonValues";
import { font } from "client/ui/commonValues";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Currency } from "shared/configs/currencies";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface LocalCurrencyProps extends LocalCurrencyMappedProps {}

interface LocalCurrencyMappedProps {
	currencies: CurrenciesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): LocalCurrencyMappedProps {
	return {
		currencies: state.currencies,
	};
}

export const LocalCurrency = RoactRodux.connect(mapStateToProps)(
	hooks((props: LocalCurrencyProps, { useState }) => {
		const [amount, setAmount] = useState(0);
		const [currency, setCurrency] = useState<Currency>("coins");

		return (
			<BaseFrame BackgroundTransparency={0} BackgroundColor3={uiTextStrokeColor} Size={UDim2.fromScale(0.5, 0.09)}>
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />

				<textbox
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.55, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					Font={font}
					PlaceholderText={amount !== 0 ? statsAbbreviator.numberToString(amount) : `Input Amount: (Ex: 500k)`}
					Text={amount !== 0 ? statsAbbreviator.numberToString(amount) : ""}
					PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Change={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Text: (rbx): void => {
							const text = rbx.Text;
							if (text === "") {
								return;
							}

							const number = tonumber(text);
							if (number === undefined) {
								return;
							}

							const roundedNumber = math.floor(number);
							if (roundedNumber < 0) {
								return;
							}

							if (roundedNumber > props.currencies[currency]) {
								return;
							}

							setAmount(roundedNumber);
						},
					}}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: uiDarkStrokeColor }} />
				</textbox>
				<SpringImageButton
					native={{
						AnchorPoint: vec2Middle,
						Position: UDim2.fromScale(0.065, 0.5),
						Image: currency,
					}}
					size={{ minSize: 0.9, maxSize: 1 }}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							setCurrency(currency === "coins" ? "gems" : "coins");
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</SpringImageButton>
			</BaseFrame>
		);
	}),
);
