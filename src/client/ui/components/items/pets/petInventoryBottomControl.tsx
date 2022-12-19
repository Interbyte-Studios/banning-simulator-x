import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { sortPets } from "client/modules/pets/sort";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";

interface PetInventoryBottomControlProps extends PetInventoryBottomControlMappedProps {
	enableTeams: () => void;
}

interface PetInventoryBottomControlMappedProps {
	pets: PetsState;
	gamepasses: GamepassesState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetInventoryBottomControlMappedProps {
	return {
		pets: state.pets,
		gamepasses: state.gamepasses,
	};
}

/**
 * Equips the best pets a player can have.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const EquipBestPets = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInventoryBottomControlMappedProps, hooks) => {
		const { useContext } = hooks;
		const { equipPets } = useContext(remoteContext);

		const maximizedSize = 0.8;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.75;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.19, value);
				})}
				Position={UDim2.fromScale(0.1, 0.5)}
				Image={assetIds.images.ui.inventory.pets["function button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						sortPets(props.pets, false, false);

						const maxPetsEquipped = getMaxPetEquip(props.gamepasses);
						const petsToEquip: Array<{ guid: string; enabled: boolean }> = [];
						for (let i = 1; i <= maxPetsEquipped; i++) {
							const petToEquip = props.pets[i];
							if (petToEquip !== undefined) {
								petsToEquip.push({
									guid: petToEquip.guid,
									enabled: true,
								});
							}

							equipPets.SendToServer(petsToEquip, true);
						}
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={2.8} />
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.7, 0.7)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"Equip Best"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Unequips the player's currently equipped pets.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const UnequipPets = hooks((props: { renderedPets: PetsState }, hooks) => {
	const { useContext } = hooks;
	const { equipPets } = useContext(remoteContext);

	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.31, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);

					const equippedPets = props.renderedPets.filter((pet) => pet.equipped);

					const petsToUnequip: Array<{ guid: string; enabled: boolean }> = equippedPets.map((pet) => {
						return {
							guid: pet.guid,
							enabled: false,
						};
					});
					equipPets.SendToServer(petsToUnequip, true);
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.8, 0.7)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Unequip All"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Toggles an interface for the player's pet teams.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ToggleTeams = hooks((props: { enableTeams: () => void }, hooks) => {
	const maximizedSize = 0.8;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const minimizedSize = 0.75;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.19, value);
			})}
			Position={UDim2.fromScale(0.52, 0.5)}
			Image={assetIds.images.ui.inventory.pets["function button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.enableTeams();
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.65, 0.6)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Teams"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * A bottom bar interface of the pet inventory component providing player with extra control over their items.
 */
export const PetInventoryBottomControl = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInventoryBottomControlProps) => {
		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0.14)}
				Position={UDim2.fromScale(0.5, 0.95)}
				Image={assetIds.images.ui.inventory.pets.bottombar}
				ScaleType={Enum.ScaleType.Fit}
			>
				<EquipBestPets />
				<UnequipPets renderedPets={props.pets} />
				<ToggleTeams enableTeams={props.enableTeams} />
			</imagelabel>
		);
	}),
);
