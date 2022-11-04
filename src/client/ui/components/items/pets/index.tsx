import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { setPetItemRowSize } from "client/handlers/item inventory/inventoryLayoutHandler";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";

import { PetItems } from "./inventory";
import { PetInventoryCounterTopBar } from "./inventoryCounter";
import { PetInventoryBottomControl } from "./petInventoryBottomControl";
import { PetInventorySearch } from "./search";

/* eslint-disable jsdoc/require-jsdoc */
export const ToggleShrink = hooks((_, hooks) => {
	const { useState, useEffect } = hooks;
	const [isExpanded, setExpanded] = useState(true);

	useEffect(() => {
		setPetItemRowSize(isExpanded ? "shrink" : "expand");
	}, [isExpanded]);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.765, 0.05)}
			Size={UDim2.fromScale(0.09, 0.09)}
			Image={isExpanded ? assetIds.images.ui.inventory.pets.shrink : assetIds.images.ui.inventory.pets.maximize}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => setExpanded(!isExpanded),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const CancelMultiDeleteSelection = hooks((props: { completeMultiDelete: () => void }, hooks) => {
	const minimizedSize = 0.35;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.4;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.25, 0.75)}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, 0.35);
			})}
			Image={assetIds.images.buttons["red toggle button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.completeMultiDelete(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.7, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Cancel"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(122, 0, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const AcceptMultiDeleteSelection = hooks((props: { completeMultiDelete: () => void }, hooks) => {
	const minimizedSize = 0.35;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.4;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.75, 0.75)}
			Size={binding.map((value) => {
				return UDim2.fromScale(value, 0.35);
			})}
			Image={assetIds.images.buttons["green toggle button"]}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => props.completeMultiDelete(),
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.7, 0.8)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Accept"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(5, 89, 0) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
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
				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(1.225, 0.175)}
					Size={UDim2.fromScale(0.4, 0.35)}
					Image={assetIds.images.ui.inventory.pets["delete-sidebar"]}
					ScaleType={Enum.ScaleType.Fit}
				>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 0.3)}
						Position={UDim2.fromScale(0.5, 0.25)}
						Text={`Delete ${props.petsToDelete.size()} pets?`}
						Font={font}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
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
				</imagelabel>,
			);
		}

		return (
			<>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.825, 0.05)}
					Size={UDim2.fromScale(0.1, 0.1)}
					Image={
						props.isEnabled
							? assetIds.images.ui.inventory.pets["multi-delete enabled"]
							: assetIds.images.ui.inventory.pets["multi-delete disabled"]
					}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: (): void => {
							props.setDeletion(!props.isEnabled);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
				{additionalElements}
			</>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Interface that displays the player's pets.
 */
export const PetInventory = hooks((_, { useState }) => {
	const [deleteEnabled, setDeleteEnabled] = useState(false);
	const [petsToDelete, setPetsToDelete] = useState<Array<string>>([]);
	const [searchText, setSearchText] = useState<string | undefined>(undefined);

	const petsSelectedForDeletion: Array<string> = [...petsToDelete];

	/**
	 * Adds a pet guid to the collection of pet guid's currently selected to be deleted.
	 *
	 * @param guid The guid of the pet.
	 */
	function addPetToDeletionRegistry(guid: string): void {
		petsSelectedForDeletion.push(guid);
		setPetsToDelete(petsSelectedForDeletion);
	}

	/**
	 * Removes a pet guid from the collection of pet guid's currently selected to be deleted.
	 *
	 * @param guid The guid of the pet.
	 */
	function removePetFromDeletionRegistry(guid: string): void {
		petsSelectedForDeletion.unorderedRemove(petsSelectedForDeletion.findIndex((x) => x === guid));
		setPetsToDelete(petsSelectedForDeletion);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.975, 0.785)}
			Position={UDim2.fromScale(0.5, 0.565)}
		>
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
			/>
			<PetInventoryBottomControl />
		</frame>
	);
});
