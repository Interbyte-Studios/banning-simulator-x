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
		},
		{ useState, useEffect, useValue },
	) => {
		const [displayingSummary, setDisplayingSummary] = useState(false);
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

		if (!props.isRendered) {
			return <frame BackgroundTransparency={0} LayoutOrder={props.layoutOrderIndex} />;
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

		let zindex = 1;
		if (displayingSummary) {
			additionalDisplayedElements.push(<PetSummary storedPet={props.storedPetData} />);
			zindex = 2;
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.layoutOrderIndex} Ref={petFrameRef.value} ZIndex={zindex}>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(46, 115, 179)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.925, 0.925)}
					Image={""}
					Event={{
						/**
						 * Triggered when the pet frame is clicked.
						 */
						Activated: (): void => {
							if (props.multiDeleteEnabled) {
								setSelectedForDelete(!isSelectedForDelete);
							}

							props.displayPetInfo(props.storedPetData.guid);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
					<PetViewport petId={props.storedPetData.id} variant={props.storedPetData.variant} />
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
					{additionalDisplayedElements}
				</imagebutton>
			</frame>
		);
	},
	{
		componentType: "PureComponent",
	},
);

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

		/**
		 * Sets the `petsToRender` entries accordingly to which should be rendered.
		 *
		 * @param scrollingFrame The pet inventory ScrollingFrame.
		 * @param uiGridLayout The UIGridLayout associated with the `scrollingFrame`.
		 */
		function setRenderedPets(scrollingFrame: ScrollingFrame, uiGridLayout: UIGridLayout): void {
			const searchText = props.searchText?.lower();

			setPetsToRender(
				petsToRender.map((pet, index) => {
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
				}),
			);
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

			const gridLayout = scrollingFrame.FindFirstChildWhichIsA("UIGridLayout");
			assert(gridLayout, `No UIGridLayout was found in ${scrollingFrame.GetFullName()}`);

			const connections: Array<RBXScriptConnection> = [
				gridLayout.GetPropertyChangedSignal("FillDirectionMaxCells"),
				scrollingFrame.GetPropertyChangedSignal("CanvasPosition"),
				scrollingFrame.GetPropertyChangedSignal("AbsoluteCanvasSize"),
			].map((conn) => conn.Connect(() => setRenderedPets(scrollingFrame, gridLayout)));

			const resizeConnection = updateContentSize(scrollingFrame, gridLayout);
			connections.push(resizeConnection);

			setRenderedPets(scrollingFrame, gridLayout);
			return (): void => connections.forEach((connection) => connection.Disconnect());
		}, [scrollingFrameRef]);

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
						/>
					);
				})}
			</scrollingframe>
		);
	}),
);
