import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";

const minimizedSize = 0.8;
const maximizedSize = 0.9;

interface TeleportIconProps extends TeleportIconMappedProps {
	displayTeleportationMenu: () => void;
}

interface TeleportIconMappedProps {
	gamepasses: GamepassesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TeleportIconMappedProps {
	return {
		gamepasses: state.gamepasses,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const TeleportIcon = RoactRodux.connect(mapStateToProps)(
	hooks((props: TeleportIconProps) => {
		return (
			<SpringImageButton
				native={{
					Image: assetIds.images.ui.hud.icons.teleport,
					LayoutOrder: 6,
				}}
				size={{
					maxSize: maximizedSize,
					minSize: minimizedSize,
				}}
				events={{
					Activated: async (): Promise<void> => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.gamepasses.Teleportation) {
							props.displayTeleportationMenu();
						} else {
							MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, GAMEPASSES.Teleportation);
						}
					},
				}}
			>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.35),
						Position: UDim2.fromScale(0.5, 1),
						Text: "Teleport",
					}}
					stroke={{
						native: { Color: Color3.fromRGB(0, 108, 176) },
					}}
				/>
				<uiaspectratioconstraint AspectRatio={1} />
			</SpringImageButton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
