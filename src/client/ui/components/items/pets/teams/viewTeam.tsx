import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { PetFrame } from "client/ui/elements/petFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

/**
 * Equips all the pets in the team.
 */
/* eslint-disable jsdoc/require-jsdoc */
const EquipPetTeam = hooks((props: { pets: Array<string> }, hooks) => {
	const { useContext } = hooks;
	const { equipPets } = useContext(remoteContext);

	const maximizedSize = 0.3;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.25;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.59, 0.215)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.15, value);
			})}
			Image={assetIds.images.ui["weapon shop"]["purchase button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
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
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				Font={font}
				Text={"Equip"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Locks all the pets in the team.
 */
/* eslint-disable jsdoc/require-jsdoc */
const LockPetTeam = hooks((props: { pets: Array<string> }, hooks) => {
	const { useContext } = hooks;
	const { lockPets } = useContext(remoteContext);

	const maximizedSize = 0.3;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.25;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.75, 0.215)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.15, value);
			})}
			Image={assetIds.images.ui["weapon shop"].locked}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
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
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				Font={font}
				Text={"Lock"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(137, 150, 35) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Deletes the pet team.
 */
/* eslint-disable jsdoc/require-jsdoc */
const DeletePetTeam = hooks((props: { teamId: number }, hooks) => {
	const { useContext } = hooks;
	const { deletePetTeam } = useContext(remoteContext);

	const maximizedSize = 0.3;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.25;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.91, 0.215)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.15, value);
			})}
			Image={assetIds.images.ui["weapon shop"].delete}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					deletePetTeam.SendToServer(props.teamId);
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
				Font={font}
				Text={"Delete"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

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
			<frame
				AnchorPoint={vec2Middle}
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
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.7)}
					Size={UDim2.fromScale(0.975, 0.5)}
				>
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
								displayType={"stored"}
							/>
						);
					})}
				</frame>
				<EquipPetTeam pets={props.pets} />
				<LockPetTeam pets={props.pets} />
				<DeletePetTeam teamId={props.id} />
			</frame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
