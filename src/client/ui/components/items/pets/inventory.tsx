import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { sortPets } from "client/modules/pets/sort";
import { uiDarkStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { updateContentSize } from "client/ui/elements/common/rescalingScrollingFrame";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { PetViewport } from "client/ui/elements/viewports/petViewport";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { RARITIES } from "shared/configs/rarities";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";

import { PetInventoryData } from ".";
import { PetSummary } from "./petSummary";

interface PetItemsProps extends PetItemsMappedProps {
	multiDeleteEnabled: boolean;
	searchText: string | undefined;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
	displayPetInfo: (guid: string) => void;
}

interface PetItemsMappedProps {
	pets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function petItemsMapStateToProps(state: StoreState): PetItemsMappedProps {
	return {
		pets: state.pets,
	};
}

/**
 * Renders a single pet frame.
 */
const PetFrame = hooks(
	(
		props: {
			isRendered: boolean;
			storedPetData: Pet;
			multiDeleteEnabled: boolean;
			addPetToDeletionRegistry: (guid: string) => void;
			removePetFromDeletionRegistry: (guid: string) => void;
			layoutOrderIndex: number;
			displayPetInfo: (guid: string) => void;
			inventoryFrame: Roact.Ref<ScrollingFrame>;
		},
		{ useState, useEffect, useValue, useContext },
	) => {
		const [displayingSummary, setDisplayingSummary] = useState(false);
		const [isSelectedForDelete, setSelectedForDelete] = useState(false);

		const petData = getPetData(props.storedPetData.id);
		const petLevel = getPetLevel(props.storedPetData);

		const rarityData = RARITIES[petData.rarity];

		const { addAnnouncement } = useContext(AnnouncementContext);

		const additionalDisplayedElements: Array<Roact.Element> = [];
		if (isSelectedForDelete) {
			if (props.multiDeleteEnabled) {
				additionalDisplayedElements.push(
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.925, 0.925),
							Image: assetIds.images.ui.inventory.pets.deleteIndicator,
						}}
					/>,
				);
			}
		}

		if (!props.isRendered) {
			return <frame BackgroundTransparency={0} LayoutOrder={props.layoutOrderIndex} />;
		}

		if (props.storedPetData.locked) {
			if (petLevel > 1) {
				additionalDisplayedElements.push(
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.95),
							Size: UDim2.fromScale(0.7, 0.2),
							Text: `Level: ${petLevel}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
						<ImageLabel
							native={{
								Size: UDim2.fromScale(1, 1),
								Position: UDim2.fromScale(-0.15, 0.5),
								Image: assetIds.images.ui.inventory.locked,
							}}
						>
							<uiaspectratioconstraint AspectRatio={1} />
						</ImageLabel>
					</StrokeTextLabel>,
				);
			} else {
				additionalDisplayedElements.push(
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.25, 0.25),
							Position: UDim2.fromScale(0.5, 0.95),
							Image: assetIds.images.ui.inventory.locked,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>,
				);
			}
		} else {
			if (petLevel > 1) {
				additionalDisplayedElements.push(
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.95),
							Size: UDim2.fromScale(0.7, 0.2),
							Text: `Level: ${petLevel}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>,
				);
			}
		}

		let zindex = 1;
		if (displayingSummary) {
			additionalDisplayedElements.push(
				<PetSummary storedPet={props.storedPetData} inventoryFrame={props.inventoryFrame} />,
			);
			zindex = 2;
		}

		const petFrameRef = useValue(Roact.createRef<Frame>());
		useEffect(() => {
			const petFrame = petFrameRef.value.getValue();
			assert(petFrame, `Failed to get pet frame ref value.`);

			const connections: Array<RBXScriptConnection> = [];

			const mouseEnteredConnection = petFrame.MouseEnter.Connect(() => setDisplayingSummary(true));
			connections.push(mouseEnteredConnection);

			const mouseLeftConnection = petFrame.MouseLeave.Connect(() => setDisplayingSummary(false));
			connections.push(mouseLeftConnection);

			return (): void => connections.forEach((conn) => conn.Disconnect());
		}, []);

		useEffect(() => {
			if (isSelectedForDelete) {
				if (!props.multiDeleteEnabled) {
					setSelectedForDelete(false);
				}
			}
		});

		useEffect(() => {
			if (props.multiDeleteEnabled) {
				if (isSelectedForDelete) {
					props.addPetToDeletionRegistry(props.storedPetData.guid);
				}
			}

			if (!isSelectedForDelete) {
				props.removePetFromDeletionRegistry(props.storedPetData.guid);
			}
		}, [isSelectedForDelete, props.multiDeleteEnabled]);

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.layoutOrderIndex} Ref={petFrameRef.value} ZIndex={zindex}>
				<ImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: props.storedPetData.equipped
							? Color3.fromRGB(85, 255, 127)
							: Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							if (props.multiDeleteEnabled) {
								if (props.storedPetData.locked) {
									addAnnouncement("That pet is locked.", AnnouncementType.Error);
								} else {
									setSelectedForDelete(!isSelectedForDelete);
								}
							}

							props.displayPetInfo(props.storedPetData.guid);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
					<PetViewport petId={props.storedPetData.id} variant={props.storedPetData.variant} shouldBlackout={false} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.2),
							Position: UDim2.fromScale(0.5, 0.1),
							Text: petData.name,
							TextColor3:
								petData.rarity === "Epic" ||
								petData.rarity === "Legendary" ||
								petData.rarity === "Primordial" ||
								petData.rarity === "Prismatic"
									? Color3.fromRGB(255, 255, 255)
									: rarityData.BeginningColor,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					>
						<RarityGradient Rarity={petData.rarity} />
					</StrokeTextLabel>
					{additionalDisplayedElements}
				</ImageButton>
			</frame>
		);
	},
	{
		componentType: "PureComponent",
	},
);

/**
 * Sets the `petsToRender` entries accordingly to which should be rendered.
 *
 * @param scrollingFrame The pet inventory ScrollingFrame.
 * @param uiGridLayout The UIGridLayout associated with the `scrollingFrame`.
 * @param search The current search text.
 * @param renderedPetsState Rendered pets.
 * @returns The filtered rendered pets.
 */
function setRenderedPets(
	scrollingFrame: ScrollingFrame,
	uiGridLayout: UIGridLayout,
	search: string | undefined,
	renderedPetsState: Array<PetInventoryData> | Readonly<Array<PetInventoryData>>,
): Array<PetInventoryData> {
	const searchText = search?.lower();

	const renderedPets = renderedPetsState.map((pet, index) => {
		const y = math.floor(index / uiGridLayout.FillDirectionMaxCells);
		const yPos = y * uiGridLayout.CellSize.Y.Offset + y * uiGridLayout.CellPadding.Y.Offset;

		// the frame can be visible if we are half way from the previous y coordinate
		// so we need to go from the previous y coordinate position + padding
		// equivalent to the current CanvasPosition - CellSize
		const belowTop = yPos >= scrollingFrame.CanvasPosition.Y - uiGridLayout.CellSize.Y.Offset;
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
}

/**
 * Displays the player's pets.
 */
export const PetItems = RoactRodux.connect(petItemsMapStateToProps)(
	hooks((props: PetItemsProps, { useEffect, useValue, useState }) => {
		const [petsToRender, setPetsToRender] = useState<Array<PetInventoryData>>(
			props.pets.map((pet) => {
				return { ...pet, isRendered: false };
			}),
		);

		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for pet item inventory.");

			CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
		});

		const scrollingFrameRef = useValue(Roact.createRef<ScrollingFrame>());
		useEffect(() => {
			const scrollingFrame = scrollingFrameRef.value.getValue();
			assert(scrollingFrame, "Failed to get ScrollingFrame");

			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found in ${scrollingFrame.GetFullName()}`);

			const connections: Array<RBXScriptConnection> = [
				gridLayout.GetPropertyChangedSignal("FillDirectionMaxCells"),
				scrollingFrame.GetPropertyChangedSignal("CanvasPosition"),
				scrollingFrame.GetPropertyChangedSignal("AbsoluteCanvasSize"),
			].map((conn) =>
				conn.Connect(() => {
					const searchText = props.searchText?.lower();
					if (searchText === undefined) {
						const mappedPets = props.pets.map((pet) => {
							return {
								...pet,
								isRendered: false,
							};
						});

						sortPets(mappedPets, true, true);
						setPetsToRender(setRenderedPets(scrollingFrame, gridLayout, props.searchText, mappedPets));
					} else {
						const mappedPets = props.pets.map((pet) => {
							return {
								...pet,
								isRendered: false,
							};
						});

						const filteredPets = mappedPets.filter((pet) => {
							const petData = getPetData(pet.id);

							const matches = petData.name.lower().find(searchText, 1, true)[0] !== undefined;
							return matches;
						});

						setPetsToRender(setRenderedPets(scrollingFrame, gridLayout, props.searchText, filteredPets));
					}
				}),
			);

			const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
			connections.push(resizeConnection);

			const searchText = props.searchText?.lower();
			if (searchText === undefined) {
				const mappedPets = props.pets.map((pet) => {
					return {
						...pet,
						isRendered: false,
					};
				});

				sortPets(mappedPets, true, true);
				setPetsToRender(setRenderedPets(scrollingFrame, gridLayout, props.searchText, mappedPets));
			} else {
				const mappedPets = props.pets.map((pet) => {
					return {
						...pet,
						isRendered: false,
					};
				});

				const filteredPets = mappedPets.filter((pet) => {
					const petData = getPetData(pet.id);

					const matches = petData.name.lower().find(searchText, 1, true)[0] !== undefined;
					return matches;
				});

				setPetsToRender(setRenderedPets(scrollingFrame, gridLayout, props.searchText, filteredPets));
			}

			return (): void => connections.forEach((connection) => connection.Disconnect());
		}, [scrollingFrameRef, props.pets, props.searchText]);

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
				{petsToRender.map((pet, index) => {
					return (
						<PetFrame
							Key={pet.guid}
							isRendered={pet.isRendered}
							storedPetData={pet}
							multiDeleteEnabled={props.multiDeleteEnabled}
							addPetToDeletionRegistry={props.addPetToDeletionRegistry}
							removePetFromDeletionRegistry={props.removePetFromDeletionRegistry}
							layoutOrderIndex={index}
							displayPetInfo={props.displayPetInfo}
							inventoryFrame={scrollingFrameRef.value}
						/>
					);
				})}
			</scrollingframe>
		);
	}),
);
