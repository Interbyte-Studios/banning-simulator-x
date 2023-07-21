import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

interface HatchEggProps {
	eggName: EggName;
	isVoid: boolean;
	handleHatch: (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: 1 | 3) => void;
}

/**
 * Roact imagebutton component to hatch an egg.
 *
 * @param props The component props.
 * @param props.eggName The name of the egg to hatch.
 * @param props.isVoid Whether the egg is a void egg.
 * @param props.handleHatch The callback to handle the hatch.
 * @returns The Roact element.
 */
export const HatchEggButton = (props: HatchEggProps): Roact.Element => {
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

					props.handleHatch(props.eggName, props.isVoid ? "void" : "regular", 1);
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(1, 1),
					Text: "R",
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
};
