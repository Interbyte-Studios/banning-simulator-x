// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

interface WorldTeleportCardProps extends WorldTeleportCardMappedProps {
	world: WorldName;
	id: number;
	selectWorld: () => void;
}

interface WorldTeleportCardMappedProps {
	worlds: WorldsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): WorldTeleportCardMappedProps {
	return {
		worlds: state.worlds,
	};
}

/**
 * Displays a "card" of a world for world selection for the teleport interface.
 */
export const WorldTeleportCard = RoactRodux.connect(mapStateToProps)((props: WorldTeleportCardProps): Roact.Element => {
	const storedWorldData = props.worlds.find((world) => world.name === props.world);

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(1, 0.305),
				Image:
					storedWorldData !== undefined
						? assetIds.images.ui.teleportation[props.world]
						: assetIds.images.ui.teleportation[`${props.world} Locked`],
				LayoutOrder: props.id,
			}}
		>
			<uiaspectratioconstraint AspectRatio={5.15} />

			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.865, 0.5),
					Image: assetIds.images.ui.teleportation.go,
				}}
				size={{ minSize: 0.5, maxSize: 0.6 }}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.selectWorld();
					},
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.86} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Text: "Go",
					}}
					stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
				/>
			</SpringImageButton>

			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.25, 0.2),
					Size: UDim2.fromScale(0.4, 0.325),
					Text: storedWorldData !== undefined ? props.world : `${props.world} (Locked)`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</ImageLabel>
	);
});
