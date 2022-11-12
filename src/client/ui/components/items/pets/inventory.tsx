import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { PetViewport } from "client/ui/elements/petViewport";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
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
			storedPetData: Pet;
			multiDeleteEnabled: boolean;
			addPetToDeletionRegistry: (guid: string) => void;
			removePetFromDeletionRegistry: (guid: string) => void;
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

		return (
			<frame BackgroundTransparency={1} LayoutOrder={petData.id} Key={props.storedPetData.guid}>
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
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 3, Transparency: 0.5 }} />
					<PetViewport
						native={{
							AnchorPoint: vec2Middle,
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.9, 0.9),
							BackgroundTransparency: 1,
						}}
						petId={props.storedPetData.id}
						variant={props.storedPetData.variant}
					/>
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
						<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					</textlabel>
				</imagebutton>
			</frame>
		);
	},
	{
		componentType: "PureComponent",
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays the player's pets.
 */
export const PetItems = RoactRodux.connect(petItemsMapStateToProps)(
	hooks((props: PetItemsProps, { useEffect, useValue }) => {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for pet item inventory.");

			CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
		});

		debug.profilebegin("filterPets");
		let petsToRender = props.pets;
		const searchText = props.searchText?.lower();
		if (searchText !== undefined) {
			petsToRender = props.pets.filter((pet) => {
				const petData = getPetData(pet.id);

				return petData.name.lower().find(searchText, 1, true)[0] !== undefined;
			});
		}
		debug.profileend();

		return (
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.965, 0.74)}
				Position={UDim2.fromScale(0.5, 0.495)}
				ScrollBarThickness={0}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(6, 6)}
					CellSize={UDim2.fromOffset(110, 110)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirectionMaxCells={5}
					Ref={layoutRef.value}
				/>
				{petsToRender.map((pet) => {
					return (
						<PetFrame
							storedPetData={pet}
							multiDeleteEnabled={props.multiDeleteEnabled}
							addPetToDeletionRegistry={props.addPetToDeletionRegistry}
							removePetFromDeletionRegistry={props.removePetFromDeletionRegistry}
						/>
					);
				})}
			</RescalingScrollingFrame>
		);
	}),
);
