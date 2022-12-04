import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { PET_MASTERY_REQUIREMENTS, PET_MASTERY_REWARDS } from "shared/configs/petMastery";
import { Variants } from "shared/configs/pets";
import { Rarities } from "shared/configs/rarities";
import { ClaimPetMasteryFailKind } from "shared/remotes/petMastery/claimMastery";
import { StoreState } from "shared/rodux";
import { PetMasteryState } from "shared/rodux/petMastery";
import { PetAttainMethod } from "shared/rodux/pets";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";

interface PetMasteryChallengesProps extends PetMasteryChallengesMappedProps {
	pet: number;
	variant: Variants;
}

interface PetMasteryChallengesMappedProps {
	index: PlayerIndexState;
	petMastery: PetMasteryState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PetMasteryChallengesMappedProps {
	return {
		index: state.index,
		petMastery: state.petMastery,
	};
}

/**
 * Displays a mastery challenge.
 */
/* eslint-disable jsdoc/require-jsdoc */
const MasteryChallengeFrame = hooks(
	(
		props: {
			pet: number;
			rarity: Rarities;
			variant: Variants;
			number: 1 | 2 | 3;
			challengeType: PetAttainMethod;
			requirement: number;
			amount: number;
			progress: number;
			hasBeenClaimed: boolean;
		},
		hooks,
	) => {
		const challengeColor =
			props.challengeType === "hatch"
				? Color3.fromRGB(90, 255, 206)
				: props.challengeType === "maxLevel"
				? Color3.fromRGB(255, 227, 15)
				: Color3.fromRGB(255, 90, 90);

		const challengeStroke =
			props.challengeType === "hatch"
				? Color3.fromRGB(44, 126, 102)
				: props.challengeType === "maxLevel"
				? Color3.fromRGB(120, 101, 71)
				: Color3.fromRGB(152, 54, 54);

		const masteryChallengeName =
			props.challengeType === "hatch"
				? `Hatching Mastery`
				: props.challengeType === "maxLevel"
				? "Max Level Mastery"
				: "Fusing Mastery";

		const masteryDescription =
			props.challengeType === "hatch"
				? `Hatch ${props.requirement} times.`
				: props.challengeType === "maxLevel"
				? `Reach max level ${props.requirement} times.`
				: `Fuse ${props.requirement} times.`;

		const minimizedSize = 0.45;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.5;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const { useContext } = hooks;
		const { claimPetMastery } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		const petMasteryReward = PET_MASTERY_REWARDS[props.rarity][props.variant][props.challengeType];
		const boostRewardTime =
			petMasteryReward === 15 ? "15m" : petMasteryReward === 30 ? "30m" : petMasteryReward === 60 ? "1h" : "2h";

		return (
			<frame
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(1, 0.3)}
				LayoutOrder={props.number}
				BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			>
				<uiaspectratioconstraint AspectRatio={6.3} />
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(9, 95, 148) }} />

				{/* The number index of the mastery challenge. */}
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={challengeColor}
					Position={UDim2.fromScale(0.08, 0.5)}
					Size={UDim2.fromScale(0.175, 1)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.18, 0)} />
					<BaseUIStroke native={{ Thickness: 1.8, Color: challengeStroke }} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Font={font}
						Text={`${props.number}.`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: challengeStroke }} />
					</textlabel>
				</frame>

				{/* The claim button for the mastery. */}
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.9, 0.7)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.2, value);
					})}
					Image={assetIds.images.ui.index.Claim}
					ScaleType={Enum.ScaleType.Fit}
					ImageColor3={!props.hasBeenClaimed ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(149, 149, 149)}
					Visible={!props.hasBeenClaimed}
					Event={{
						Activated: async (): Promise<void> => {
							playSFX(UIEngagement.MajorEngagement);

							if (props.hasBeenClaimed) {
								return;
							}

							// check requirements
							if (props.amount < props.progress) {
								// add error
								return;
							}

							const requestClaimPetMastery = await claimPetMastery.CallServerAsync(
								props.pet,
								props.variant,
								props.challengeType,
							);

							if (requestClaimPetMastery.success) {
								addError("You've claimed mastery of a pet!");
								return;
							} else {
								switch (requestClaimPetMastery.reason) {
									case ClaimPetMasteryFailKind.InternalError: {
										addError("There was an issue while claiming mastery of the pet.");
										return;
									}
									case ClaimPetMasteryFailKind.InvalidMastery: {
										addError("The mastery you tried to claim does not exist for that variant.");
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughFusions: {
										addError("You do not have enough fusions to claim mastery.");
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughHatches: {
										addError("You do not have enough hatches to claim mastery.");
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughMaxLevels: {
										addError("You have not reached max level enough time to claim mastery.");
										return;
									}
									case ClaimPetMasteryFailKind.UndiscoveredPet: {
										addError("You haven't discovered the pet! Please report this to Devs.");
										return;
									}
									case ClaimPetMasteryFailKind.UndiscoveredVariant: {
										addError("You haven't discovered that variant. Please report this to Devs.");
										return;
									}
								}
							}
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
						Font={font}
						Text={`Claim`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.6, Color: Color3.fromRGB(40, 94, 48) }} />
					</textlabel>
				</imagebutton>

				<imagelabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.85, 0.2)}
					Size={UDim2.fromScale(0.2, 0.4)}
					Image={assetIds.images.decals.boosts.luck}
					ScaleType={Enum.ScaleType.Fit}
					ImageColor3={!props.hasBeenClaimed ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(149, 149, 149)}
					Visible={!props.hasBeenClaimed}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.94, 0.2)}
					Size={UDim2.fromScale(0.1, 0.35)}
					Font={font}
					Text={boostRewardTime}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<BaseUIStroke native={{ Thickness: 1.5 }} />
				</textlabel>

				{/* Informs the player that they've claimed the mastery already. */}
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.9, 0.5)}
					Size={UDim2.fromScale(0.175, 0.3)}
					Font={font}
					Text={"Claimed"}
					TextScaled={true}
					Visible={props.hasBeenClaimed}
					TextColor3={Color3.fromRGB(146, 253, 129)}
				>
					<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(40, 94, 48) }} />
				</textlabel>

				{/* The name of the mastery challenge. */}
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.475, 0.2)}
					Size={UDim2.fromScale(0.6, 0.35)}
					Font={font}
					Text={masteryChallengeName}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.6, Color: challengeStroke }} />
				</textlabel>

				{/* The description of the mastery challenge. */}
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.49, 0.515)}
					Size={UDim2.fromScale(0.625, 0.3)}
					Font={font}
					Text={masteryDescription}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.6, Color: challengeStroke }} />
				</textlabel>

				{/* The progress bar indicating how close they are to completing the mastery */}
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(250, 108, 110)}
					Size={UDim2.fromScale(0.625, 0.2)}
					Position={UDim2.fromScale(0.49, 0.825)}
				>
					<uicorner CornerRadius={new UDim(0.6, 0)} />
					<BaseUIStroke native={{ Thickness: 2.4, Color: Color3.fromRGB(163, 70, 72) }} />

					<frame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(130, 245, 166)}
						Size={UDim2.fromScale(props.progress, 1)}
					>
						<uicorner CornerRadius={new UDim(0.4, 0)} />
						<BaseUIStroke native={{ Thickness: 2.4, Color: Color3.fromRGB(44, 126, 102) }} />
					</frame>

					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(1, 1)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Font={font}
						Text={
							props.amount < props.requirement
								? `${props.amount} / ${props.requirement}`
								: `${props.requirement} / ${props.requirement}`
						}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 2 }} />
					</textlabel>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays the mastery challenges for the pet.
 */
export const PetMasteryChallenges = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetMasteryChallengesProps) => {
		const petsIndex = props.index.pets.get(props.pet);
		const petsMasteryIndex = props.petMastery.get(props.pet);

		const petData = getPetData(props.pet);

		const requirements = PET_MASTERY_REQUIREMENTS[petData.rarity][props.variant];

		const challengesToDisplay: Array<Roact.Element> = [];
		if (petsIndex === undefined) {
			return (
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.8, 0.2)}
					Position={UDim2.fromScale(0.5, 0.55)}
					Font={font}
					Text={"You haven't discovered this pet."}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1 }} />
				</textlabel>
			);
		}

		if (props.variant === "regular") {
			let hatchCompleted = false;
			let maxLevelCompleted = false;

			if (petsMasteryIndex !== undefined) {
				hatchCompleted = petsMasteryIndex.regular.hatchClaimed;
				maxLevelCompleted = petsMasteryIndex.regular.maxLevelClaimed;
			}

			if (!hatchCompleted) {
				let hatchProgress = petsIndex.hatched.regular / requirements.hatch;
				if (hatchProgress > 1) {
					hatchProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"hatch"}
						requirement={requirements.hatch}
						amount={petsIndex.hatched.regular}
						progress={hatchProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"hatch"}
						requirement={requirements.hatch}
						amount={petsIndex.hatched.regular}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}

			if (!maxLevelCompleted) {
				let maxLevelProgress = petsIndex.maxLevel.regular / requirements.maxLevel;
				if (maxLevelProgress > 1) {
					maxLevelProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.regular}
						progress={maxLevelProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.regular}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}
		} else if (props.variant === "void") {
			let hatchCompleted = false;
			let maxLevelCompleted = false;
			let fuseCompleted = false;

			if (petsMasteryIndex !== undefined) {
				hatchCompleted = petsMasteryIndex.void.hatchClaimed;
				maxLevelCompleted = petsMasteryIndex.void.maxLevelClaimed;
				fuseCompleted = petsMasteryIndex.void.fuseClaimed;
			}

			if (!hatchCompleted) {
				let hatchProgress = petsIndex.hatched.void / requirements.hatch;
				if (hatchProgress > 1) {
					hatchProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"hatch"}
						requirement={requirements.hatch}
						amount={petsIndex.hatched.void}
						progress={hatchProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"hatch"}
						requirement={requirements.hatch}
						amount={petsIndex.hatched.void}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}

			if (!maxLevelCompleted) {
				let maxLevelProgress = petsIndex.maxLevel.void / requirements.maxLevel;
				if (maxLevelProgress > 1) {
					maxLevelProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.void}
						progress={maxLevelProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.void}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}

			if (!fuseCompleted) {
				let fusedProgress = petsIndex.fused.void / requirements.fuse;
				if (fusedProgress > 1) {
					fusedProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={3}
						challengeType={"fuse"}
						requirement={requirements.fuse}
						amount={petsIndex.fused.void}
						progress={fusedProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={3}
						challengeType={"fuse"}
						requirement={requirements.fuse}
						amount={petsIndex.fused.void}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}
		} else if (props.variant === "radiant") {
			let maxLevelCompleted = false;
			let fuseCompleted = false;

			if (petsMasteryIndex !== undefined) {
				maxLevelCompleted = petsMasteryIndex.radiant.maxLevelClaimed;
				fuseCompleted = petsMasteryIndex.radiant.fuseClaimed;
			}

			if (!maxLevelCompleted) {
				let maxLevelProgress = petsIndex.maxLevel.radiant / requirements.maxLevel;
				if (maxLevelProgress > 1) {
					maxLevelProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.radiant}
						progress={maxLevelProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.radiant}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}

			if (!fuseCompleted) {
				let fusedProgress = petsIndex.fused.radiant / requirements.fuse;
				if (fusedProgress > 1) {
					fusedProgress = 1;
				}

				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"fuse"}
						requirement={requirements.fuse}
						amount={petsIndex.fused.radiant}
						progress={fusedProgress}
						hasBeenClaimed={false}
					/>,
				);
			} else {
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"fuse"}
						requirement={requirements.fuse}
						amount={petsIndex.fused.radiant}
						progress={1}
						hasBeenClaimed={true}
					/>,
				);
			}
		}

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.63)}
				Size={UDim2.fromScale(0.975, 0.65)}
			>
				<uilistlayout
					Padding={new UDim(0.05, 0)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				{challengesToDisplay}
			</frame>
		);
	}),
);
