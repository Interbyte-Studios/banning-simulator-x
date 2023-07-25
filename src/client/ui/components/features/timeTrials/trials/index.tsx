import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { TimeTrialsDifficultySelection } from "./difficultySelection";
import { TimeTrialsUpgrades } from "./upgrades";

enum MenuType {
	Trials,
	Upgrades,
}

interface TrialsProps extends TrialsMappedProps {
	hideMenu: () => void;
	setTrialsEnabled: (value: boolean) => void;
}

interface TrialsMappedProps {
	currencies: CurrenciesState;
}

/**
 * @param state The rodux state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): TrialsMappedProps => {
	return {
		currencies: state.currencies,
	};
};

/**
 * Time Trials.
 */
export const Trials = RoactRodux.connect(mapStateToProps)(
	hooks((props: TrialsProps, { useState }) => {
		const [menu, setMenu] = useState<MenuType>(MenuType.Trials);

		let menuToDisplay: Roact.Element | undefined;
		if (menu === MenuType.Trials) {
			menuToDisplay = (
				<TimeTrialsDifficultySelection setTrialsEnabled={(value): void => props.setTrialsEnabled(value)} />
			);
		} else if (menu === MenuType.Upgrades) {
			menuToDisplay = <TimeTrialsUpgrades />;
		}

		return (
			<ImageLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.5),
					Size: UDim2.fromScale(0.5, 0.6),
					Image: assetIds.images.ui.inventory.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.36} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.075),
						Size: UDim2.fromScale(0.4, 0.15),
						Text: "Time Trials",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(122, 41, 0) } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(1.08, 0.37),
						Image: "",
						BackgroundColor3: Color3.fromRGB(12, 134, 211),
						BackgroundTransparency: 0,
					}}
					size={{ minSize: 0.13, maxSize: 0.16 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setMenu(MenuType.Trials);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke
						native={{
							Thickness: 4,
							Color: Color3.fromRGB(0, 108, 176),
						}}
					/>
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.9),
							Image: assetIds.images.vectors.Sword,
						}}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.9),
							Size: UDim2.fromScale(1, 0.3),
							Text: "Trials",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(1.08, 0.631),
						Image: "",
						BackgroundColor3: Color3.fromRGB(12, 134, 211),
						BackgroundTransparency: 0,
					}}
					size={{ minSize: 0.13, maxSize: 0.16 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setMenu(MenuType.Upgrades);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke
						native={{
							Thickness: 4,
							Color: Color3.fromRGB(0, 108, 176),
						}}
					/>
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.9),
							Image: assetIds.images.vectors.trading.Upgrade,
						}}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.9),
							Size: UDim2.fromScale(1, 0.3),
							Text: "Upgrades",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</SpringImageButton>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(12, 134, 211)}
					Position={UDim2.fromScale(0.5, 1.06)}
					Size={UDim2.fromScale(0.265, 0.09)}
				>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

					<CurrencyIcon
						position={UDim2.fromScale(0.12, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={"gears"}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.65, 0.5),
							Size: UDim2.fromScale(0.7, 1),
							Text: statsAbbreviator.numberToString(props.currencies.gears),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				{menuToDisplay}

				<ExitButton
					minimizedSize={0.085}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
					Position={UDim2.fromScale(0.985, 0.115)}
				/>
			</ImageLabel>
		);
	}),
);
