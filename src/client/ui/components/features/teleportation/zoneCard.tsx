// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TELEPORTATIONS } from "shared/configs/game";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";

interface ZoneTeleportCardProps extends WorldTeleportCardMappedProps {
	world: WorldName | "Exclusive";
	zone: ZoneNames | "Exclusive";
	id: number;
	onActivated?: () => void;
}

interface WorldTeleportCardMappedProps {
	worlds: WorldsState;
	pets: PetsState;
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
		pets: state.pets,
	};
}

/**
 * Displays a "card" of a zone for zone selection for the teleport interface.
 */
export const ZoneTeleportCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: ZoneTeleportCardProps, hooks) => {
		const storedWorldData = props.worlds.find((world) => world.name === props.world);

		const { useContext } = hooks;
		const { addAnnouncement } = useContext(AnnouncementContext);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(1, 0.305),
					Image:
						props.zone === "Exclusive"
							? assetIds.images.ui.teleportation.exclusive
							: storedWorldData !== undefined
							? storedWorldData.zones.find((zone) => zone === props.zone)
								? assetIds.images.ui.teleportation[props.zone]
								: assetIds.images.ui.teleportation[`${props.zone} Locked`]
							: assetIds.images.ui.teleportation[`${props.zone} Locked`],
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
							playSFX(UIEngagement.MajorEngagement);

							if (props.onActivated !== undefined) {
								props.onActivated();
								return;
							}

							if (props.zone === "Exclusive") {
								return;
							}

							if (storedWorldData === undefined) {
								addAnnouncement(`You do not own the world.`, AnnouncementType.Error);
								return;
							}

							if (storedWorldData.zones.find((zone) => zone === props.zone) === undefined) {
								addAnnouncement(`You do not own that zone.`, AnnouncementType.Error);
								return;
							}

							const player = Players.LocalPlayer;

							const character = player.Character;
							assert(character, `Failed to get Character for ${player.Name} | Teleporation`);

							const humanoid = character.FindFirstChildOfClass("Humanoid");
							assert(humanoid, `Failed to get Humanoid for ${player.Name} | Teleporation`);

							const humanoidRootPart = humanoid.RootPart;
							assert(humanoidRootPart, `Failed to get HumanoidRootPart for ${player.Name} | Teleporation`);

							humanoidRootPart.PivotTo(new CFrame(TELEPORTATIONS.ZONES[props.zone]));
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
						Text:
							props.zone === "Exclusive"
								? "Exclusive"
								: storedWorldData !== undefined
								? storedWorldData.zones.find((zone) => zone === props.zone)
									? props.zone
									: `${props.zone} (Locked)`
								: `${props.zone} (Locked)`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>
			</ImageLabel>
		);
	}),
);
