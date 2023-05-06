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

interface PetFrameProps {
	isRendered: boolean;
	storedPetData: Pet;
	multiDeleteEnabled: boolean;
	addPetToDeletionRegistry: (guid: string) => void;
	removePetFromDeletionRegistry: (guid: string) => void;
	layoutOrderIndex: number;
	displayPetInfo: (guid: string) => void;
	inventoryFrame: Roact.Ref<ScrollingFrame>;
}

/**
 * Renders a single pet frame.
 *
 * @param props The component props.
 * @param props.isRendered Whether the pet should be rendered.
 * @param props.storedPetData The pet data.
 * @param props.multiDeleteEnabled Whether multi-delete is enabled.
 * @param props.addPetToDeletionRegistry Adds the pet to the deletion registry.
 * @param props.removePetFromDeletionRegistry Removes the pet from the deletion registry.
 * @param props.layoutOrderIndex The layout order index.
 * @param props.displayPetInfo Displays the pet info.
 * @param props.inventoryFrame The inventory frame.
 * @returns The rendered pet frame.
 */
export const PetFrame = hooks(
	(props: PetFrameProps, { useState, useEffect, useValue, useContext, useMemo }) => {
		const [displayingSummary, setDisplayingSummary] = useState(false);
		const [isSelectedForDelete, setSelectedForDelete] = useState(false);

		const petData = useMemo(() => getPetData(props.storedPetData.id), [props.storedPetData.id]);
		const petLevel = getPetLevel(props.storedPetData);

		const rarityData = useMemo(() => RARITIES[petData.rarity], [petData.rarity]);

		const { addAnnouncement } = useContext(AnnouncementContext);

		if (!props.isRendered) {
			return <frame BackgroundTransparency={0} LayoutOrder={props.layoutOrderIndex} />;
		}

		const petSummary: Array<Roact.Element> = [];
		let zindex = 1;
		if (displayingSummary) {
			petSummary.push(<PetSummary storedPet={props.storedPetData} inventoryFrame={props.inventoryFrame} />);
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
					<PetDeletionIndicator
						isSelectedForDeletion={isSelectedForDelete}
						multiDeleteEnabled={props.multiDeleteEnabled}
					/>
					<PetLevelAndLockIndicator isLocked={props.storedPetData.locked} petLevel={petLevel} />
					{petSummary}
				</ImageButton>
			</frame>
		);
	},
	{
		componentType: "PureComponent",
	},
);
