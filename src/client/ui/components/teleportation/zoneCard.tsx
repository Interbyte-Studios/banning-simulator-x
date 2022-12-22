import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";

interface ZoneTeleportCardProps extends WorldTeleportCardMappedProps {
	world: WorldName;
	zone: ZoneNames;
	id: number;
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
 * Displays a "card" of a zone for zone selection for the teleport interface.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZoneTeleportCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: ZoneTeleportCardProps, hooks) => {
		const minimizedSize = 0.5;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.6;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const storedWorldData = props.worlds.find((world) => world.name === props.world);

		const { useContext } = hooks;
		const { addAnnouncement } = useContext(AnnouncementContext);

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0.305)}
				Image={
					storedWorldData !== undefined
						? storedWorldData.zones.find((zone) => zone === props.zone)
							? assetIds.images.ui.teleportation[props.zone]
							: assetIds.images.ui.teleportation[`${props.zone} Locked`]
						: assetIds.images.ui.teleportation[`${props.zone} Locked`]
				}
				ScaleType={Enum.ScaleType.Fit}
				LayoutOrder={props.id}
			>
				<uiaspectratioconstraint AspectRatio={5.15} />

				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.865, 0.5)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.3, value);
					})}
					Image={assetIds.images.ui.teleportation.go}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);

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

							const teleport = Workspace.interactions.teleports[props.zone];
							assert(teleport, `Failed to get teleportation part for "${props.zone}" from "${props.world}".`);

							humanoidRootPart.CFrame = teleport.CFrame;
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1.86} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Font={font}
						Text={"Go"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(38, 194, 83) }} />
					</textlabel>
				</imagebutton>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.25, 0.2)}
					Size={UDim2.fromScale(0.4, 0.325)}
					Font={font}
					Text={
						storedWorldData !== undefined
							? storedWorldData.zones.find((zone) => zone === props.zone)
								? props.zone
								: `${props.zone} (Locked)`
							: `${props.zone} (Locked)`
					}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
				</textlabel>
			</imagelabel>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
