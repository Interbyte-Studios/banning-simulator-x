import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getBoostHumanTime } from "client/util/getBoostHumanTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { isEventEgg, isExclusiveEgg } from "shared/configs/eggs";
import { BOOST_IMAGES } from "shared/configs/game";
import { PET_MASTERY_REQUIREMENTS, PET_MASTERY_REWARDS } from "shared/configs/petMastery";
import { Variants } from "shared/configs/pets";
import { Rarities } from "shared/configs/rarities";
import { ClaimPetMasteryFailKind } from "shared/remotes/petMastery/claimMastery";
import { StoreState } from "shared/rodux";
import { PetMasteryChallengeType, PetMasteryState } from "shared/rodux/petMastery";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

/* eslint-disable jsdoc/require-jsdoc */
const challengeColors: {
	[P in PetMasteryChallengeType]: {
		name: string;
		color: Color3;
		strokeColor: Color3;
		description: (amount: number) => string;
	};
} = {
	hatch: {
		name: "Hatching mastery",
		color: Color3.fromRGB(90, 255, 206),
		strokeColor: Color3.fromRGB(44, 126, 102),
		description: (amount) => `Hatch ${amount} times.`,
	},
	maxLevel: {
		name: "Max Level Mastery",
		color: Color3.fromRGB(255, 227, 15),
		strokeColor: Color3.fromRGB(120, 101, 71),
		description: (amount) => `Reach max level ${amount} times.`,
	},
	fuse: {
		name: "Fusing Mastery",
		color: Color3.fromRGB(255, 90, 90),
		strokeColor: Color3.fromRGB(152, 54, 54),
		description: (amount) => `Fuse ${amount} times.`,
	},
};
/* eslint-enable jsdoc/require-jsdoc */

/**
 * Displays a mastery challenge.
 */
const MasteryChallengeFrame = hooks(
	(
		props: {
			pet: number;
			rarity: Rarities;
			variant: Variants;
			number: 1 | 2 | 3;
			challengeType: PetMasteryChallengeType;
			requirement: number;
			amount: number;
			progress: number;
			hasBeenClaimed: boolean;
		},
		{ useContext },
	) => {
		const { claimPetMastery } = useContext(remoteContext);
		const { addAnnouncement } = useContext(AnnouncementContext);

		const { color: challengeColor, strokeColor, name, description } = challengeColors[props.challengeType];
		const masteryDescription = description(props.requirement);

		const petMasteryReward = PET_MASTERY_REWARDS[props.rarity][props.variant][props.challengeType];
		assert(
			petMasteryReward,
			`Failed to get pet mastery reward for ${props.rarity} ${props.variant} ${props.challengeType}`,
		);

		const boostRewardTime = getBoostHumanTime(petMasteryReward.duration);
		const boostImage = BOOST_IMAGES[petMasteryReward.boost][petMasteryReward.duration];

		return (
			<BaseFrame
				BackgroundTransparency={0}
				Size={UDim2.fromScale(1, 0.3)}
				LayoutOrder={props.number}
				BackgroundColor3={Color3.fromRGB(0, 131, 213)}
			>
				<uiaspectratioconstraint AspectRatio={6.3} />
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(9, 95, 148) }} />

				{/* The number index of the mastery challenge. */}
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={challengeColor}
					Position={UDim2.fromScale(0.08, 0.5)}
					Size={UDim2.fromScale(0.175, 1)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.18, 0)} />
					<BaseUIStroke native={{ Thickness: 1.8, Color: strokeColor }} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: `${props.number}.`,
						}}
						stroke={{ native: { Thickness: 1.5, Color: strokeColor } }}
					/>
				</BaseFrame>

				{/* The claim button for the mastery. */}
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.9, 0.7),
						Image: assetIds.images.ui.index.Claim,
						ImageColor3: !props.hasBeenClaimed ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(149, 149, 149),
						Visible: !props.hasBeenClaimed,
					}}
					size={{ minSize: 0.45, maxSize: 0.5 }}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */
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
								addAnnouncement("You've claimed mastery of a pet!", AnnouncementType.Announcement);
								return;
							} else {
								switch (requestClaimPetMastery.reason) {
									case ClaimPetMasteryFailKind.InternalError: {
										addAnnouncement("There was an issue while claiming mastery of the pet.", AnnouncementType.Error);
										return;
									}
									case ClaimPetMasteryFailKind.InvalidMastery: {
										addAnnouncement(
											"The mastery you tried to claim does not exist for that variant.",
											AnnouncementType.Error,
										);
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughFusions: {
										addAnnouncement("You do not have enough fusions to claim mastery.", AnnouncementType.Error);
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughHatches: {
										addAnnouncement("You do not have enough hatches to claim mastery.", AnnouncementType.Error);
										return;
									}
									case ClaimPetMasteryFailKind.NotEnoughMaxLevels: {
										addAnnouncement(
											"You have not reached max level enough time to claim mastery.",
											AnnouncementType.Error,
										);
										return;
									}
									case ClaimPetMasteryFailKind.UndiscoveredPet: {
										addAnnouncement(
											"You haven't discovered the pet! Please report this to Devs.",
											AnnouncementType.Error,
										);
										return;
									}
									case ClaimPetMasteryFailKind.UndiscoveredVariant: {
										addAnnouncement(
											"You haven't discovered that variant. Please report this to Devs.",
											AnnouncementType.Error,
										);
										return;
									}
								}
							}
						},
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Claim",
						}}
						stroke={{ native: { Thickness: 1.6, Color: Color3.fromRGB(40, 94, 48) } }}
					/>
				</SpringImageButton>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.85, 0.2),
						Size: UDim2.fromScale(0.2, 0.4),
						Image: boostImage,
						ImageColor3: !props.hasBeenClaimed ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(149, 149, 149),
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.94, 0.2),
						Size: UDim2.fromScale(0.1, 0.35),
						Text: boostRewardTime,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 1.5 } }}
				/>

				{/* Informs the player that they've claimed the mastery already. */}
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.9, 0.5),
						Size: UDim2.fromScale(0.175, 0.3),
						Text: "Claimed",
						Visible: props.hasBeenClaimed,
						TextColor3: Color3.fromRGB(146, 253, 129),
					}}
					stroke={{ native: { Thickness: 1, Color: Color3.fromRGB(40, 94, 48) } }}
				/>

				{/* The name of the mastery challenge. */}
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.475, 0.2),
						Size: UDim2.fromScale(0.6, 0.35),
						Text: name,
					}}
					stroke={{ native: { Thickness: 1.6, Color: strokeColor } }}
				/>

				{/* The description of the mastery challenge. */}
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.49, 0.515),
						Size: UDim2.fromScale(0.625, 0.3),
						Text: masteryDescription,
					}}
					stroke={{ native: { Thickness: 1.6, Color: strokeColor } }}
				/>

				{/* The progress bar indicating how close they are to completing the mastery */}
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(250, 108, 110)}
					Size={UDim2.fromScale(0.625, 0.2)}
					Position={UDim2.fromScale(0.49, 0.825)}
				>
					<uicorner CornerRadius={new UDim(0.6, 0)} />
					<BaseUIStroke native={{ Thickness: 2.4, Color: Color3.fromRGB(163, 70, 72) }} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0)}
						Position={UDim2.fromScale(0, 0)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(130, 245, 166)}
						Size={UDim2.fromScale(props.progress, 1)}
					>
						<uicorner CornerRadius={new UDim(0.4, 0)} />
						<BaseUIStroke native={{ Thickness: 2.4, Color: Color3.fromRGB(44, 126, 102) }} />
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Text:
								props.amount < props.requirement
									? `${props.amount} / ${props.requirement}`
									: `${props.requirement} / ${props.requirement}`,
						}}
						stroke={{ native: { Thickness: 2 } }}
					/>
				</BaseFrame>
			</BaseFrame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

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
 * Displays the mastery challenges for the pet.
 */
export const PetMasteryChallenges = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetMasteryChallengesProps) => {
		const petsIndex = props.index.pets.get(props.pet);
		if (petsIndex === undefined) {
			return (
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.8, 0.2),
						Position: UDim2.fromScale(0.5, 0.55),
						Text: "You haven't discovered this pet.",
					}}
					stroke={{ native: { Thickness: 1 } }}
				/>
			);
		}

		const petsMasteryIndex = props.petMastery.get(props.pet);

		const eggName = getEggNameFromPetId(props.pet);
		const petData = getPetData(props.pet);

		const requirements = PET_MASTERY_REQUIREMENTS[petData.rarity][props.variant];
		const challengesToDisplay: Array<Roact.Element> = [];

		switch (props.variant) {
			case "regular": {
				const hatchCompleted = petsMasteryIndex?.regular.hatchClaimed ?? false;
				const maxLevelCompleted = petsMasteryIndex?.regular.maxLevelClaimed ?? false;

				const hatchProgress = math.min(petsIndex.hatched.regular / requirements.hatch, 1); // clamp to 1
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"hatch"}
						requirement={requirements.hatch}
						amount={petsIndex.hatched.regular}
						progress={hatchCompleted ? 1 : hatchProgress}
						hasBeenClaimed={hatchCompleted}
					/>,
				);

				const maxLevelProgress = math.min(petsIndex.maxLevel.regular.cachedMaxLevel.size() / requirements.maxLevel, 1); // clamp to 1
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.regular.cachedMaxLevel.size()}
						progress={maxLevelCompleted ? 1 : maxLevelProgress}
						hasBeenClaimed={maxLevelCompleted}
					/>,
				);

				break;
			}
			case "void": {
				const hatchCompleted = petsMasteryIndex?.void.hatchClaimed ?? false;
				const maxLevelCompleted = petsMasteryIndex?.void.maxLevelClaimed ?? false;
				const fuseCompleted = petsMasteryIndex?.void.fuseClaimed ?? false;

				if (isEventEgg(eggName) || isExclusiveEgg(eggName)) {
					const maxLevelProgress = math.min(petsIndex.maxLevel.void.cachedMaxLevel.size() / requirements.maxLevel, 1);
					challengesToDisplay.push(
						<MasteryChallengeFrame
							pet={props.pet}
							rarity={petData.rarity}
							variant={props.variant}
							number={1}
							challengeType={"maxLevel"}
							requirement={requirements.maxLevel}
							amount={petsIndex.maxLevel.void.cachedMaxLevel.size()}
							progress={maxLevelCompleted ? 1 : maxLevelProgress}
							hasBeenClaimed={maxLevelCompleted}
						/>,
					);

					const fusedProgress = math.min(petsIndex.fused.void / requirements.fuse, 1);
					challengesToDisplay.push(
						<MasteryChallengeFrame
							pet={props.pet}
							rarity={petData.rarity}
							variant={props.variant}
							number={2}
							challengeType={"fuse"}
							requirement={requirements.fuse}
							amount={petsIndex.fused.void}
							progress={fuseCompleted ? 1 : fusedProgress}
							hasBeenClaimed={fuseCompleted}
						/>,
					);
				} else {
					const hatchProgress = math.min(petsIndex.hatched.void / requirements.hatch, 1);
					challengesToDisplay.push(
						<MasteryChallengeFrame
							pet={props.pet}
							rarity={petData.rarity}
							variant={props.variant}
							number={1}
							challengeType={"hatch"}
							requirement={requirements.hatch}
							amount={petsIndex.hatched.void}
							progress={hatchCompleted ? 1 : hatchProgress}
							hasBeenClaimed={hatchCompleted}
						/>,
					);

					const maxLevelProgress = math.min(petsIndex.maxLevel.void.cachedMaxLevel.size() / requirements.maxLevel, 1);
					challengesToDisplay.push(
						<MasteryChallengeFrame
							pet={props.pet}
							rarity={petData.rarity}
							variant={props.variant}
							number={1}
							challengeType={"maxLevel"}
							requirement={requirements.maxLevel}
							amount={petsIndex.maxLevel.void.cachedMaxLevel.size()}
							progress={maxLevelCompleted ? 1 : maxLevelProgress}
							hasBeenClaimed={maxLevelCompleted}
						/>,
					);

					const fusedProgress = math.min(petsIndex.fused.void / requirements.fuse, 1);
					challengesToDisplay.push(
						<MasteryChallengeFrame
							pet={props.pet}
							rarity={petData.rarity}
							variant={props.variant}
							number={2}
							challengeType={"fuse"}
							requirement={requirements.fuse}
							amount={petsIndex.fused.void}
							progress={fuseCompleted ? 1 : fusedProgress}
							hasBeenClaimed={fuseCompleted}
						/>,
					);
				}

				break;
			}
			case "radiant": {
				const maxLevelCompleted = petsMasteryIndex?.radiant.maxLevelClaimed ?? false;
				const fuseCompleted = petsMasteryIndex?.radiant.fuseClaimed ?? false;

				const maxLevelProgress = math.min(petsIndex.maxLevel.radiant.cachedMaxLevel.size() / requirements.maxLevel, 1);
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={1}
						challengeType={"maxLevel"}
						requirement={requirements.maxLevel}
						amount={petsIndex.maxLevel.radiant.cachedMaxLevel.size()}
						progress={maxLevelCompleted ? 1 : maxLevelProgress}
						hasBeenClaimed={maxLevelCompleted}
					/>,
				);

				const fusedProgress = math.min(petsIndex.fused.radiant / requirements.fuse, 1);
				challengesToDisplay.push(
					<MasteryChallengeFrame
						pet={props.pet}
						rarity={petData.rarity}
						variant={props.variant}
						number={2}
						challengeType={"fuse"}
						requirement={requirements.fuse}
						amount={petsIndex.fused.radiant}
						progress={fuseCompleted ? 1 : fusedProgress}
						hasBeenClaimed={fuseCompleted}
					/>,
				);
				break;
			}
			default:
				throw new UnreachableCaseError(props.variant);
		}

		return (
			<BaseFrame Position={UDim2.fromScale(0.5, 0.63)} Size={UDim2.fromScale(0.975, 0.65)}>
				<uilistlayout
					Padding={new UDim(0.05, 0)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
				/>
				{challengesToDisplay}
			</BaseFrame>
		);
	}),
);
