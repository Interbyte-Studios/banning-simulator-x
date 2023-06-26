import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EGGS } from "shared/configs/eggs";
import { Pet, Variants } from "shared/configs/pets";
import { ZoneNames } from "shared/configs/zones";
import { getPetData } from "shared/util/getPetData";

import { ZoneTeleportCard } from "../../teleportation/zoneCard";
import { FullComponentHeader } from "../util/fullComponentHeader";

interface SpawnedPet extends Pet {
	variant: Variants;
}

/* eslint-disable jsdoc/require-jsdoc */
export const SpawnPetAdmin = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [zoneSelected, setZoneSelected] = useState<ZoneNames | "Exclusive" | undefined>(undefined);
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
							setZoneSelected(undefined);
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
	} else if (zoneSelected === undefined) {
		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Spawn Pet Admin UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Spawn Pet Admin ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Spawn Pet Admin to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((adminCard) => {
				if (adminCard.IsA("ImageLabel")) {
					adminCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});

		const zonesToDisplay: Array<Roact.Element> = [];
		for (const [, eggData] of pairs(EGGS)) {
			if (eggData.world === "Limited") {
				continue;
			}

			zonesToDisplay.push(
				<ZoneTeleportCard
					world={eggData.world}
					zone={eggData.zone}
					id={eggData.id}
					onActivated={(): void => setZoneSelected(eggData.zone)}
				/>,
			);
		}

		zonesToDisplay.push(
			<ZoneTeleportCard
				world={"Exclusive"}
				zone={"Exclusive"}
				id={500}
				onActivated={(): void => setZoneSelected("Exclusive")}
			/>,
		);

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Select Zone to Spawn a Pet from`}
					returnToSelection={(): void => props.setActiveAction()}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					CanvasPosition={new Vector2(0, 0)}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						Ref={uiListLayoutRef.value}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Padding={new UDim(0, 10)}
					/>
					{zonesToDisplay}
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
		for (const [, eggData] of pairs(EGGS)) {
			if (zoneSelected === "Exclusive" && eggData.zone === "Limited") {
				for (const [, petData] of pairs(eggData.pets)) {
					petsSelection.push(
						{ ...petData, variant: "regular" },
						{ ...petData, variant: "void" },
						{ ...petData, variant: "radiant" },
					);
				}
				continue;
			}

			if (eggData.zone !== zoneSelected) {
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
					headerText={`Spawn Pet for ${props.playerViewing.Name} from ${zoneSelected} Zone`}
					returnToSelection={(): void => setZoneSelected(undefined)}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					CanvasPosition={new Vector2(0, 0)}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={0}
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
