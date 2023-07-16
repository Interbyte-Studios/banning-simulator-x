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
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";

interface TripleHatchEggProps extends TripleHatchEggMappedProps {
	eggName: EggName;
	isVoid: boolean;
	handleHatch: (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: 1 | 3) => void;
}

interface TripleHatchEggMappedProps {
	gamepassesState: GamepassesState;
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

					props.handleHatch(props.eggName, props.isVoid ? "void" : "regular", 3);
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
