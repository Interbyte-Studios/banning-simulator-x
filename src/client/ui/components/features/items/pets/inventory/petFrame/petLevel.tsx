import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import assetIds from "shared/assets";

/**
 * Displays the pet's level and lock indicator.
 *
 * @param props The component props.
 * @param props.isLocked Whether the pet is locked.
 * @param props.petLevel The pet's level.
 * @returns The component.
 */
export const PetLevelAndLockIndicator = (props: { isLocked: boolean; petLevel: number }): Roact.Element => {
	if (props.isLocked) {
		switch (props.petLevel > 1) {
			case true: {
				return (
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.95),
							Size: UDim2.fromScale(0.7, 0.2),
							Text: `Level: ${props.petLevel}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
						<ImageLabel
							native={{
								Size: UDim2.fromScale(1, 1),
								Position: UDim2.fromScale(-0.15, 0.5),
								Image: assetIds.images.ui.inventory.locked,
							}}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</ImageLabel>
					</StrokeTextLabel>
				);
			}
			default: {
				return (
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.25, 0.25),
							Position: UDim2.fromScale(0.5, 0.95),
							Image: assetIds.images.ui.inventory.locked,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				);
			}
		}
	} else {
		return (
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.95),
					Size: UDim2.fromScale(0.7, 0.2),
					Text: `Level: ${props.petLevel}`,
				}}
				stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
			/>
		);
	}
};
