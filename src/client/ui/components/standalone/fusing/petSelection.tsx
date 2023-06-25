// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EGGS } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { ZoneNames } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { Pet, PetsState } from "shared/rodux/pets";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";

interface PetSelectionProps extends PetSelectionMappedProps {
	variant: Exclude<Variants, "regular">;
	returnToSelection: () => void;
	setPetSelected: (petId: number) => void;
	selectedZone: ZoneNames | "Exclusive";
}

interface PetSelectionMappedProps {
	pets: PetsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PetSelectionMappedProps {
	return {
		pets: state.pets,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const PetSelection = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetSelectionProps, hooks) => {
		const { useValue, useEffect } = hooks;

		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative pet level ui.");

			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		});

		const petsSelection: Array<Pet> = [];
		props.pets.forEach((petData) => {
			const alreadyCached = petsSelection.find((pet) => pet.id === petData.id);
			if (alreadyCached !== undefined) {
				return;
			}

			const eggName = getEggNameFromPetId(petData.id);
			const eggData = EGGS[eggName];
			const variantToDisplay = props.variant === "radiant" ? "void" : props.variant === "void" ? "regular" : "regular";

			if (props.selectedZone === "Exclusive" && eggData.world === "Limited" && !eggData.hidden) {
				if (petData.variant !== variantToDisplay) {
					return;
				}

				petsSelection.push(petData);
				return;
			}

			if (eggData.zone !== props.selectedZone || petData.variant !== variantToDisplay) {
				return;
			}

			petsSelection.push(petData);
		});

		const minimizedSize = 0.07;
		const maximizedSize = 0.08;

		return (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.225),
						Size: UDim2.fromScale(0.765, 0.1),
						Text: "Select a pet that you own to begin fusing",
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.012, 0.104),
						Image: assetIds.images.ui.index.returnToSelection,
					}}
					size={{
						minSize: minimizedSize,
						maxSize: maximizedSize,
					}}
					events={{
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MinorEngagement);
							props.returnToSelection();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</SpringImageButton>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
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
										playSFX(UIEngagement.MajorEngagement);
										props.setPetSelected(petData.id);
									}}
								/>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}),
);
