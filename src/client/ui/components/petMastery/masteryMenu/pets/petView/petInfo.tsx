import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { DamageIcon } from "client/ui/elements/damageIcon";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Pet, PET_MAX_LEVELS, Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface PetData extends Pet {
	name: string;
}

/**
 * @param props The properties of the Roact component.
 * @param props.pet The metadata of the pet.
 * @param props.isDiscovered Whether or not the pets been discovered.
 * @returns A Roact component.
 */
function PetName(props: { pet: PetData; isDiscovered: boolean }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.7, 0.075)}
			Size={UDim2.fromScale(0.5, 0.1)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.isDiscovered ? props.pet.name : "???"}
			Font={font}
		>
			<RarityGradient Rarity={props.pet.rarity} />
			<BaseUIStroke native={{ Thickness: 3 }} />
		</textlabel>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.pet The metadata of the pet.
 * @param props.isDiscovered Whether or not the pets been discovered.
 * @returns A Roact component.
 */
function PetRarity(props: { pet: PetData; isDiscovered: boolean }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.7, 0.19)}
			Size={UDim2.fromScale(0.5, 0.1)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.isDiscovered ? props.pet.rarity : "???"}
			Font={font}
		>
			<RarityGradient Rarity={props.pet.rarity} />
			<BaseUIStroke native={{ Thickness: 3 }} />
		</textlabel>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.pet The metadata of the pet.
 * @param props.variant The variant of the pet.
 * @returns A Roact component.
 */
function HatchChance(props: { pet: PetData; variant: Variants }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.7, 0.3)}
			Size={UDim2.fromScale(0.5, 0.1)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.variant !== "radiant" ? `${tostring(props.pet.chance)}% Hatch Chance` : `Cannot be hatched.`}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 1.75 }} />
		</textlabel>
	);
}

/**
 * Allows the player to show the extra stats of the pet.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ShowExtraStats = hooks((props: { isShowing: boolean; showStats: (show: boolean) => void }, hooks) => {
	const minimizedSize = 0.1;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.125;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(1, 0.5)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.2, value);
			})}
			Image={props.isShowing ? assetIds.images.ui.index.returnToSelection : assetIds.images.ui.index.showExtraStats}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MajorEngagement);
					props.showStats(!props.isShowing);
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 * @param props The properties of the Roact component.
 * @param props.hatches The amount of times the pet has been hatched.
 * @returns A roact component.
 */
function HatchedCounter(props: { hatches: number | undefined }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.6)}
			Size={UDim2.fromScale(0.9, 0.18)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={
				props.hatches !== undefined
					? `Hatches: ${twoDpAbbreviator.numberToString(props.hatches)}`
					: "Hatches: Unavailable"
			}
			TextXAlignment={Enum.TextXAlignment.Left}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 1.75 }} />
		</textlabel>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.fuses The amount of times the pet has been fused.
 * @returns A roact component.
 */
function FuseCounter(props: { fuses: number | undefined }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.8)}
			Size={UDim2.fromScale(0.9, 0.18)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={props.fuses !== undefined ? `Fuses: ${twoDpAbbreviator.numberToString(props.fuses)}` : "Fuses: Unavailable"}
			TextXAlignment={Enum.TextXAlignment.Left}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 1.75 }} />
		</textlabel>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.maxLevels The amount of times the pet has been level to the max.
 * @returns A roact component.
 */
function MaxLevelsCounter(props: { maxLevels: number }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.4)}
			Size={UDim2.fromScale(0.9, 0.18)}
			BackgroundTransparency={1}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Text={
				props.maxLevels !== undefined
					? `Max Levels: ${twoDpAbbreviator.numberToString(props.maxLevels)}`
					: "Max Levels: Unavailable"
			}
			TextXAlignment={Enum.TextXAlignment.Left}
			Font={font}
		>
			<BaseUIStroke native={{ Thickness: 1.75 }} />
		</textlabel>
	);
}

/* Custom props that extend the mapped props for the Index Stats component. */
interface IndexStatsProps extends IndexStatsMappedProps {
	pet: number;
	variant: Variants;
}

/* Props relative to the player's rodux state for the Index Stats of a pet. */
interface IndexStatsMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapIndexStateToIndexStatProps(state: StoreState): IndexStatsMappedProps {
	return {
		index: state.index,
	};
}

/**
 * Displays stats relative to the index of the pet.
 */
const IndexStats = RoactRodux.connect(mapIndexStateToIndexStatProps)(
	hooks((props: IndexStatsProps) => {
		const stringId = tostring(props.pet);
		if (stringId === undefined) {
			throw `Failed to get string id for pet ${props.pet}!`;
		}
		const petsIndex = props.index.pets.get(stringId);

		let hatches = 0;
		let fuses = 0;
		let maxLevels = 0;
		if (petsIndex !== undefined) {
			switch (props.variant) {
				case "regular": {
					hatches = petsIndex.hatched.regular;
					maxLevels = petsIndex.maxLevel.regular;

					break;
				}
				case "void": {
					hatches = petsIndex.hatched.void;
					fuses = petsIndex.fused.void;
					maxLevels = petsIndex.maxLevel.void;

					break;
				}
				case "radiant": {
					fuses = petsIndex.fused.radiant;
					maxLevels = petsIndex.maxLevel.radiant;
				}
			}
		}

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1.5, 0.5)}
				Size={UDim2.fromScale(0.8, 0.6)}
				Image={assetIds.images.ui.index.extra}
				ScaleType={Enum.ScaleType.Fit}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.115)}
					Size={UDim2.fromScale(0.55, 0.175)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={`Index`}
					TextXAlignment={Enum.TextXAlignment.Center}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(148, 94, 15) }} />
				</textlabel>
				<uiaspectratioconstraint AspectRatio={1.065} />
				<HatchedCounter hatches={props.variant !== "radiant" ? hatches : undefined} />
				<FuseCounter fuses={props.variant !== "regular" ? fuses : undefined} />
				<MaxLevelsCounter maxLevels={maxLevels} />
			</imagelabel>
		);
	}),
);

/**
 * Allows the player to show the stats of the pet's index.
 */
const ExtraStats = hooks((props: { pet: number; variant: Variants }, hooks) => {
	const { useState } = hooks;
	const [showingExtraStats, showExtraStats] = useState(false);

	const extraStatsDisplay: Array<Roact.Element> = [];
	if (showingExtraStats) {
		extraStatsDisplay.push(<IndexStats pet={props.pet} variant={props.variant} />);
	}

	return (
		<>
			<ShowExtraStats isShowing={showingExtraStats} showStats={(show: boolean): void => showExtraStats(show)} />
			{extraStatsDisplay}
		</>
	);
});

/**
 * Displays the stats of the pet at minimum and maximum level.
 */
const MinAndMaxStats = hooks((props: { pet: PetData; variant: Variants }) => {
	const maxLevel = PET_MAX_LEVELS[props.variant];

	// equation to get maximum damage is [((damage * variantMultiplier * 2.5) / 30) * pet level] where 2.5 is the maximum damage and 30 is the maximum level
	const variantMultiplier = props.variant === "radiant" ? 3 : props.variant === "void" ? 2 : 1;
	const maximumDamage = props.pet.stats.additionalDamage * variantMultiplier * 2.5;

	return (
		<>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.315, 0.425)}
				Size={UDim2.fromScale(0.4, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={`Level 1:`}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.5 }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.8, 0.425)}
				Size={UDim2.fromScale(0.35, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(230, 64, 64)}
				Text={twoDpAbbreviator.numberToString(props.pet.stats.additionalDamage * variantMultiplier)}
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
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.305, 0.575)}
				Size={UDim2.fromScale(0.4, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={`Level ${maxLevel}:`}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.5 }} />
			</textlabel>
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.8, 0.575)}
				Size={UDim2.fromScale(0.35, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(230, 64, 64)}
				Text={twoDpAbbreviator.numberToString(maximumDamage)}
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
		</>
	);
});

/**
 * @param props The properties of the roact component.
 * @param props.pet The id of the pet.
 * @param props.variant The variant of the pet.
 * @param props.isDiscovered Whether or not the pet is discovered.
 * @returns A Roact component.
 */
export function PetInfoView(props: { pet: number; variant: Variants; isDiscovered: boolean }): Roact.Element {
	const petData = getPetData(props.pet);

	return (
		<>
			<PetName pet={petData} isDiscovered={props.isDiscovered} />
			<PetRarity pet={petData} isDiscovered={props.isDiscovered} />
			<HatchChance pet={petData} variant={props.variant} />
			<ExtraStats pet={props.pet} variant={props.variant} />
			<MinAndMaxStats pet={petData} variant={props.variant} />
		</>
	);
}
