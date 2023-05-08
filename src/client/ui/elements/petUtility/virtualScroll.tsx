import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { sortPets } from "client/modules/pets/sort";
import { vec2Middle } from "client/ui/commonValues";
import { PetFrame } from "client/ui/components/items/pets/inventory/petFrame";
import { getPetData } from "shared/util/getPetData";

import { PetInventoryData } from "../../components/items/pets/inventory";
import { hooks } from "../../hooks";
import { updateContentSize } from "../common/rescalingScrollingFrame";

interface VirtualScrollProps {
	pets: Array<PetInventoryData>;
	searchText?: string;
	multiDeleteEnabled?: boolean;
	addPetToDeletionRegistry?: (guid: string) => void;
	removePetFromDeletionRegistry?: (guid: string) => void;
	displayPetInfo?: (guid: string) => void;
}

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
	const { pets, searchText } = props;
	const { useEffect, useState, useCallback, useMemo, useValue } = hooks;

	const scrollingFrameRef = useValue(Roact.createRef<ScrollingFrame>());
	const layoutRef = useValue(Roact.createRef<UIGridLayout>());

	// State for managing the rendered pets
	const [renderedPets, setRenderedPets] = useState<Array<PetInventoryData>>(pets);

	const checkRenderedPets = useCallback(
		(scrollingFrame: ScrollingFrame, petsToIterate: ReadonlyArray<PetInventoryData>, search?: string) => {
			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found for PetItems component.`);

			const searchText = search?.lower();

			for (let index = 0; index < petsToIterate.size(); index++) {
				const pet = petsToIterate[index];
				const y = math.floor(index / gridLayout.FillDirectionMaxCells);
				const yPos = y * gridLayout.CellSize.Y.Offset + y * gridLayout.CellPadding.Y.Offset;

				// the frame can be visible if we are half way from the previous y coordinate
				// so we need to go from the previous y coordinate position + padding
				// equivalent to the current CanvasPosition - CellSize
				const belowTop = yPos >= scrollingFrame.CanvasPosition.Y - gridLayout.CellSize.Y.Offset;
				const aboveBottom = yPos <= scrollingFrame.CanvasPosition.Y + scrollingFrame.AbsoluteWindowSize.Y;

				let shouldBeRendered = belowTop && aboveBottom;

				// check against search text props
				if (searchText !== undefined && shouldBeRendered) {
					const petData = getPetData(pet.id);
					if (petData.name.lower().match(searchText) !== undefined) {
						shouldBeRendered = false;
					}
				}

				if (shouldBeRendered !== pet.isRendered) {
					pet.isRendered = shouldBeRendered;
				}
			}

			return [...petsToIterate];
		},
		[],
	);

	const updateItems = useCallback(
		(scroll: ScrollingFrame): void => {
			const updatedRenderedPets = checkRenderedPets(scroll, renderedPets, searchText);
			sortPets(updatedRenderedPets, true, true);
			setRenderedPets(updatedRenderedPets);
		},
		[renderedPets, searchText],
	);

	useEffect(() => {
		const uiGridLayout = layoutRef.value.getValue();
		assert(uiGridLayout, "Failed to get UIGridLayout for pet item inventory.");

		CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
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

	useEffect(() => {
		const scrollingFrame = scrollingFrameRef.value.getValue();
		assert(scrollingFrame, `No ScrollingFrame was found for Virtual Scroll`);

		// Initial update
		updateItems(scrollingFrame);
	}, []);

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
		for (let index = 0; index < renderedPets.size(); index++) {
			const pet = renderedPets[index];

			result.push(
				<PetFrame
					Key={pet.guid}
					isRendered={pet.isRendered}
					storedPetData={pet}
					multiDeleteEnabled={props.multiDeleteEnabled ?? false}
					addPetToDeletionRegistry={props.addPetToDeletionRegistry ?? ((): void => undefined)}
					removePetFromDeletionRegistry={props.removePetFromDeletionRegistry ?? ((): void => undefined)}
					layoutOrderIndex={index}
					displayPetInfo={props.displayPetInfo ?? ((): void => undefined)}
					inventoryFrame={scrollingFrameRef.value}
				/>,
			);
		}
		return result;
	}, [renderedPets, props]);

	return (
		<scrollingframe
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.965, 0.74)}
			Position={UDim2.fromScale(0.5, 0.495)}
			ScrollBarThickness={0}
			Ref={scrollingFrameRef.value}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(6, 6)}
				CellSize={UDim2.fromOffset(110, 110)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				FillDirectionMaxCells={5}
				Ref={layoutRef.value}
			/>
			{elementsToDisplay}
		</scrollingframe>
	);
});
