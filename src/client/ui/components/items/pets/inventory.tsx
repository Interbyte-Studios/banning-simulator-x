import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { PetViewport } from "client/ui/elements/petViewport";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { RARITIES } from "shared/configs/rarities";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";

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
 * Displays the player's pets.
 */
export const PetItems = RoactRodux.connect(petItemsMapStateToProps)(
	hooks((props: PetItemsMappedProps, { useEffect, useValue }) => {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for pet item inventory.");

			uiGridLayout.SetAttribute("DefaultCellSize", uiGridLayout.CellSize);
			CollectionService.AddTag(uiGridLayout, `ScaledGridLayout`);
		});

		const petsToDisplay: Array<Roact.Element> = [];
		for (const pet of props.pets) {
			const eggName = getEggNameFromPetId(pet.id);
			const petData = getPetData(eggName, pet.id);

			const rarityData = RARITIES[petData.rarity];

			const element = (
				<frame BackgroundTransparency={1}>
					<frame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(204, 204, 204)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.925, 0.925)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(0.075, 0)} />
						<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 3, Transparency: 0.5 }} />
						<PetViewport
							native={{
								AnchorPoint: vec2Middle,
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								BackgroundTransparency: 1,
							}}
							eggName={eggName}
							petId={pet.id}
							isVoid={pet.variant === "void"}
						/>
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
							<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
						</textlabel>
					</frame>
				</frame>
			);

			petsToDisplay.push(element);
		}

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
					CellSize={new UDim2(0.158, 0, 0, 110)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirectionMaxCells={6}
					Ref={layoutRef.value}
				/>
				{petsToDisplay}
			</RescalingScrollingFrame>
		);
	}),
);
