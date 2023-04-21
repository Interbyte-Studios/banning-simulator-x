import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { DamageIcon } from "client/ui/elements/icons/damageIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PET_LEVEL_REQUIREMENTS, PET_MAX_LEVELS } from "shared/configs/pets";
import { RARITIES } from "shared/configs/rarities";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { Pet, PetsState } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";
import { getPetStrength } from "shared/util/getPetStrength";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the pet being viewed in the pet info display.
 */
const PetView = hooks((props: { storedPet: Pet }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<ImageButton
			native={{
				BackgroundTransparency: 0,
				BackgroundColor3: Color3.fromRGB(0, 131, 213),
				Position: UDim2.fromScale(0.5, 0.165),
			}}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				// eslint-disable-next-line jsdoc/require-jsdoc
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.9, 0.9),
					Position: binding.map((value) => UDim2.fromScale(0.5, value)),
					Image: getPetImage(props.storedPet.id, props.storedPet.variant),
				}}
			/>
		</ImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

interface PetInfoDisplayProps extends PetInfoDisplayMappedProps {
	guid: string;
	shouldAnimate: boolean;
	hideDisplay: () => void;
}

interface EquipPetProps extends PetInfoDisplayMappedProps {
	storedPet: Pet;
}

interface LockPetProps extends EquipPetProps, PetInfoDisplayMappedProps {
	confirmUnlocking: () => void;
}

interface DeletePetProps extends EquipPetProps, PetInfoDisplayMappedProps {
	confirmDeletion: () => void;
}

interface PetInfoDisplayMappedProps {
	pets: PetsState;
	gamepassesState: GamepassesState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetInfoDisplayMappedProps {
	return {
		pets: state.pets,
		gamepassesState: state.gamepasses,
	};
}

/**
 * Equips/Unequips the pet being viewed.
 */
const EquipPet = RoactRodux.connect(mapStateToProps)(
	hooks((props: EquipPetProps, hooks) => {
		const { useContext } = hooks;
		const { equipPets } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.5, 0.825),
					Image: assetIds.images.ui["weapon shop"]["purchase button"],
				}}
				size={{ minSize: 0.425, maxSize: 0.5 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.storedPet.equipped) {
							equipPets.SendToServer([{ guid: props.storedPet.guid, enabled: false }], false);
						} else {
							const maxPetsEquipped = getMaxPetEquip(props.gamepassesState);
							const equippedPets = props.pets.filter((pet) => pet.equipped).size();

							if (equippedPets >= maxPetsEquipped) {
								addAnnouncement(`You have too many pets equipped.`, AnnouncementType.Error);
								return;
							}

							equipPets.SendToServer([{ guid: props.storedPet.guid, enabled: true }], false);
						}
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Text: props.storedPet.equipped ? "Unequip" : "Equip",
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) } }}
				/>
			</SpringImageButton>
		);
	}),
);

/**
 * Locks/Unlocks the pet being viewed.
 */
const LockPet = RoactRodux.connect(mapStateToProps)(
	hooks((props: LockPetProps, hooks) => {
		const { useContext } = hooks;
		const { lockPets } = useContext(remoteContext);

		return (
			<SpringImageButton
				native={{
					Position: UDim2.fromScale(0.265, 0.915),
					Image: assetIds.images.ui["weapon shop"].locked,
				}}
				size={{ minSize: 0.4, maxSize: 0.45 }}
				events={{
					// eslint-disable-next-line jsdoc/require-jsdoc
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.storedPet.locked) {
							props.confirmUnlocking();
						} else lockPets.SendToServer([{ guid: props.storedPet.guid, enabled: true }]);
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.95),
						Text: props.storedPet.locked ? "Unlock" : "Lock",
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(137, 150, 35) } }}
				/>
			</SpringImageButton>
		);
	}),
);

/**
 * Deletes the pet being viewed.
 */
const DeletePet = RoactRodux.connect(mapStateToProps)((props: DeletePetProps): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.735, 0.915),
				Image: assetIds.images.ui["weapon shop"].delete,
			}}
			size={{ minSize: 0.4, maxSize: 0.45 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.confirmDeletion();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Delete",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) } }}
			/>
		</SpringImageButton>
	);
});

/**
 * Confirms a given action such as unlocking a pet or deleting a pet.
 */
const ConfirmAction = RoactRodux.connect(mapStateToProps)((props: { onActivated: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.735, 0.915),
				Image: assetIds.images.ui["weapon shop"]["purchase button"],
			}}
			size={{ minSize: 0.4, maxSize: 0.45 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.onActivated();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Confirm",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) } }}
			/>
		</SpringImageButton>
	);
});
/**
 * Cancels a given action such as unlocking a pet or deleting a pet.
 */
const CancelAction = RoactRodux.connect(mapStateToProps)((props: { onActivated: () => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(0.265, 0.915),
				Image: assetIds.images.ui["weapon shop"].delete,
			}}
			size={{ minSize: 0.4, maxSize: 0.45 }}
			events={{
				// eslint-disable-next-line jsdoc/require-jsdoc
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.onActivated();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.45} />
			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(0.95, 0.95),
					Text: "Cancel",
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) } }}
			/>
		</SpringImageButton>
	);
});
/**
 * Displays all the information about a stored pet.
 */
export const PetInfoDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInfoDisplayProps, hooks) => {
		const { useState, useEffect, useContext } = hooks;
		const [unlockConfirm, setUnlockConfirm] = useState(false);
		const [deleteConfirm, setDeleteConfirm] = useState(false);

		const maximizedSize = 1.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

		const storedPet = props.pets.find((pet) => pet.guid === props.guid);
		if (storedPet === undefined) {
			//warn(`Failed to display pet information for pet with guid: "${props.guid}".`);
			return <></>;
		}

		const petData = getPetData(storedPet.id);
		const rarityData = RARITIES[petData.rarity];

		const petLevel = getPetLevel(storedPet);
		const maxPetLevel = PET_MAX_LEVELS[storedPet.variant];
		const currentPetLevel = PET_LEVEL_REQUIREMENTS[storedPet.variant] * petLevel;
		const nextPetLevel = PET_LEVEL_REQUIREMENTS[storedPet.variant] * (petLevel + 1);
		const progressToNextPetLevel =
			petLevel === maxPetLevel ? 1 : (storedPet.bans - currentPetLevel) / (nextPetLevel - currentPetLevel);

		useEffect(() => {
			if (!props.shouldAnimate) {
				return;
			}

			motor.setGoal(maximizedSpring);
		});

		const controlElements: Array<Roact.Element> = [];
		if (unlockConfirm) {
			const { lockPets } = useContext(remoteContext);

			controlElements.push(
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.1),
						Position: UDim2.fromScale(0.5, 0.825),
						Text: "Confirm Unlocking?",
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
				/>,
				<ConfirmAction
					onActivated={(): void => {
						lockPets.SendToServer([{ guid: storedPet.guid, enabled: false }]);
						setUnlockConfirm(false);
					}}
				/>,
				<CancelAction onActivated={(): void => setUnlockConfirm(false)} />,
			);
		} else if (deleteConfirm) {
			const { deletePets } = useContext(remoteContext);

			controlElements.push(
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.1),
						Position: UDim2.fromScale(0.5, 0.825),
						Text: "Confirm Deletion?",
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
				/>,
				<ConfirmAction
					onActivated={(): void => {
						motor.setGoal(minimizedSpring);

						task.delay(0.3, () => {
							props.hideDisplay();
							deletePets.SendToServer([storedPet.guid]);
						});
					}}
				/>,
				<CancelAction onActivated={(): void => setDeleteConfirm(false)} />,
			);
		} else {
			controlElements.push(
				<EquipPet storedPet={storedPet} />,
				<LockPet storedPet={storedPet} confirmUnlocking={(): void => setUnlockConfirm(true)} />,
				<DeletePet storedPet={storedPet} confirmDeletion={(): void => setDeleteConfirm(true)} />,
			);
		}

		return (
			<ImageLabel
				native={{
					Position: UDim2.fromScale(-0.2, 0.5),
					Size: binding.map((value) => UDim2.fromScale(0.4, value)),
					Image: assetIds.images.ui.inventory["info sidebar"],
				}}
			>
				<uiaspectratioconstraint AspectRatio={0.56} />

				<PetView storedPet={storedPet} />
				{controlElements}

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.08),
						Position: UDim2.fromScale(0.5, 0.35),
						Text: petData.name,
						TextColor3:
							petData.rarity === "Epic" ||
							petData.rarity === "Legendary" ||
							petData.rarity === "Primordial" ||
							petData.rarity === "Prismatic"
								? rarityData.BeginningColor
								: Color3.fromRGB(255, 255, 255),
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
				>
					<RarityGradient Rarity={petData.rarity} />
				</StrokeTextLabel>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.07),
						Position: UDim2.fromScale(0.5, 0.425),
						Text: petData.rarity,
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
				>
					<RarityGradient Rarity={petData.rarity} />
				</StrokeTextLabel>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.07),
						Text: `Level: ${petLevel >= 1 ? petLevel : 1}`,
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.675),
						Size: UDim2.fromScale(0.5, 0.08),
						TextColor3: Color3.fromRGB(230, 64, 64),
						Text: twoDpAbbreviator.numberToString(getPetStrength(storedPet)),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) } }}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
				</StrokeTextLabel>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 144, 144)}
					Position={UDim2.fromScale(0.5, 0.575)}
					Size={UDim2.fromScale(0.9, 0.05)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
					<uicorner CornerRadius={new UDim(0.5)} />

					<BaseFrame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(progressToNextPetLevel, 1)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.95),
							Text: petLevel === maxPetLevel ? `Max Level` : `${math.floor(progressToNextPetLevel * 100)}%`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				<ExitButton
					Position={UDim2.fromScale(0.965, 0.025)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => {
						motor.setGoal(minimizedSpring);
						task.spawn(() => task.delay(0.3, () => props.hideDisplay()));
					}}
				/>
			</ImageLabel>
		);
	}),
);
