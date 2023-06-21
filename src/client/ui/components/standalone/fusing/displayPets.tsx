// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EGGS } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { RARITIES } from "shared/configs/rarities";
import { ZoneNames } from "shared/configs/zones";
import { FusionFailKind } from "shared/remotes/fusing";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";
import { getEggCost } from "shared/util/getEggCost";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface DisplayPetsProps extends DisplayPetsMappedProps {
	variant: Variants;
	returnToSelection: () => void;
	selectedZone: ZoneNames | "Exclusive";
	petSelected: number;
}

interface DisplayPetsMappedProps {
	pets: PetsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): DisplayPetsMappedProps {
	return {
		pets: state.pets,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const DisplayPets = RoactRodux.connect(mapStateToProps)(
	hooks((props: DisplayPetsProps, hooks) => {
		const { useValue, useEffect, useState, useContext } = hooks;

		const { requestFusion } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const returnMinSize = 0.07;
		const returnMaxSize = 0.08;
		const continueMinSize = 0.15;
		const continueMaxSize = 0.2;

		const [selectedPets, setSelectedPets] = useState<Array<string>>([]);

		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative pet level ui.");

			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		});

		const petsSelection: Array<Pet> = [];
		props.pets.forEach((petData) => {
			const eggName = getEggNameFromPetId(petData.id);
			const eggData = EGGS[eggName];
			const variantToDisplay = props.variant === "radiant" ? "void" : props.variant === "void" ? "regular" : "regular";

			if (props.selectedZone === "Exclusive" && eggData.zone === "Limited" && !eggData.hidden) {
				if (petData.variant !== variantToDisplay || petData.id !== props.petSelected) {
					return;
				}

				petsSelection.push(petData);
			}

			if (
				eggData.zone !== props.selectedZone ||
				petData.variant !== variantToDisplay ||
				petData.id !== props.petSelected
			) {
				return;
			}
		});

		const petData = getPetData(props.petSelected);
		const rarityId = RARITIES[petData.rarity].reverseId;
		const maxFusions = RARITIES[petData.rarity].maxFusions;

		// isVoid is set to true since this is radiant fusion.
		const eggName = getEggNameFromPetId(props.petSelected);
		const eggCost = getEggCost(eggName, true, 0);

		// fusion cost = egg cost / rarityId * amount of pets selected or specified fusion cost
		let fusionCost = eggCost.amount / rarityId;
		if (petData.fusionCost !== undefined) {
			fusionCost = petData.fusionCost;
		}

		fusionCost =
			fusionCost * selectedPets.size() * (props.variant === "radiant" ? 3 : props.variant === "void" ? 2 : 1);

		return (
			<>
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(12, 134, 211)}
					Position={UDim2.fromScale(0.325, 0.575)}
					Size={UDim2.fromScale(0.616, 0.775)}
				>
					<uicorner CornerRadius={new UDim(0.05, 0)} />
					<RescalingScrollingFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						ScrollBarThickness={0}
						ScrollingDirection={Enum.ScrollingDirection.Y}
					>
						<uigridlayout
							CellPadding={UDim2.fromOffset(6, 6)}
							CellSize={UDim2.fromOffset(110, 110)}
							SortOrder={Enum.SortOrder.LayoutOrder}
							FillDirectionMaxCells={4}
							Ref={layoutRef.value}
						/>
						{petsSelection.map((petData) => {
							const isSelected = selectedPets.find((petGuid) => petGuid === petData.guid);

							return (
								<BaseFrame LayoutOrder={petData.id}>
									<PetFrame
										petId={petData.id}
										petLevel={getPetLevel(petData)}
										variant={petData.variant}
										displayBackground={true}
										isBillboard={false}
										shouldBlackout={false}
										shouldEquipBackgrund={isSelected !== undefined}
										onActivated={(): void => {
											playSFX(UIEngagement.MajorEngagement);

											if (isSelected === undefined) {
												if (selectedPets.size() >= maxFusions) {
													return;
												}

												if (petData.equipped) {
													addAnnouncement(`You cannot fuse an equipped pet!`, AnnouncementType.Error);
													return;
												}

												if (petData.locked) {
													addAnnouncement(`You cannot fuse a locked pet!`, AnnouncementType.Error);
													return;
												}

												setSelectedPets([...selectedPets, petData.guid]);
											} else {
												const index = selectedPets.findIndex((x) => x === petData.guid);
												if (index !== undefined) {
													const newSelectedPets = [...selectedPets];
													newSelectedPets.unorderedRemove(index);
													setSelectedPets(newSelectedPets);
												}
											}
										}}
									/>
								</BaseFrame>
							);
						})}
					</RescalingScrollingFrame>
				</BaseFrame>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.012, 0.104),
						Image: assetIds.images.ui.index.returnToSelection,
					}}
					size={{
						minSize: returnMinSize,
						maxSize: returnMaxSize,
					}}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.returnToSelection();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.82, 0.82),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{
						minSize: continueMinSize,
						maxSize: continueMaxSize,
					}}
					events={{
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MinorEngagement);

							const petsToFuse = selectedPets.map((guid) => {
								return guid;
							});

							const fusion = await requestFusion.CallServerAsync(petsToFuse, props.variant);
							if (fusion.success) {
								props.returnToSelection();
								addAnnouncement(
									`You've fused a ${
										props.variant === "void" ? "Void" : props.variant === "radiant" ? "Radiant" : "Unknown"
									} pet! Congratulations!`,
									AnnouncementType.Announcement,
								);
								setSelectedPets([]);
								return;
							} else {
								switch (fusion.reason) {
									case FusionFailKind.InternalError: {
										addAnnouncement(`There was an internal error while fusing your pet.`, AnnouncementType.Error);
										setSelectedPets([]);
										return;
									}
									case FusionFailKind.NotEnoughCurrency: {
										addAnnouncement(`You don't have enough currency to fuse that pet!`, AnnouncementType.Error);
										setSelectedPets([]);
										return;
									}
									case FusionFailKind.PetsNotSameId: {
										addAnnouncement(`There was an internal error while fusing your pet.`, AnnouncementType.Error);
										setSelectedPets([]);
										return;
									}
									case FusionFailKind.UnsuccesfulFusion: {
										addAnnouncement(`Your fusion was unsuccesful.`, AnnouncementType.Error);
										setSelectedPets([]);
										return;
									}
								}
							}
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.85, 0.85),
							Text: "Fuse",
						}}
						stroke={{
							native: { Thickness: 1.5, Color: Color3.fromRGB(18, 115, 5) },
						}}
					/>
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.82, 0.4),
						Size: UDim2.fromScale(0.34, 0.114),
						Text: `For a ${props.variant === "radiant" ? "Radiant" : props.variant === "void" ? "Void" : "Regular"} ${
							petData.name
						}`,
					}}
					stroke={{
						native: {
							Thickness: 1.5,
							Color: Color3.fromRGB(9, 100, 156),
						},
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.82, 0.265),
						Size: UDim2.fromScale(0.34, 0.15),
						Text: `${twoDpAbbreviator.numberToString(selectedPets.size() * (100 / maxFusions))}%`,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) },
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.82, 0.47),
						Size: UDim2.fromScale(0.34, 0.06),
						Text: `-------------------`,
					}}
					stroke={{
						native: {
							Thickness: 1.5,
							Color: Color3.fromRGB(9, 100, 156),
						},
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.82, 0.7),
						Size: UDim2.fromScale(0.34, 0.06),
						Text: `-------------------`,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) },
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.875, 0.585),
						Size: UDim2.fromScale(0.21, 0.14),
						Text: `${twoDpAbbreviator.numberToString(fusionCost)}`,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) },
						currencyGradient: eggCost.currencyType,
					}}
				>
					<CurrencyIcon
						anchorPoint={vec2Middle}
						position={UDim2.fromScale(-0.25, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={eggCost.currencyType}
					/>
				</StrokeTextLabel>
			</>
		);
	}),
);
