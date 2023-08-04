import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ReplicatedStorage } from "@rbxts/services";
import { uiDarkStrokeColor, uiHeaderStrokeColor } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { DamageIcon } from "client/ui/elements/icons/damageIcon";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Pet, PET_MAX_LEVELS, Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";
import { twoDpAbbreviator, zeroDecimalAbbreviator } from "shared/util/twoDpAbbreviator";

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
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.7, 0.075),
				Size: UDim2.fromScale(0.5, 0.1),
				Text: props.isDiscovered ? props.pet.name : "???",
			}}
			stroke={{ native: { Thickness: 3 } }}
		>
			<RarityGradient Rarity={props.pet.rarity} />
		</StrokeTextLabel>
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
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.7, 0.19),
				Size: UDim2.fromScale(0.5, 0.1),
				Text: props.isDiscovered ? props.pet.rarity : "???",
			}}
			stroke={{ native: { Thickness: 3 } }}
		>
			<RarityGradient Rarity={props.pet.rarity} />
		</StrokeTextLabel>
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
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.7, 0.3),
				Size: UDim2.fromScale(0.5, 0.1),
				Text: props.variant !== "radiant" ? `${tostring(props.pet.chance)}% Hatch Chance` : `Cannot be hatched.`,
			}}
			stroke={{ native: { Thickness: 1.75, Color: uiDarkStrokeColor } }}
		/>
	);
}

/**
 * Allows the player to show the extra stats of the pet.
 *
 * @param props The properties of the Roact component.
 * @param props.isShowing Whether or not the extra stats are being shown.
 * @param props.showStats A function that shows the extra stats.
 * @returns A Roact component.
 */
export const ShowExtraStats = (props: { isShowing: boolean; showStats: (show: boolean) => void }): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: UDim2.fromScale(1, 0.5),
				Image: props.isShowing ? assetIds.images.ui.index.returnToSelection : assetIds.images.ui.index.showExtraStats,
			}}
			events={{
				/* eslint-disable jsdoc/require-jsdoc */
				Activated: (): void => {
					playSFX(UIEngagement.MajorEngagement);
					props.showStats(!props.isShowing);
				},
				/* eslint-enable jsdoc/require-jsdoc */
			}}
			size={{ minSize: 0.1, maxSize: 0.125 }}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
};

/**
 * @param props The properties of the Roact component.
 * @param props.hatches The amount of times the pet has been hatched.
 * @returns A roact component.
 */
function HatchedCounter(props: { hatches: number | undefined }): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.6),
				Size: UDim2.fromScale(0.9, 0.18),
				Text:
					props.hatches !== undefined ? `Hatches: ${twoDpAbbreviator.numberToString(props.hatches)}` : "Hatches: N/A",
				TextXAlignment: Enum.TextXAlignment.Left,
			}}
			stroke={{ native: { Thickness: 1.75, Color: uiDarkStrokeColor } }}
		/>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.fuses The amount of times the pet has been fused.
 * @returns A roact component.
 */
function FuseCounter(props: { fuses: number | undefined }): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.8),
				Size: UDim2.fromScale(0.9, 0.18),
				Text: props.fuses !== undefined ? `Fuses: ${twoDpAbbreviator.numberToString(props.fuses)}` : "Fuses: N/A",
				TextXAlignment: Enum.TextXAlignment.Left,
			}}
			stroke={{ native: { Thickness: 1.75, Color: uiDarkStrokeColor } }}
		/>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.maxLevels The amount of times the pet has been level to the max.
 * @returns A roact component.
 */
function MaxLevelsCounter(props: { maxLevels: number }): Roact.Element {
	return (
		<StrokeTextLabel
			native={{
				Position: UDim2.fromScale(0.5, 0.4),
				Size: UDim2.fromScale(0.9, 0.18),
				Text:
					props.maxLevels !== undefined
						? `Max Levels: ${twoDpAbbreviator.numberToString(props.maxLevels)}`
						: "Max Levels: N/A",
				TextXAlignment: Enum.TextXAlignment.Left,
			}}
			stroke={{ native: { Thickness: 1.75, Color: uiDarkStrokeColor } }}
		/>
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
		const petsIndex = props.index.pets.get(props.pet);

		let hatches = 0;
		let fuses = 0;
		let maxLevels = 0;
		if (petsIndex !== undefined) {
			switch (props.variant) {
				case "regular": {
					hatches = petsIndex.hatched.regular;
					maxLevels = petsIndex.maxLevel.regular.amount;

					break;
				}
				case "void": {
					hatches = petsIndex.hatched.void;
					fuses = petsIndex.fused.void;
					maxLevels = petsIndex.maxLevel.void.amount;

					break;
				}
				case "radiant": {
					fuses = petsIndex.fused.radiant;
					maxLevels = petsIndex.maxLevel.radiant.amount;
				}
			}
		}
		warn(`Pet: ${props.pet} Variant: ${props.variant} Hatches: ${hatches}`);

		return (
			<ImageLabel
				native={{
					Position: UDim2.fromScale(1.5, 0.5),
					Size: UDim2.fromScale(0.8, 0.6),
					Image: assetIds.images.ui.index.extra,
				}}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.115),
						Size: UDim2.fromScale(0.55, 0.175),
						Text: `Index`,
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiHeaderStrokeColor } }}
				/>

				<uiaspectratioconstraint AspectRatio={1.065} />

				<HatchedCounter hatches={props.variant !== "radiant" ? hatches : undefined} />
				<FuseCounter fuses={props.variant !== "regular" ? fuses : undefined} />
				<MaxLevelsCounter maxLevels={maxLevels} />
			</ImageLabel>
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

	const variantMultiplier = props.variant === "radiant" ? 3 : props.variant === "void" ? 2 : 1;
	const strengthPerLevel = (props.pet.stats.additionalDamage * variantMultiplier) / maxLevel;
	const bansPetLevel = (props.pet.stats.additionalBans * variantMultiplier) / maxLevel;

	const petDamage = math.floor(props.pet.stats.additionalDamage * variantMultiplier + maxLevel * strengthPerLevel);
	const petBans = math.floor(props.pet.stats.additionalBans * variantMultiplier + maxLevel * bansPetLevel);

	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.225, 0.475),
					Size: UDim2.fromScale(0.4, 0.1),
					Text: `Level 1:`,
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.6, 0.475),
					Size: UDim2.fromScale(0.18, 0.1),
					TextColor3: Color3.fromRGB(230, 64, 64),
					Text: zeroDecimalAbbreviator.numberToString(props.pet.stats.additionalDamage * variantMultiplier),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(126, 24, 75) } }}
			>
				<DamageIcon
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(-0.575, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				/>
			</StrokeTextLabel>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.875, 0.475),
					Size: UDim2.fromScale(0.18, 0.1),
					TextColor3: Color3.fromRGB(230, 64, 64),
					Text: zeroDecimalAbbreviator.numberToString(props.pet.stats.additionalBans * variantMultiplier),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(126, 24, 75) } }}
			>
				<ImageLabel
					native={{
						AnchorPoint: new Vector2(-0.5, 0.5),
						Image: assetIds.images.vectors.Hammer,
						Size: UDim2.fromScale(1, 1),
						Position: UDim2.fromScale(-0.85, 0.5),
					}}
				/>
			</StrokeTextLabel>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.225, 0.625),
					Size: UDim2.fromScale(0.4, 0.1),
					Text: `Level ${maxLevel}:`,
				}}
				stroke={{ native: { Thickness: 1.5, Color: uiDarkStrokeColor } }}
			/>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.6, 0.625),
					Size: UDim2.fromScale(0.18, 0.1),
					TextColor3: Color3.fromRGB(230, 64, 64),
					Text: zeroDecimalAbbreviator.numberToString(petDamage),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(126, 24, 75) } }}
			>
				<DamageIcon
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(-0.575, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				/>
			</StrokeTextLabel>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.875, 0.625),
					Size: UDim2.fromScale(0.18, 0.1),
					TextColor3: Color3.fromRGB(230, 64, 64),
					Text: zeroDecimalAbbreviator.numberToString(petBans),
					TextXAlignment: Enum.TextXAlignment.Left,
				}}
				stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(126, 24, 75) } }}
			>
				<ImageLabel
					native={{
						AnchorPoint: new Vector2(0, 0.5),
						Image: assetIds.images.vectors.Hammer,
						Size: UDim2.fromScale(1, 1),
						Position: UDim2.fromScale(-0.85, 0.5),
					}}
				/>
			</StrokeTextLabel>
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
	const existElement: Array<Roact.Element> = [];

	const existAmount = ReplicatedStorage.PetExistStores.FindFirstChild(props.pet);
	if (existAmount !== undefined) {
		const variantAmount = existAmount.FindFirstChild(props.variant) as IntValue;
		if (variantAmount !== undefined) {
			existElement.push(
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.7, 0.375),
						Size: UDim2.fromScale(0.5, 0.07),
						TextColor3: Color3.fromRGB(255, 170, 255),
						Text: `⭐ ${twoDpAbbreviator.numberToString(variantAmount.Value)} Exist`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(111, 74, 111) } }}
				/>,
			);
		}
	}

	return (
		<>
			<PetName pet={petData} isDiscovered={props.isDiscovered} />
			<PetRarity pet={petData} isDiscovered={props.isDiscovered} />
			<HatchChance pet={petData} variant={props.variant} />
			<ExtraStats pet={props.pet} variant={props.variant} />
			<MinAndMaxStats pet={petData} variant={props.variant} />

			{existElement}
		</>
	);
}
