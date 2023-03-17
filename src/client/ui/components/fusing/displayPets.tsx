import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { PetFrame } from "client/ui/elements/petFrame";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
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
	selectedZone: ZoneNames;
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
		const returnMinSpring = new Flipper.Spring(returnMinSize, { frequency: 5 });

		const returnMaxSize = 0.08;
		const returnMaxSpring = new Flipper.Spring(returnMaxSize, { frequency: 5 });

		const continueMinSize = 0.15;
		const continueMinSpring = new Flipper.Spring(continueMinSize, { frequency: 5 });

		const continueMaxSize = 0.2;
		const continueMaxSpring = new Flipper.Spring(continueMaxSize, { frequency: 5 });

		const returnMotor = useBindingMotor(hooks, returnMaxSize);
		const continueMotor = useBindingMotor(hooks, continueMaxSize);

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

			if (eggData.zone !== props.selectedZone) {
				return;
			}

			const variantToDisplay = props.variant === "radiant" ? "void" : props.variant === "void" ? "regular" : "regular";

			if (petData.variant !== variantToDisplay) {
				return;
			}

			if (petData.id !== props.petSelected) {
				return;
			}

			petsSelection.push(petData);
		});

		const petData = getPetData(props.petSelected);
		const rarityId = RARITIES[petData.rarity].reverseId;
		const maxFusions = RARITIES[petData.rarity].maxFusions;

		// isVoid is set to true since this is radiant fusion.
		const eggName = getEggNameFromPetId(props.petSelected);
		const eggCost = getEggCost(eggName, true, 0);

		// fusion cost = egg cost / rarityId * amount of pets selected
		const fusionCost =
			(eggCost.amount / rarityId) *
			selectedPets.size() *
			(props.variant === "radiant" ? 3 : props.variant === "void" ? 2 : 1);

		return (
			<>
				<frame
					AnchorPoint={vec2Middle}
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
								<frame BackgroundTransparency={1} LayoutOrder={petData.id}>
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
								</frame>
							);
						})}
					</RescalingScrollingFrame>
				</frame>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.012, 0.104)}
					Size={returnMotor.binding.map((value) => {
						return UDim2.fromScale(0.1, value);
					})}
					Image={assetIds.images.ui.index.returnToSelection}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);
							props.returnToSelection();
						},
						MouseEnter: (): void => returnMotor.motor.setGoal(returnMinSpring),
						MouseLeave: (): void => returnMotor.motor.setGoal(returnMaxSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.82, 0.82)}
					Size={continueMotor.binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					Image={assetIds.images.ui.index.Claim}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MinorEngagement);

							const petsToFuse = selectedPets.map((guid) => {
								return guid;
							});

							const fusion = await requestFusion.CallServerAsync(petsToFuse, props.variant);
							if (fusion.success) {
								props.returnToSelection();
								addAnnouncement(`You've fused a Radiant pet! Congratulations!`, AnnouncementType.Announcement);
								return;
							} else {
								switch (fusion.reason) {
									case FusionFailKind.InternalError: {
										addAnnouncement(`There was an internal error while fusing your pet.`, AnnouncementType.Error);
										return;
									}
									case FusionFailKind.NotEnoughCurrency: {
										addAnnouncement(`You don't have enough currency to fuse that pet!`, AnnouncementType.Error);
										return;
									}
									case FusionFailKind.PetsNotSameId: {
										addAnnouncement(`There was an internal error while fusing your pet.`, AnnouncementType.Error);
										return;
									}
									case FusionFailKind.UnsuccesfulFusion: {
										addAnnouncement(`Your fusion was unsuccesful.`, AnnouncementType.Error);
										return;
									}
								}
							}
						},
						MouseEnter: (): void => continueMotor.motor.setGoal(continueMinSpring),
						MouseLeave: (): void => continueMotor.motor.setGoal(continueMaxSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.85, 0.85)}
						Font={font}
						Text={`Fuse`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(18, 115, 5) }} />
					</textlabel>
				</imagebutton>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.82, 0.4)}
					Size={UDim2.fromScale(0.34, 0.114)}
					Font={font}
					Text={`For a ${props.variant === "radiant" ? "Radiant" : props.variant === "void" ? "Void" : "Regular"} ${
						petData.name
					}`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.82, 0.265)}
					Size={UDim2.fromScale(0.34, 0.15)}
					Font={font}
					Text={`${twoDpAbbreviator.numberToString(selectedPets.size() * (100 / maxFusions))}%`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.82, 0.47)}
					Size={UDim2.fromScale(0.34, 0.06)}
					Font={font}
					Text={`-------------------`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.82, 0.7)}
					Size={UDim2.fromScale(0.34, 0.06)}
					Font={font}
					Text={`-------------------`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.875, 0.585)}
					Size={UDim2.fromScale(0.21, 0.14)}
					Font={font}
					Text={`${twoDpAbbreviator.numberToString(fusionCost)}`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Right}
				>
					<BaseUIStroke
						native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 100, 156) }}
						currencyGradient={eggCost.currencyType}
					/>
					<CurrencyIcon
						anchorPoint={vec2Middle}
						position={UDim2.fromScale(-0.25, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={eggCost.currencyType}
					/>
				</textlabel>
			</>
		);
	}),
);
