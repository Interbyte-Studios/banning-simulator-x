import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { Variants } from "shared/configs/pets";
import { ValidEggAmount, validEggAmount } from "shared/remotes/eggs/hatchEgg";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { RebirthState } from "shared/rodux/rebirths";

interface TripleHatchEggProps extends TripleHatchEggMappedProps {
	eggName: EggName;
	isVoid: boolean;
	handleHatch: (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: ValidEggAmount) => void;
}

interface TripleHatchEggMappedProps {
	gamepassesState: GamepassesState;
	rebirths: RebirthState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TripleHatchEggMappedProps {
	return {
		gamepassesState: state.gamepasses,
		rebirths: state.rebirths,
	};
}

/**
 * Roact imagebutton component to hatch 3 eggs.
 */
export const TripleHatchEggButton = RoactRodux.connect(mapStateToProps)((props: TripleHatchEggProps): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.65, 0.75),
				Image: assetIds.images.buttons["teal button"],
			}}
			size={{ minSize: 0.1, maxSize: 0.12 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MajorEngagement);

					if (!props.gamepassesState["Triple Hatch"]) {
						MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASSES["Triple Hatch"]);
						return;
					}

					const hatchAmount = 3 + props.rebirths.additionalEggs;
					if (!validEggAmount(hatchAmount)) {
						return warn(`Attempt to hatch invalid amount of eggs: ${hatchAmount}`);
					}
					props.handleHatch(props.eggName, props.isVoid ? "void" : "regular", hatchAmount);
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(1, 1),
					Text: "T",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(54, 130, 133) }, isBillboard: true }}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.95),
						Size: UDim2.fromScale(1, 0.4),
						Text: "Triple",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(54, 130, 133) }, isBillboard: true }}
				/>
			</StrokeTextLabel>
		</SpringImageButton>
	);
});
