import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { PetViewport } from "client/ui/elements/petViewport";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { updateContentSize } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { RARITIES } from "shared/configs/rarities";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";

interface PetItemsProps extends PetItemsMappedProps {
	multiDeleteEnabled: boolean;
	searchText: string | undefined;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
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

/* eslint-disable jsdoc/require-jsdoc */
const PetFrame = hooks(
	(
		props: {
			isRendered: boolean;
			storedPetData: Pet;
			multiDeleteEnabled: boolean;
			addPetToDeletionRegistry: (guid: string) => void;
			removePetFromDeletionRegistry: (guid: string) => void;
			layoutOrderIndex: number;
		},
		{ useState, useEffect },
	) => {
		const [isSelectedForDelete, setSelectedForDelete] = useState(false);

		const petData = getPetData(props.storedPetData.id);

		const rarityData = RARITIES[petData.rarity];

		const additionalDisplayedElements: Array<Roact.Element> = [];
		if (isSelectedForDelete) {
			if (props.multiDeleteEnabled) {
				additionalDisplayedElements.push(
					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.925, 0.925)}
						Image={assetIds.images.ui.inventory.pets.deleteIndicator}
						ScaleType={Enum.ScaleType.Fit}
					/>,
				);
			}
		}

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
		}, [isSelectedForDelete]);

		if (props.isRendered) {
			return (
				<frame BackgroundTransparency={1} LayoutOrder={props.layoutOrderIndex}>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(46, 115, 179)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.925, 0.925)}
						Image={""}
						Event={{
							Activated: (): void => {
								if (props.multiDeleteEnabled) {
									setSelectedForDelete(!isSelectedForDelete);
								}
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
						<PetViewport petId={props.storedPetData.id} variant={props.storedPetData.variant} />
						{additionalDisplayedElements}
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 0.2)}
							Position={UDim2.fromScale(0.5, 0.1)}
							Text={petData.name}
							TextScaled={true}
							Font={font}
							TextColor3={
								petData.rarity === "Epic" ||
								petData.rarity === "Legendary" ||
								petData.rarity === "Primordial" ||
								petData.rarity === "Prismatic"
									? rarityData.BeginningColor
									: Color3.fromRGB(255, 255, 255)
							}
						>
							<RarityGradient Rarity={petData.rarity} />
							<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
						</textlabel>
					</imagebutton>
				</frame>
			);
		} else {
			return <frame BackgroundTransparency={0} LayoutOrder={props.layoutOrderIndex}></frame>;
		}
	},
	{
		componentType: "PureComponent",
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays the player's pets.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PetItems = RoactRodux.connect(petItemsMapStateToProps)(
	hooks((props: PetItemsProps, { useEffect, useValue, useState }) => {
		const [petsToRender, setPetsToRender] = useState(
			props.pets.map((pet) => {
				return { ...pet, isRendered: false };
			}),
		);

		/**
		 * Sets the `petsToRender` entries accordingly to which should be rendered.
		 *
		 * @param scrollingFrame The pet inventory ScrollingFrame.
		 */
		function setRenderedPets(scrollingFrame: ScrollingFrame): void {
			const uiGridLayout = scrollingFrame.FindFirstChildOfClass("UIGridLayout");
			if (uiGridLayout === undefined) {
				warn("Did not find UIGridLayout");
				return;
			}

			if (scrollingFrame.CanvasPosition.Y === 0) {
				const mutatedPets = [...petsToRender];
				for (let i = 0; i <= uiGridLayout.FillDirectionMaxCells * 4 - 1; i++) {
					const petToRender = mutatedPets[i];
					if (petToRender === undefined) {
						continue;
					}

					mutatedPets[i].isRendered = true;
				}

				setPetsToRender(mutatedPets);
			} else {
				setPetsToRender(
					petsToRender.map((pet, index) => {
						const y_coordinate = math.floor(index / uiGridLayout.FillDirectionMaxCells);
						const absolutePosition =
							y_coordinate * uiGridLayout.CellSize.Y.Offset + y_coordinate * uiGridLayout.CellPadding.Y.Offset;

						const greaterThanMinimum =
							absolutePosition >= math.floor(scrollingFrame.CanvasPosition.Y / uiGridLayout.FillDirectionMaxCells);
						const lessThanMaximum =
							absolutePosition <= math.ceil(scrollingFrame.CanvasPosition.Y * uiGridLayout.FillDirectionMaxCells);

						const shouldBeRendered = greaterThanMinimum && lessThanMaximum;

						if (shouldBeRendered !== pet.isRendered) {
							return {
								...pet,
								isRendered: shouldBeRendered,
							};
						}

						return pet;
					}),
				);
			}
		}

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

			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridStyleLayout");
			assert(gridLayout, `No UIGridStyleLayout was found in ${scrollingFrame.GetFullName()}`);

			const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
			return (): void => {
				resizeConnection.Disconnect();
			};
		}, []);

		useEffect(() => {
			const scrollingFrame = scrollingFrameRef.value.getValue();
			assert(scrollingFrame, "Failed to get ScrollingFrame");

			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found in ${scrollingFrame.GetFullName()}`);

			setRenderedPets(scrollingFrame);

			const connection = gridLayout.GetPropertyChangedSignal("FillDirectionMaxCells").Connect(() => {
				setRenderedPets(scrollingFrame);
			});

			return (): void => connection.Disconnect();
		}, []);

		const searchText = props.searchText?.lower();
		if (searchText !== undefined) {
			setPetsToRender(
				petsToRender.filter((pet) => {
					const petData = getPetData(pet.id);

					return petData.name.lower().find(searchText, 1, true)[0] !== undefined;
				}),
			);
		}

		return (
			<scrollingframe
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.965, 0.74)}
				Position={UDim2.fromScale(0.5, 0.495)}
				ScrollBarThickness={0}
				Change={{
					CanvasPosition: (scrollingFrame): void => setRenderedPets(scrollingFrame),
				}}
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
						/>
					);
				})}
			</scrollingframe>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
