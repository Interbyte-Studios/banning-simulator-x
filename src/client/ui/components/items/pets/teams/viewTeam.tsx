import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

/**
 * Equips all the pets in the team.
 */
const EquipPetTeam = hooks((props: { pets: Array<string> }, hooks) => {
	const { useContext } = hooks;
	const { equipPets } = useContext(remoteContext);

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.59, 0.215),
				Image: assetIds.images.ui["weapon shop"]["purchase button"],
			}}
			size={{ minSize: 0.25, maxSize: 0.3 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);

					const petsToEquip: Array<{ guid: string; enabled: boolean }> = props.pets.map((guid) => {
						return {
							guid,
							enabled: true,
						};
					});

					equipPets.SendToServer(petsToEquip, true);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Equip",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) } }}
			/>
		</SpringImageButton>
	);
});

/**
 * Locks all the pets in the team.
 */
const LockPetTeam = hooks((props: { pets: Array<string> }, hooks) => {
	const { useContext } = hooks;
	const { lockPets } = useContext(remoteContext);

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.75, 0.215),
				Image: assetIds.images.ui["weapon shop"].locked,
			}}
			size={{ minSize: 0.25, maxSize: 0.3 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);

					const petsToLock: Array<{ guid: string; enabled: boolean }> = props.pets.map((guid) => {
						return {
							guid,
							enabled: true,
						};
					});

					lockPets.SendToServer(petsToLock);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Lock",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(137, 150, 35) } }}
			/>
		</SpringImageButton>
	);
});

/**
 * Deletes the pet team.
 */
const DeletePetTeam = hooks((props: { teamId: number }, hooks) => {
	const { useContext } = hooks;
	const { deletePetTeam } = useContext(remoteContext);

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.91, 0.215),
				Image: assetIds.images.ui["weapon shop"].delete,
			}}
			size={{ minSize: 0.25, maxSize: 0.3 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					deletePetTeam.SendToServer(props.teamId);
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Delete",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) } }}
			/>
		</SpringImageButton>
	);
});

interface ViewPetTeamProps extends ViewPetTeamMappedProps {
	pets: Array<string>;
	name: string;
	id: number;
}

interface ViewPetTeamMappedProps {
	storedPets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): ViewPetTeamMappedProps {
	return {
		storedPets: state.pets,
	};
}

/**
 * A card that allows the player to create pet teams.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ViewPetTeam = RoactRodux.connect(mapStateToProps)(
	hooks((props: ViewPetTeamProps, { useContext }) => {
		const { changePetTeamName } = useContext(remoteContext);

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 131, 212)}
				Size={UDim2.fromScale(0.975, 0.25)}
				LayoutOrder={props.id}
			>
				<uiaspectratioconstraint AspectRatio={6.95} />
				<uicorner CornerRadius={new UDim(0.1, 0)} />

				<textbox
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.215, 0.2)}
					Size={UDim2.fromScale(0.4, 0.35)}
					Font={font}
					Text={props.name ?? ""}
					PlaceholderText={"Enter Team Name..."}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Event={{
						FocusLost: (textBox, enterPressed): void => {
							if (!enterPressed) return;

							changePetTeamName.SendToServer(props.id, textBox.Text);
						},
					}}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 93, 150) }} />
				</textbox>

				<BaseFrame Position={UDim2.fromScale(0.5, 0.7)} Size={UDim2.fromScale(0.975, 0.5)}>
					<uigridlayout
						CellPadding={UDim2.fromScale(0.004, 0)}
						CellSize={UDim2.fromScale(0.08, 1)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					{props.pets.map((petguid) => {
						const storedPet = props.storedPets.find((pet) => pet.guid === petguid);
						assert(
							storedPet,
							`Failed to display pet team for team with id: ${props.id}, since there were pets in the team that no longer exist.`,
						);

						return (
							<PetFrame
								petId={storedPet.id}
								variant={storedPet.variant}
								displayBackground={true}
								isBillboard={false}
								shouldBlackout={false}
							/>
						);
					})}
				</BaseFrame>

				<EquipPetTeam pets={props.pets} />
				<LockPetTeam pets={props.pets} />
				<DeletePetTeam teamId={props.id} />
			</BaseFrame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
