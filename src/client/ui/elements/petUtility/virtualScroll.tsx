import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { sortPets } from "client/modules/pets/sort";
import { vec2Middle } from "client/ui/commonValues";
import { PetFrame } from "client/ui/components/items/pets/inventory/petFrame";
import { PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";

import { PetInventoryData } from "../../components/items/pets/inventory";
import { hooks } from "../../hooks";
import { updateContentSize } from "../common/rescalingScrollingFrame";

interface InventoryPetFrameProps {
	multiDeleteEnabled: boolean;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
	displayPetInfo: (guid: string) => void;
}

interface VirtualScrollProps {
	pets: PetsState;
	searchText?: string;
	size: UDim2;
	position: UDim2;
	scrollBarThickness?: number;
	scrollBarImageColor?: Color3;
	fillDirectionMaxCells?: number;
	inventoryFrame?: InventoryPetFrameProps;
	onActivated?: (guid: string) => void;
	selectedPets?: Array<string>;
	noToolTipDispay?: boolean;
}

const preDisplayedRows = 5;

/**
 * A virtual scrolling component for pets.
 *
 * @param props The properties of the virtual scroll.
 * @param props.pets The pets to be displayed in the virtual scroll.
 * @param props.searchText The text to be searched for in the pet names.
 * @param props.multiDeleteEnabled Whether or not multi delete is enabled.
 * @param props.addPetToDeletionRegistry A function to add a pet to the deletion registry.
 * @param props.removePetFromDeletionRegistry A function to remove a pet from the deletion registry.
 * @param props.displayPetInfo A function to display the pet info of a pet.
 */
export const VirtualScroll = hooks((props: VirtualScrollProps, hooks) => {
	const { useEffect, useState, useCallback, useMemo, useValue } = hooks;

	const scrollingFrameRef = useValue(Roact.createRef<ScrollingFrame>());
	const layoutRef = useValue(Roact.createRef<UIGridLayout>());

	// State for managing the rendered pets
	sortPets(props.pets, true, true);
	const [renderedPets, setRenderedPets] = useState<Array<PetInventoryData>>(
		props.pets.map((pet, index) => ({ ...pet, isRendered: index < 35 })),
	);

	const checkRenderedPets = useCallback(
		(scrollingFrame: ScrollingFrame, petsToIterate: ReadonlyArray<PetInventoryData>, search?: string) => {
			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found for PetItems component.`);

			const searchText = search?.lower();

			const newPets = [...petsToIterate];
			if (newPets.size() <= gridLayout.FillDirectionMaxCells * preDisplayedRows) {
				newPets.forEach((pet) => (pet.isRendered = true));
			} else {
				for (let index = 0; index < newPets.size(); index++) {
					const pet = newPets[index];
					const y = math.floor(index / gridLayout.FillDirectionMaxCells);
					const yPos = y * gridLayout.CellSize.Y.Offset + y * gridLayout.CellPadding.Y.Offset;

					// the frame can be visible if we are half way from the previous y coordinate
					// so we need to go from the previous y coordinate position + padding
					// equivalent to the current CanvasPosition - CellSize
					const belowTop = yPos >= scrollingFrame.CanvasPosition.Y - gridLayout.CellSize.Y.Offset;
					const aboveBottom = yPos <= scrollingFrame.CanvasPosition.Y + scrollingFrame.AbsoluteWindowSize.Y;

					let shouldBeRendered = belowTop && aboveBottom;

					// check against search text props
					if (searchText !== undefined && searchText !== "" && shouldBeRendered) {
						const petData = getPetData(pet.id);
						if (petData.name.lower().match(searchText).size() !== 0) {
							shouldBeRendered = false;
						}
					}

					if (index < 35 && !shouldBeRendered) {
						shouldBeRendered = true;
					}

					if (shouldBeRendered !== pet.isRendered) {
						pet.isRendered = shouldBeRendered;
					}
				}
			}

			return newPets;
		},
		[props.searchText],
	);

	const updateItems = useCallback(
		(scroll: ScrollingFrame): void => {
			const updatedRenderedPets = checkRenderedPets(scroll, renderedPets, props.searchText);
			sortPets(
				updatedRenderedPets.filter((pet) => pet.isRendered),
				true,
				true,
			);
			setRenderedPets(updatedRenderedPets);
		},
		[renderedPets, props.searchText],
	);

	// automatic grid layout connection
	useEffect(() => {
		const uiGridLayout = layoutRef.value.getValue();
		assert(uiGridLayout, "Failed to get UIGridLayout for pet item inventory.");

		if (props.inventoryFrame !== undefined) {
			CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
		} else {
			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		}
	}, [layoutRef]);

	// useEffect to handle canvas position changes
	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.value.getValue();
		assert(scrollingFrame, `No ScrollingFrame was found for Virtual Scroll`);

		const gridLayout = layoutRef.value.getValue();
		assert(gridLayout, `No UIGridLayout was found for Virtual Scroll`);

		const connections: Array<RBXScriptConnection> = [
			gridLayout.GetPropertyChangedSignal("FillDirectionMaxCells"),
			scrollingFrame.GetPropertyChangedSignal("CanvasPosition"),
		].map((conn) => conn.Connect(() => updateItems(scrollingFrame)));

		// Cleanup function to disconnect all connections when the component is unmounted.
		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [scrollingFrameRef, updateItems]);

	// initial populating of scrolling frame
	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.value.getValue();
		assert(scrollingFrame, `No ScrollingFrame was found for Virtual Scroll`);

		// Initial update
		updateItems(scrollingFrame);
	}, []);

	// props.pets change update
	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.value.getValue();
		assert(scrollingFrame, `No ScrollingFrame was found for Virtual Scroll`);

		let newPets: Array<PetInventoryData> = [];
		if (props.searchText !== undefined && props.searchText !== "") {
			const searchText = props.searchText.lower();

			newPets = props.pets
				.filter((pet) => {
					const petData = getPetData(pet.id);
					return petData.name.lower().match(searchText).size() !== 0;
				})
				.map((pet) => ({ ...pet, isRendered: false }));
		} else {
			newPets = props.pets.map((pet) => ({ ...pet, isRendered: false }));
		}

		const updatedRenderedPets = checkRenderedPets(scrollingFrame, newPets, props.searchText);
		sortPets(
			updatedRenderedPets.filter((pet) => pet.isRendered),
			true,
			true,
		);
		setRenderedPets(updatedRenderedPets);
	}, [props.pets, props.searchText]);

	// resize connection
	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.value.getValue();
		assert(scrollingFrame, `No ScrollingFrame was found for Virtual Scroll`);

		const gridLayout = layoutRef.value.getValue();
		assert(gridLayout, `No UIGridLayout was found for Virtual Scroll`);

		const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
		return (): void => resizeConnection.Disconnect();
	}, [scrollingFrameRef]);

	const elementsToDisplay: Array<Roact.Element> = useMemo(() => {
		const result: Array<Roact.Element> = [];
		let selectedId = 0;
		renderedPets.forEach((pet, index) => {
			let layoutOrder = index;
			if (props.selectedPets !== undefined) {
				if (props.selectedPets.includes(pet.guid)) {
					selectedId += 1;
					layoutOrder = selectedId;
				} else {
					layoutOrder = index + 11;
				}
			}

			const isSelected = props.selectedPets?.includes(pet.guid);

			if (props.inventoryFrame !== undefined) {
				result.push(
					<PetFrame
						Key={pet.guid}
						native={{
							isRendered: pet.isRendered,
							storedPetData: pet,
							layoutOrderIndex: layoutOrder,
							displayFrame: props.noToolTipDispay ? undefined : scrollingFrameRef.value,
							isSelected: isSelected,
						}}
						inventory={{
							multiDeleteEnabled: props.inventoryFrame.multiDeleteEnabled,
							addPetToDeletionRegistry: props.inventoryFrame.addPetToDeletionRegistry,
							removePetFromDeletionRegistry: props.inventoryFrame.removePetFromDeletionRegistry,
							displayPetInfo: props.inventoryFrame.displayPetInfo,
						}}
					/>,
				);
			} else if (props.onActivated !== undefined) {
				result.push(
					<PetFrame
						Key={pet.guid}
						native={{
							isRendered: pet.isRendered,
							storedPetData: pet,
							layoutOrderIndex: layoutOrder,
							onActivated: props.onActivated,
							displayFrame: props.noToolTipDispay ? undefined : scrollingFrameRef.value,
							isSelected: isSelected,
						}}
					/>,
				);
			} else {
				result.push(
					<PetFrame
						Key={pet.guid}
						native={{
							isRendered: pet.isRendered,
							storedPetData: pet,
							layoutOrderIndex: layoutOrder,
							displayFrame: props.noToolTipDispay ? undefined : scrollingFrameRef.value,
						}}
					/>,
				);
			}
		});
		return result;
	}, [
		renderedPets,
		props.selectedPets,
		props.pets,
		props.inventoryFrame?.multiDeleteEnabled,
		props.inventoryFrame?.addPetToDeletionRegistry,
		props.inventoryFrame?.removePetFromDeletionRegistry,
		props.inventoryFrame?.displayPetInfo,
	]);

	return (
		<scrollingframe
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={props.size}
			Position={props.position}
			ScrollBarThickness={props.scrollBarThickness ?? 0}
			ScrollBarImageColor3={props.scrollBarImageColor ?? Color3.fromRGB(0, 0, 0)}
			Ref={scrollingFrameRef.value}
			ScrollingDirection={Enum.ScrollingDirection.Y}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(6, 6)}
				CellSize={UDim2.fromOffset(110, 110)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				FillDirectionMaxCells={props.fillDirectionMaxCells ?? 5}
				Ref={layoutRef.value}
			/>
			{elementsToDisplay}
		</scrollingframe>
	);
});
