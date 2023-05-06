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
 * @param props.pets The items to be rendered.
 * @param props.renderedPet The item to be rendered.
 * @param props.layoutProps The layout properties of the virtual scroll.
 */
export const VirtualScroll = hooks((props: VirtualScrollProps, hooks) => {
	const { pets, searchText } = props;
	const { useValue, useEffect, useState, useCallback } = hooks;

	const scrollingFrameRef = useValue(Roact.createRef<ScrollingFrame>());
	const layoutRef = useValue(Roact.createRef<UIGridLayout>());

	// State for managing the rendered pets
	const [renderedPets, setRenderedPets] = useState<Array<PetInventoryData>>(pets);

	const checkRenderedPets = useCallback(
		(scrollingFrame: ScrollingFrame, pets: ReadonlyArray<PetInventoryData>, search?: string) => {
			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found for PetItems component.`);

			const searchText = search?.lower();

			const renderedPets = pets.map((pet, index) => {
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
					if (petData.name.lower().find(searchText, 1, true)[0] === undefined) {
						shouldBeRendered = false;
					}
				}

				if (shouldBeRendered !== pet.isRendered) {
					return {
						...pet,
						isRendered: shouldBeRendered,
					};
				}

				return pet;
			});

			return renderedPets;
		},
		[],
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

		/**
		 * Updates the rendered items.
		 *
		 * @param scroll The scrolling frame.
		 */
		const updateItems = (scroll: ScrollingFrame): void => {
			/* debounce
			let lastUpdate = 0; ^ Move outside of function
			const now = time();
			if (now - lastUpdate < 0.15) {
				return;
			}
			lastUpdate = now;
			*/

			// update pets
			const updatedRenderedPets = checkRenderedPets(scroll, renderedPets, searchText);
			sortPets(updatedRenderedPets, true, true);
			setRenderedPets(updatedRenderedPets);
		};

		const connections: Array<RBXScriptConnection> = [
			gridLayout.GetPropertyChangedSignal("FillDirectionMaxCells"),
			scrollingFrame.GetPropertyChangedSignal("CanvasPosition"),
			scrollingFrame.GetPropertyChangedSignal("AbsoluteCanvasSize"),
		].map((conn) => conn.Connect(() => updateItems(scrollingFrame)));

		const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
		connections.push(resizeConnection);

		// Initial update
		updateItems(scrollingFrame);

		// Cleanup function to disconnect all connections when the component is unmounted.
		return (): void => connections.forEach((connection) => connection.Disconnect());
	}, [scrollingFrameRef, layoutRef, pets, searchText, checkRenderedPets]);

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
			{renderedPets.map((pet, index) => {
				return (
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
					/>
				);
			})}
		</scrollingframe>
	);
});
