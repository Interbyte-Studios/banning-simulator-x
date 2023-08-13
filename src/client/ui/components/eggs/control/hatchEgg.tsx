import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { ValidEggAmount, validEggAmount } from "shared/remotes/eggs/hatchEgg";
import { StoreState } from "shared/rodux";
import { RebirthState } from "shared/rodux/rebirths";

interface HatchEggProps extends HatchEggMappedProps {
	eggName: EggName;
	isVoid: boolean;
	handleHatch: (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: ValidEggAmount) => void;
}

interface HatchEggMappedProps {
	rebirths: RebirthState;
}

/**
 * @param state The Rodux state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): HatchEggMappedProps => {
	return {
		rebirths: state.rebirths,
	};
};

/**
 * Roact imagebutton component to hatch an egg.
 *
 * @param props The component props.
 * @param props.eggName The name of the egg to hatch.
 * @param props.isVoid Whether the egg is a void egg.
 * @param props.handleHatch The callback to handle the hatch.
 * @returns The Roact element.
 */
export const HatchEggButton = RoactRodux.connect(mapStateToProps)((props: HatchEggProps): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.35, 0.75),
				Image: assetIds.images.buttons["purple button"],
			}}
			size={{ minSize: 0.1, maxSize: 0.12 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: async (): Promise<void> => {
					playSFX(UIEngagement.MajorEngagement);

					const hatchAmount = 1 + props.rebirths.additionalEggs;
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
					Text: "Q",
				}}
				stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(122, 54, 133) }, isBillboard: true }}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.95),
						Size: UDim2.fromScale(1, 0.4),
						Text: "Hatch",
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(122, 54, 133) }, isBillboard: true }}
				/>
			</StrokeTextLabel>
		</SpringImageButton>
	);
});
