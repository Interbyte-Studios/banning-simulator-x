import Roact from "@rbxts/roact";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { PetViewport } from "client/ui/elements/viewports/petViewport";
import { hooks } from "client/ui/hooks";
import { RARITIES } from "shared/configs/rarities";
import { Pet } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";

import { PetSummary } from "../../petSummary";
import { PetDeletionIndicator } from "./deletionIndicator";
import { PetLevelAndLockIndicator } from "./petLevel";

interface InventoryProps {
	multiDeleteEnabled: boolean;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
	displayPetInfo: (guid: string) => void;
}

interface NativeProps {
	isRendered: boolean;
	storedPetData: Pet;
	layoutOrderIndex: number;
	onActivated?: (guid: string) => void;
	displayFrame?: Roact.Ref<ScrollingFrame>;
	isSelected?: boolean;
}

interface PetFrameProps {
	native: NativeProps;
	inventory?: InventoryProps;
}

/**
 * Renders a single pet frame.
 *
 * @param props The component props.
 * @param props.isRendered Whether the pet should be rendered.
 * @param props.storedPetData The pet data.
 * @param props.layoutOrderIndex The layout order index.
 * @param props.onActivated The function to call when the pet is activated.
 * @returns The rendered pet frame.
 */
export const PetFrame = hooks(
	(props: PetFrameProps, { useState, useEffect, useValue, useContext, useMemo }) => {
		const [displayingSummary, setDisplayingSummary] = useState(false);
		const [isSelectedForDelete, setSelectedForDelete] = useState(false);

		const { isRendered, storedPetData, layoutOrderIndex, onActivated } = props.native;

		const petData = useMemo(() => getPetData(storedPetData.id), [storedPetData.id]);
		const petLevel = getPetLevel(storedPetData);

		const rarityData = useMemo(() => RARITIES[petData.rarity], [petData.rarity]);

		const { addAnnouncement } = useContext(AnnouncementContext);

		if (!isRendered) {
			return <frame BackgroundTransparency={0} LayoutOrder={layoutOrderIndex} />;
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
			if (!props.inventory?.multiDeleteEnabled && isSelectedForDelete) {
				setSelectedForDelete(false);
			}
		}, [props.inventory?.multiDeleteEnabled]);

		useEffect(() => {
			if (props.inventory !== undefined && isSelectedForDelete && !props.inventory.multiDeleteEnabled) {
				setSelectedForDelete(false);
			}
		}, [isSelectedForDelete]);

		useEffect(() => {
			if (props.inventory === undefined) {
				return;
			}

			if (props.inventory.multiDeleteEnabled) {
				if (isSelectedForDelete) {
					props.inventory.addPetToDeletionRegistry(storedPetData.guid);
				}
			}

			if (!isSelectedForDelete) {
				props.inventory.removePetFromDeletionRegistry(storedPetData.guid);
			}
		}, [isSelectedForDelete, props.inventory?.multiDeleteEnabled]);

		const inventoryElements: Array<Roact.Element> = [];
		if (props.inventory !== undefined && props.inventory.multiDeleteEnabled) {
			inventoryElements.push(
				<PetDeletionIndicator
					isSelectedForDeletion={isSelectedForDelete}
					multiDeleteEnabled={props.inventory.multiDeleteEnabled}
				/>,
			);
		}

		let zindex = 1;
		if (props.native.displayFrame !== undefined && displayingSummary) {
			inventoryElements.push(<PetSummary storedPet={storedPetData} inventoryFrame={props.native.displayFrame} />);
			zindex = 2;
		}

		return (
			<frame BackgroundTransparency={1} LayoutOrder={layoutOrderIndex} Ref={petFrameRef.value} ZIndex={zindex}>
				<ImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3:
							(storedPetData.equipped && props.native.isSelected === undefined) ||
							(props.native.isSelected !== undefined && props.native.isSelected)
								? Color3.fromRGB(85, 255, 127)
								: Color3.fromRGB(46, 115, 179),
						Size: UDim2.fromScale(0.925, 0.925),
						Image: "",
					}}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							if (props.inventory !== undefined) {
								if (props.inventory.multiDeleteEnabled) {
									if (storedPetData.locked) {
										addAnnouncement("You cannot delete a locked pet.", AnnouncementType.Error);
										return;
									}

									if (storedPetData.equipped) {
										addAnnouncement("You cannot delete an equipped pet.", AnnouncementType.Error);
										return;
									}

									if (petData.rarity === "Primordial" || petData.rarity === "Secret") {
										addAnnouncement("You cannot delete a Primordial or Secret pet.", AnnouncementType.Error);
										return;
									}
									setSelectedForDelete(!isSelectedForDelete);
								}

								props.inventory.displayPetInfo(storedPetData.guid);
								return;
							}

							onActivated?.(storedPetData.guid);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
					<PetViewport petId={storedPetData.id} variant={storedPetData.variant} shouldBlackout={false} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 0.2),
							Position: UDim2.fromScale(0.5, 0.1),
							Text: petData.name,
							TextColor3:
								petData.rarity === "Epic" ||
								petData.rarity === "Legendary" ||
								petData.rarity === "Primordial" ||
								petData.rarity === "Secret"
									? Color3.fromRGB(255, 255, 255)
									: rarityData.BeginningColor,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					>
						<RarityGradient Rarity={petData.rarity} />
					</StrokeTextLabel>
					<PetLevelAndLockIndicator isLocked={storedPetData.locked} petLevel={petLevel} />
					{inventoryElements}
				</ImageButton>
			</frame>
		);
	},
	{
		componentType: "PureComponent",
	},
);
