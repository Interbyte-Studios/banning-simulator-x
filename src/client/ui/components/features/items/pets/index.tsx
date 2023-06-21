import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { setPetItemRowSize } from "client/handlers/item inventory/inventoryLayoutHandler";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";
import { isImmuneRarity } from "shared/rodux/settings";
import { getPetData } from "shared/util/getPetData";

import { PetItems } from "./inventory";
import { PetInventoryCounterTopBar } from "./inventoryCounter";
import { PetInfoDisplay } from "./petInfoDisplay";
import { PetInventoryBottomControl } from "./petInventoryBottomControl";
import { PetInventorySearch } from "./search";
import { PetTeams } from "./teams";
import { ReturnToPetInventory } from "./teams/returnToInventory";

export const ToggleShrink = hooks((_, hooks) => {
	const { useState, useEffect } = hooks;
	const [isExpanded, setExpanded] = useState(true);

	useEffect(() => {
		setPetItemRowSize(isExpanded ? "shrink" : "expand");
	}, [isExpanded]);

	return (
		<ImageButton
			native={{
				Position: UDim2.fromScale(0.765, 0.05),
				Size: UDim2.fromScale(0.09, 0.09),
				Image: isExpanded ? assetIds.images.ui.inventory.pets.shrink : assetIds.images.ui.inventory.pets.maximize,
			}}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					setExpanded(!isExpanded);
				},
			}}
		/>
	);
});

/**
 * A button that leads to prompt the user to delete the selected pets.
 *
 * @param props - The props for the component.
 * @param props.completeMultiDelete - A function that will complete the multi delete.
 * @returns The component.
 */
export const CancelMultiDeleteSelection = (props: { completeMultiDelete: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.25, 0.75),
				Image: assetIds.images.buttons["red toggle button"],
			}}
			size={{ minSize: 0.35, maxSize: 0.4 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.completeMultiDelete();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.7, 0.8),
					Text: "Cancel",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(122, 0, 0) } }}
			/>
		</SpringImageButton>
	);
};

/**
 * The final confirmation button for the multi delete.
 *
 * @param props - The props for the component.
 * @param props.completeMultiDelete - A function that will complete the multi delete.
 * @returns The component.
 */
export const AcceptMultiDeleteSelection = (props: { completeMultiDelete: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.75, 0.75),
				Image: assetIds.images.buttons["green toggle button"],
			}}
			size={{ minSize: 0.35, maxSize: 0.4 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.completeMultiDelete();
				},
			}}
		>
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.7, 0.8),
					Text: "Accept",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(5, 89, 0) } }}
			/>
		</SpringImageButton>
	);
};

export const ToggleMultiDelete = hooks(
	(
		props: { isEnabled: boolean; setDeletion: (enabled: boolean) => void; petsToDelete: ReadonlyArray<string> },
		hooks,
	) => {
		const { useContext } = hooks;

		const { deletePets } = useContext(remoteContext);

		const additionalElements: Array<Roact.Element> = [];
		if (props.isEnabled) {
			additionalElements.push(
				<ImageLabel
					native={{
						Position: UDim2.fromScale(1.225, 0.175),
						Size: UDim2.fromScale(0.4, 0.35),
						Image: assetIds.images.ui.inventory.pets["delete-sidebar"],
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.3),
							Position: UDim2.fromScale(0.5, 0.25),
							Text: `Delete ${props.petsToDelete.size()} pets?`,
						}}
						stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
					/>
					<CancelMultiDeleteSelection
						completeMultiDelete={(): void => {
							props.setDeletion(false);
						}}
					/>
					<AcceptMultiDeleteSelection
						completeMultiDelete={(): void => {
							props.setDeletion(false);

							deletePets.SendToServer(props.petsToDelete);
						}}
					/>
				</ImageLabel>,
			);
		}

		return (
			<>
				<ImageButton
					native={{
						Position: UDim2.fromScale(0.825, 0.05),
						Size: UDim2.fromScale(0.1, 0.1),
						Image: props.isEnabled
							? assetIds.images.ui.inventory.pets["multi-delete enabled"]
							: assetIds.images.ui.inventory.pets["multi-delete disabled"],
					}}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.setDeletion(!props.isEnabled);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageButton>
				{additionalElements}
			</>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

interface DeleteAllMappedProps {
	pets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): DeleteAllMappedProps {
	return {
		pets: state.pets,
	};
}

/**
 * Toggles an interface for the player's pet teams.
 *
 * @param props The component props.
 * @param props.deleteAll A callback to delete all applicable pets.
 * @returns The component.
 */
export const DeleteAll = RoactRodux.connect(mapStateToProps)(
	hooks((props: DeleteAllMappedProps, { useState, useContext }) => {
		const [isEnabled, setIsEnabled] = useState(false);

		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const { deletePets } = useContext(remoteContext);

		const elementsToRender: Roact.Element = (
			<>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.9, 0.95),
						Image: assetIds.images.ui.inventory.pets["function button"],
					}}
					size={{ minSize: 0.15, maxSize: 0.185 }}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							setIsEnabled(!isEnabled);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2.8} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Delete-All",
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(153, 39, 41) } }}
					/>
				</SpringImageButton>
				{isEnabled ? (
					<ImageLabel
						native={{
							Position: UDim2.fromScale(1.225, 0.175),
							Size: UDim2.fromScale(0.4, 0.35),
							Image: assetIds.images.ui.inventory.pets["delete-sidebar"],
						}}
					>
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(1, 0.3),
								Position: UDim2.fromScale(0.5, 0.25),
								Text: `Delete all unlocked pets? (Legendary+ will not be deleted)`,
							}}
							stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
						/>
						<CancelMultiDeleteSelection
							completeMultiDelete={(): void => {
								playSFX(UIEngagement.MinorEngagement);
								setIsEnabled(false);
							}}
						/>
						<AcceptMultiDeleteSelection
							completeMultiDelete={(): void => {
								playSFX(UIEngagement.MinorEngagement);

								const petsToDelete: Array<string> = [];
								for (const pet of props.pets) {
									const petData = getPetData(pet.id);
									if (isImmuneRarity(petData.rarity)) {
										continue;
									}

									if (pet.locked) {
										continue;
									}

									if (pet.equipped) {
										continue;
									}

									petsToDelete.push(pet.guid);
								}

								deletePets.SendToServer(petsToDelete);
								addAnnouncement(`You deleted ${petsToDelete.size()} pets!`, AnnouncementType.Announcement);
								setIsEnabled(false);
							}}
						/>
					</ImageLabel>
				) : undefined}
			</>
		);

		return elementsToRender;
	}),
);

let petInfoDisplayOldState: string | undefined;

/**
 * Interface that displays the player's pets.
 */
export const PetInventory = hooks((_, { useState, useCallback, useEffect }) => {
	const [teamsEnabled, setTeamsEnabled] = useState(false);
	const [deleteEnabled, setDeleteEnabled] = useState(false);
	const [petsToDelete, setPetsToDelete] = useState<Array<string>>([]);
	const [searchText, setSearchText] = useState<string | undefined>(undefined);
	const [petInfoDisplayed, setPetInfoDisplayed] = useState<string | undefined>(undefined);

	useEffect(() => {
		setPetsToDelete([]);
	}, [deleteEnabled]);

	/**
	 * Adds a pet guid to the collection of pet guid's currently selected to be deleted.
	 *
	 * @param guid The guid of the pet.
	 */
	const addPetToDeletionRegistry = useCallback(
		(guid: string) => {
			setPetsToDelete([...petsToDelete, guid]);
		},
		[setPetsToDelete, petsToDelete],
	);

	/**
	 * Removes a pet guid from the collection of pet guid's currently selected to be deleted.
	 *
	 * @param guid The guid of the pet.
	 */
	const removePetFromDeletionRegistry = useCallback(
		(guid: string) => {
			const deleteIndex = petsToDelete.findIndex((x) => x === guid);

			setPetsToDelete(petsToDelete.filter((_, i) => i !== deleteIndex));
		},
		[setPetsToDelete, petsToDelete],
	);

	if (teamsEnabled) {
		return (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.2),
						Size: UDim2.fromScale(0.95, 0.05),
						Text: "Pet Teams allow you to functionally control multiple pets at once.",
					}}
					stroke={{ native: { Thickness: 1, Color: uiDarkStrokeColor } }}
				/>
				<PetTeams />
				<ReturnToPetInventory returnToSelection={(): void => setTeamsEnabled(false)} />
			</>
		);
	} else {
		const petInfoDisplay: Array<Roact.Element> = [];
		if (petInfoDisplayed !== undefined) {
			petInfoDisplay.push(
				<PetInfoDisplay
					guid={petInfoDisplayed}
					shouldAnimate={petInfoDisplayOldState === undefined && petInfoDisplay !== undefined}
					hideDisplay={(): void => {
						setPetInfoDisplayed(undefined);
					}}
				/>,
			);
		}

		if (petInfoDisplayOldState !== petInfoDisplayed) {
			petInfoDisplayOldState = petInfoDisplayed;
		}

		return (
			<BaseFrame Size={UDim2.fromScale(0.975, 0.785)} Position={UDim2.fromScale(0.5, 0.565)}>
				<PetInventoryCounterTopBar />
				<PetInventorySearch
					setSearch={(text: string): void => {
						if (text === "") {
							setSearchText(undefined);
						} else {
							setSearchText(text);
						}
					}}
				/>
				<ToggleShrink />
				<ToggleMultiDelete
					isEnabled={deleteEnabled}
					setDeletion={(enabled: boolean): void => {
						setDeleteEnabled(enabled);
					}}
					petsToDelete={petsToDelete}
				/>
				<PetItems
					multiDeleteEnabled={deleteEnabled}
					searchText={searchText}
					addPetToDeletionRegistry={addPetToDeletionRegistry}
					removePetFromDeletionRegistry={removePetFromDeletionRegistry}
					displayPetInfo={(guid: string): void => setPetInfoDisplayed(guid)}
				/>
				<PetInventoryBottomControl enableTeams={(): void => setTeamsEnabled(true)} />
				<DeleteAll />
				{petInfoDisplay}
			</BaseFrame>
		);
	}
});
