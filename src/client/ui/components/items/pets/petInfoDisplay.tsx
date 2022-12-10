import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { ExitButton } from "client/ui/elements/exitButton";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RARITIES } from "shared/configs/rarities";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";
import { Pet, PetsState } from "shared/rodux/pets";
import { getMaxPetEquip } from "shared/util/getMaxPetEquip";
import { getPetData } from "shared/util/getPetData";
import { getPetLevel } from "shared/util/getPetLevel";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * A decal of the pet being viewed in the pet info display.
 */
/* eslint-disable jsdoc/require-jsdoc */
const PetView = hooks((props: { storedPet: Pet }, hooks) => {
	const raisedPosition = 0.4;
	const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

	const normalPosition = 0.5;
	const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, normalPosition);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.5, 0.165)}
			Size={UDim2.fromScale(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			Image={""}
			Event={{
				Activated: (): void => playSFX(UIEngagement.MinorEngagement),
				MouseEnter: (): void => motor.setGoal(raisedSpring),
				MouseLeave: (): void => motor.setGoal(normalSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<uicorner CornerRadius={new UDim(1, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={binding.map((value) => {
					return UDim2.fromScale(0.5, value);
				})}
				Image={getPetImage(props.storedPet.id, props.storedPet.variant)}
				ScaleType={Enum.ScaleType.Fit}
				ImageColor3={Color3.fromRGB(255, 255, 255)}
			/>
		</imagebutton>
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
/* eslint-disable jsdoc/require-jsdoc */
const EquipPet = RoactRodux.connect(mapStateToProps)(
	hooks((props: EquipPetProps, hooks) => {
		const maxSize = 0.5;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.425;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		const { useContext } = hooks;
		const { equipPets } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.825)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={assetIds.images.ui["weapon shop"]["purchase button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						const maxPetsEquipped = getMaxPetEquip(props.gamepassesState);
						const equippedPets = props.pets.filter((pet) => pet.equipped).size();

						if (equippedPets >= maxPetsEquipped) {
							addError(`You have too many pets equipped.`);
							return;
						}

						equipPets.SendToServer([{ guid: props.storedPet.guid, enabled: !props.storedPet.equipped }], false);
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={"Equip"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Locks/Unlocks the pet being viewed.
 */
/* eslint-disable jsdoc/require-jsdoc */
const LockPet = RoactRodux.connect(mapStateToProps)(
	hooks((props: LockPetProps, hooks) => {
		const maxSize = 0.45;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.4;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		const { useContext } = hooks;
		const { lockPets } = useContext(remoteContext);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.265, 0.915)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={assetIds.images.ui["weapon shop"].locked}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.storedPet.locked) {
							props.confirmUnlocking();
						} else lockPets.SendToServer([{ guid: props.storedPet.guid, enabled: true }]);
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={"Lock"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(137, 150, 35) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Deletes the pet being viewed.
 */
/* eslint-disable jsdoc/require-jsdoc */
const DeletePet = RoactRodux.connect(mapStateToProps)(
	hooks((props: DeletePetProps, hooks) => {
		const maxSize = 0.45;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.4;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.735, 0.915)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={assetIds.images.ui["weapon shop"].delete}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.confirmDeletion();
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={"Delete"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Confirms a given action such as unlocking a pet or deleting a pet.
 */
/* eslint-disable jsdoc/require-jsdoc */
const ConfirmAction = RoactRodux.connect(mapStateToProps)(
	hooks((props: { onActivated: () => void }, hooks) => {
		const maxSize = 0.45;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.4;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.735, 0.915)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={assetIds.images.ui["weapon shop"].delete}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.onActivated();
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={"Confirm"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Cancels a given action such as unlocking a pet or deleting a pet.
 */
/* eslint-disable jsdoc/require-jsdoc */
const CancelAction = RoactRodux.connect(mapStateToProps)(
	hooks((props: { onActivated: () => void }, hooks) => {
		const maxSize = 0.45;
		const maxSpring = new Flipper.Spring(maxSize, { frequency: 5 });

		const minSize = 0.4;
		const minSpring = new Flipper.Spring(minSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maxSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.265, 0.915)}
				Size={binding.map((value) => {
					return UDim2.fromScale(value, 0.08);
				})}
				Image={assetIds.images.ui["weapon shop"]["purchase button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.onActivated();
					},
					MouseEnter: (): void => motor.setGoal(minSpring),
					MouseLeave: (): void => motor.setGoal(maxSpring),
				}}
			>
				<uiaspectratioconstraint AspectRatio={3.45} />
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					Font={font}
					Text={"Cancel"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays all the information about a stored pet.
 */
export const PetInfoDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetInfoDisplayProps, hooks) => {
		const { useState, useEffect, useContext } = hooks;
		const [unlockConfirm, setUnlockConfirm] = useState(false);
		const [deleteConfirm, setDeleteConfirm] = useState(false);

		const storedPet = props.pets.find((pet) => pet.guid === props.guid);
		assert(storedPet, `Failed to display pet information for pet with guid: "${props.guid}".`);

		const petData = getPetData(storedPet.id);
		const rarityData = RARITIES[petData.rarity];
		const petLevel = math.floor(getPetLevel(storedPet));

		// equation to get maximum damage is [((damage * variantMultiplier * 2.5) / 30) * pet level] where 2.5 is the maximum damage and 30 is the maximum level
		const variantMultiplier = storedPet.variant === "radiant" ? 3 : storedPet.variant === "void" ? 2 : 1;
		const damage = math.floor(
			petData.stats.additionalDamage + ((petData.stats.additionalDamage * variantMultiplier * 2.5) / 30) * petLevel,
		);

		const maximizedSize = 1.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, minimizedSize);

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
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.1)}
					Position={UDim2.fromScale(0.5, 0.825)}
					Text={"Confirm Unlocking?"}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(137, 150, 35) }} />
				</textlabel>,
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
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.1)}
					Position={UDim2.fromScale(0.5, 0.825)}
					Text={"Confirm Deletion?"}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(141, 32, 42) }} />
				</textlabel>,
				<ConfirmAction
					onActivated={(): void => {
						deletePets.SendToServer([storedPet.guid]);
						setDeleteConfirm(false);
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
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(-0.2, 0.5)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.4, value);
				})}
				Image={assetIds.images.ui.inventory["info sidebar"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={0.56} />

				<PetView storedPet={storedPet} />
				{controlElements}

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.1)}
					Position={UDim2.fromScale(0.5, 0.35)}
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
					<RarityGradient Rarity={petData.rarity} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.08)}
					Position={UDim2.fromScale(0.5, 0.45)}
					Text={petData.rarity}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<RarityGradient Rarity={petData.rarity} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.9, 0.09)}
					Position={UDim2.fromScale(0.5, 0.55)}
					Text={`Level: ${petLevel >= 1 ? petLevel : 1}`}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.635, 0.65)}
					Size={UDim2.fromScale(0.45, 0.09)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(230, 64, 64)}
					Text={twoDpAbbreviator.numberToString(damage)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<DamageIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					/>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(105, 0, 0) }} />
				</textlabel>
				<ExitButton
					Position={UDim2.fromScale(0.965, 0.025)}
					minimizedSize={0.125}
					maximizedSize={0.15}
					onClosed={(): void => {
						motor.setGoal(minimizedSpring);
						task.spawn(() => task.delay(0.3, () => props.hideDisplay()));
					}}
				/>
			</imagelabel>
		);
	}),
);
