import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getEggImage } from "client/util/getEggImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName, EGGS } from "shared/configs/eggs";
import { Pet, Variants } from "shared/configs/pets";
import { getPetData } from "shared/util/getPetData";

import { FullComponentHeader } from "../util/fullComponentHeader";

interface SpawnedPet extends Pet {
	variant: Variants;
}

/* eslint-disable jsdoc/require-jsdoc */
export const SpawnPetAdmin = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [eggSelected, setEggSelected] = useState<EggName | undefined>(undefined);
	const [petSelected, setPetSelected] = useState<SpawnedPet | undefined>(undefined);

	const { admin_SpawnPet } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const maximizedSize = 0.15;

	if (petSelected !== undefined) {
		const petName = getPetData(petSelected.id).name;

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Pet Spawn Confirmation for ${props.playerViewing.Name}`}
					returnToSelection={(): void => setPetSelected(undefined)}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.2),
						Text: `Are you sure you want to spawn a "${
							petSelected.variant === "radiant" ? "Radiant" : petSelected.variant === "void" ? "Void" : "Regular"
						} ${petName}" pet for player: ${props.playerViewing.Name}? It's rarity is: ${petSelected.rarity}.`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.75, 0.675),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{
						maxSize: maximizedSize,
						minSize: minimizedSize,
					}}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setPetSelected(undefined);
							setEggSelected(undefined);
							props.setActiveAction();
							admin_SpawnPet.SendToServer(props.playerViewing.UserId, {
								petId: petSelected.id,
								variant: petSelected.variant,
							});
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Yes!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) },
						}}
					/>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.25, 0.675),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{
						maxSize: maximizedSize,
						minSize: minimizedSize,
					}}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setPetSelected(undefined);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "No!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(140, 28, 104) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else if (eggSelected === undefined) {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative pet spawning ui.");

			const scrollingFrame = uiGridLayout.Parent;
			assert(scrollingFrame, "Failed to get ScrollingFrame for administrative pet spawning ui.");
			assert(scrollingFrame.IsA("ScrollingFrame"), "Expected administrative pet spawning ui to have a ScrollingFrame.");

			scrollingFrame.CanvasPosition = new Vector2(0, 0);
			CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
		});

		const eggsToDisplay: Array<Roact.Element> = [];
		for (const [eggName, eggData] of pairs(EGGS)) {
			let eggDecal: string | undefined;
			const [success, result] = pcall(() => getEggImage(eggName));
			if (success) {
				eggDecal = result;
			}

			eggsToDisplay.push(
				<BaseFrame LayoutOrder={eggData.id}>
					<BaseFrame Size={UDim2.fromScale(0.85, 0.85)}>
						<SpringImageButton
							native={{
								BackgroundTransparency: 0,
								BackgroundColor3: Color3.fromRGB(46, 115, 179),
								Image: "",
							}}
							events={{
								Activated: (): void => {
									playSFX(UIEngagement.MajorEngagement);
									setEggSelected(eggName);
								},
							}}
							size={{ minSize: 0.825, maxSize: 0.925 }}
						>
							<uiaspectratioconstraint AspectRatio={1} />
							<uicorner CornerRadius={new UDim(1, 0)} />

							<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
							{eggDecal !== undefined && (
								<SpringImageLabel
									native={{
										Image: eggDecal,
									}}
									size={{ minSize: 0.75, maxSize: 0.8 }}
								/>
							)}
							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.5, 0),
									Size: UDim2.fromScale(0.9, 0.2),
									Text: eggName,
								}}
								stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
							/>
						</SpringImageButton>
					</BaseFrame>
				</BaseFrame>,
			);
		}

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Select an egg to spawn a pet from`}
					returnToSelection={(): void => props.setActiveAction()}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					CanvasPosition={new Vector2(0, 0)}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={12}
					BorderSizePixel={0}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(110, 110)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={layoutRef.value}
					/>
					{eggsToDisplay}
				</RescalingScrollingFrame>
			</>
		);
	} else {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative pet spawning ui.");

			const scrollingFrame = uiGridLayout.Parent;
			assert(scrollingFrame, "Failed to get ScrollingFrame for administrative pet spawning ui.");
			assert(scrollingFrame.IsA("ScrollingFrame"), "Expected administrative pet spawning ui to have a ScrollingFrame.");

			scrollingFrame.CanvasPosition = new Vector2(0, 0);
			CollectionService.AddTag(uiGridLayout, `InventoryGridLayout`);
		});

		const petsSelection: Array<SpawnedPet> = [];
		for (const [eggName, eggData] of pairs(EGGS)) {
			if (eggName !== eggSelected) {
				continue;
			}

			for (const [, petData] of pairs(eggData.pets)) {
				petsSelection.push(
					{ ...petData, variant: "regular" },
					{ ...petData, variant: "void" },
					{ ...petData, variant: "radiant" },
				);
			}
		}

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Spawn Pet for ${props.playerViewing.Name} from ${eggSelected} Egg`}
					returnToSelection={(): void => setEggSelected(undefined)}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					CanvasPosition={new Vector2(0, 0)}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={12}
					BorderSizePixel={0}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(110, 110)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={layoutRef.value}
					/>
					{petsSelection.map((petData) => {
						return (
							<BaseFrame LayoutOrder={petData.id}>
								<PetFrame
									petId={petData.id}
									variant={petData.variant}
									displayBackground={true}
									isBillboard={false}
									shouldBlackout={false}
									onActivated={(): void => {
										setPetSelected(petData);
									}}
								/>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}
});
