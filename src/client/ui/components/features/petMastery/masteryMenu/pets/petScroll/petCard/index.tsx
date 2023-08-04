import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { Notification } from "client/ui/elements/common/notification";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import { PET_MASTERY_REQUIREMENTS } from "shared/configs/petMastery";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";

interface IndexPetCardProps extends IndexPetCardMappedProps {
	pet: number;
	currentPet: number | undefined;
	currentVariant: Variants | undefined;
	displayPet: (pet: number | undefined) => void;
}

interface IndexPetCardMappedProps {
	index: PlayerIndexState;
	petMastery: PetMasteryState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): IndexPetCardMappedProps {
	return {
		index: state.index,
		petMastery: state.petMastery,
	};
}

/**
 * A button allowing the player to view information about a specific pet.
 */
export const IndexPetCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexPetCardProps, hooks) => {
		const petData = getPetData(props.pet);

		const petIndex = props.index.pets.get(props.pet);
		const isDiscovered = petIndex !== undefined;

		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		let unseenChallenges = 0;
		if (isDiscovered && props.currentVariant !== undefined) {
			const petMasteryPet = props.petMastery.get(petData.id);

			if (props.currentVariant === "radiant") {
				if (petIndex.fused.radiant >= PET_MASTERY_REQUIREMENTS[petData.rarity].radiant.fuse) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.radiant.fuseClaimed) {
						unseenChallenges++;
					}
				}

				if (petIndex.maxLevel.radiant.amount >= PET_MASTERY_REQUIREMENTS[petData.rarity].radiant.maxLevel) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.radiant.maxLevelClaimed) {
						unseenChallenges++;
					}
				}
			} else if (props.currentVariant === "void") {
				if (petIndex.fused.void >= PET_MASTERY_REQUIREMENTS[petData.rarity].void.fuse) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.void.fuseClaimed) {
						unseenChallenges++;
					}
				}

				if (petIndex.maxLevel.void.amount >= PET_MASTERY_REQUIREMENTS[petData.rarity].void.maxLevel) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.void.maxLevelClaimed) {
						unseenChallenges++;
					}
				}

				if (petIndex.hatched.void >= PET_MASTERY_REQUIREMENTS[petData.rarity].void.hatch) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.void.hatchClaimed) {
						unseenChallenges++;
					}
				}
			} else if (props.currentVariant === "regular") {
				if (petIndex.hatched.regular >= PET_MASTERY_REQUIREMENTS[petData.rarity].regular.hatch) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.regular.hatchClaimed) {
						unseenChallenges++;
					}
				}

				if (petIndex.maxLevel.regular.amount >= PET_MASTERY_REQUIREMENTS[petData.rarity].regular.maxLevel) {
					if (petMasteryPet === undefined) {
						unseenChallenges++;
					} else if (!petMasteryPet.regular.maxLevelClaimed) {
						unseenChallenges++;
					}
				}
			}
		}

		return (
			<BaseFrame BackgroundTransparency={1} LayoutOrder={petData.id}>
				<uiaspectratioconstraint AspectRatio={4.5} />
				<ImageButton
					native={{
						Position: UDim2.fromScale(0.53, 0.525),
						Size: UDim2.fromScale(0.825, 0.95),
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						LayoutOrder: petData.id,
						Image: "",
					}}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.currentPet !== undefined && props.currentPet === props.pet) {
								props.displayPet(undefined);
								return;
							}

							props.displayPet(props.pet);
						},
						MouseEnter: (): void => motor.setGoal(raisedSpring),
						MouseLeave: (): void => motor.setGoal(normalSpring),
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
					<uiaspectratioconstraint AspectRatio={4.5} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.575, 0.5),
							Size: UDim2.fromScale(0.7, 0.9),
							Text: isDiscovered ? petData.name : `???`,
						}}
						stroke={{ native: { Thickness: 3 } }}
					>
						<RarityGradient Rarity={petData.rarity} />
					</StrokeTextLabel>

					<BaseFrame
						BackgroundTransparency={0}
						Position={UDim2.fromScale(0, 0.5)}
						Size={UDim2.fromScale(0.4, 1.2)}
						BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

						<ImageLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.9),
								Position: binding.map((value) => UDim2.fromScale(0.5, value)),
								Image: getPetImage(props.pet, props.currentVariant ?? "regular"),
								ImageColor3: isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0),
							}}
						/>
					</BaseFrame>

					{unseenChallenges > 0 && (
						<Notification
							amount={unseenChallenges}
							position={UDim2.fromScale(0.95, 0)}
							size={UDim2.fromScale(0.55, 0.55)}
						/>
					)}
				</ImageButton>
			</BaseFrame>
		);
	}),
);
