import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { sortPets } from "client/modules/pets/sort";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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
export const EquipBestPets = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInventoryBottomControlMappedProps, hooks) => {
		const { useContext } = hooks;
		const { equipPets } = useContext(remoteContext);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.1, 0.5),
					Image: assetIds.images.ui.inventory.pets["function button"],
				}}
				size={{ minSize: 0.75, maxSize: 0.8 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						sortPets(props.pets, false, false);

						const maxPetsEquipped = getMaxPetEquip(props.gamepasses);
						const petsToEquip: Array<{ guid: string; enabled: boolean }> = [];
						for (let i = 0; i < maxPetsEquipped; i++) {
							const petToEquip = props.pets[i];
							if (petToEquip !== undefined) {
								petsToEquip.push({
									guid: petToEquip.guid,
									enabled: true,
								});
							}
						}

						print(petsToEquip.size());
						equipPets.SendToServer(petsToEquip, true);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={2.8} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.7, 0.7),
						Text: "Equip Best",
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) } }}
				/>
			</SpringImageButton>
		);
	}),
);

/**
 * Unequips the player's currently equipped pets.
 */
export const UnequipPets = hooks((props: { renderedPets: PetsState }, hooks) => {
	const { useContext } = hooks;
	const { equipPets } = useContext(remoteContext);

	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.31, 0.5),
				Image: assetIds.images.ui.inventory.pets["function button"],
			}}
			size={{ minSize: 0.75, maxSize: 0.8 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
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
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />

			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.8, 0.7),
					Text: "Unequip All",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) } }}
			/>
		</SpringImageButton>
	);
});

/**
 * Toggles an interface for the player's pet teams.
 *
 * @param props The component props.
 * @param props.enableTeams A function to enable the pet teams interface.
 * @returns The component.
 */
export const ToggleTeams = (props: { enableTeams: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.52, 0.5),
				Image: assetIds.images.ui.inventory.pets["function button"],
			}}
			size={{ minSize: 0.75, maxSize: 0.8 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.enableTeams();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={2.8} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.65, 0.6),
					Text: "Teams",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(153, 79, 0) } }}
			/>
		</SpringImageButton>
	);
};

/**
 * A bottom bar interface of the pet inventory component providing player with extra control over their items.
 */
export const PetInventoryBottomControl = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInventoryBottomControlProps) => {
		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(1, 0.14),
					Position: UDim2.fromScale(0.5, 0.95),
					Image: assetIds.images.ui.inventory.pets.bottombar,
				}}
			>
				<EquipBestPets />
				<UnequipPets renderedPets={props.pets} />
				<ToggleTeams enableTeams={props.enableTeams} />
			</ImageLabel>
		);
	}),
);
