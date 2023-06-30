import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { MODERATOR_RANK } from "shared/configs/admin";
import { StoreState } from "shared/rodux";

interface EditAccountProps extends EditAccountMappedProps {
	showAdmin: () => void;
}

interface EditAccountMappedProps {
	groupRank: number | undefined;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function editAccountMapProps(state: StoreState): EditAccountMappedProps {
	return {
		groupRank: state.index.groupRank,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EditAccount = RoactRodux.connect(editAccountMapProps)(
	hooks((props: EditAccountProps) => {
		if (props.groupRank === undefined || props.groupRank < MODERATOR_RANK) {
			return <></>;
		}

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.225, 0.95),
					Image: assetIds.images.ui.inventory.pets["function button"],
				}}
				size={{ maxSize: 0.2, minSize: 0.175 }}
				events={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.showAdmin();
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={3} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Admin",
					}}
					stroke={{
						native: { Thickness: 1, Color: Color3.fromRGB(176, 94, 0) },
					}}
				/>
			</SpringImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
