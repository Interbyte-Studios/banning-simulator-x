import Roact from "@rbxts/roact";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import assetIds from "shared/assets";

/**
 * Displays the deletion indicator for pets.
 *
 * @param props The component props.
 * @param props.isSelectedForDeletion Whether the pet is selected for deletion.
 * @param props.multiDeleteEnabled Whether multi-delete is enabled.
 * @returns The deletion indicator.
 */
export const PetDeletionIndicator = (props: {
	isSelectedForDeletion: boolean;
	multiDeleteEnabled: boolean;
}): Roact.Element => {
	if (!props.isSelectedForDeletion || !props.multiDeleteEnabled) {
		return <></>;
	}

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.925, 0.925),
				Image: assetIds.images.ui.inventory.pets.deleteIndicator,
			}}
		/>
	);
};
