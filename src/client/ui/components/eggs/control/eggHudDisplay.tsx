import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { PetFrame } from "client/ui/elements/common/petFrame";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Pet, Variants } from "shared/configs/pets";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { StoreState } from "shared/rodux";
import { EggsState } from "shared/rodux/eggs";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { SettingsState } from "shared/rodux/settings";
import { WorldPrestigeState } from "shared/rodux/worldPrestige";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { HatchEggButton } from "./hatchEgg";
import { ToggleAutoHatchButton } from "./toggleAutoHatch";
import { TripleHatchEggButton } from "./tripleHatchEgg";

/**
 * The distance in studs that the player must be near the egg adornee to activate the HUD.
 */
const HUD_ACTIVATION_DISTANCE = 15;

interface EggHudProps extends EggHudMappedProps {
	adornee: BasePart;
	eggName: EggName;
	isVoid: boolean;
	possiblePets: Array<Pet>;
	handleHatch: (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: 1 | 3) => void;
}

interface EggHudMappedProps {
	settings: SettingsState;
	index: PlayerIndexState;
	eggs: EggsState;
	worldPrestige: WorldPrestigeState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggHudMappedProps {
	return {
		settings: state.settings,
		index: state.index,
		eggs: state.eggs,
		worldPrestige: state.worldPrestige,
	};
}

/**
 * Checks if the egg hud should display for a given `character` and `adornee`.
 *
 * @param character The character to check the magnitude for.
 * @param adornee The adornee to determine the distance from.
 * @returns If the egg hud should display.
 */
function shouldDisplayHud(character: Model | undefined, adornee: BasePart): boolean {
	if (!character) {
		return false;
	}

	return (getMagnitudeBetweenPlayerAndObject(character, adornee) ?? math.huge) <= HUD_ACTIVATION_DISTANCE;
}

/**
 * Displays the information of an egg and allows the user to hatch eggs.
 *
 * @param props Properties of the component.
 * @param props.adornee The adornee the component is set to.
 * @param props.eggName The name of the egg being displayed.
 * @param props.isVoid Whether or not the egg is void.
 * @param props.pets The pets that could potentially be hatched from the egg.
 * @param props.initiateHatch A function that allows the player to hatch the egg.
 * @returns A roact element.
 */
export const EggHudDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggHudProps, hooks) => {
		const { useEffect, useState, useContext } = hooks;
		const [isVisible, setVisibility] = useState(shouldDisplayHud(Players.LocalPlayer.Character, props.adornee));

		// autodelete remote
		const { addOrRemoveToAutoDelete } = useContext(remoteContext);

		// find reduced egg cost provided by player mastery
		const eggMasteryReducedMultiplier = getEggsMastery(props.eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(props.eggName, props.isVoid, eggMasteryReducedMultiplier);

		const eggData = getEggData(props.eggName);
		let reducedVoidCost = 0;
		if (eggData.world !== "Limited" && props.isVoid) {
			const worldPrestigeReducer = props.worldPrestige[eggData.world].reducedVoidEggCostUpgrades;
			reducedVoidCost = eggCost.amount * worldPrestigeReducer * WORLD_PRESTIGE.reducedVoidEggCost.reducedCostMultiplier;
		}

		useEffect(() => {
			const player = Players.LocalPlayer;

			const connection = RunService.RenderStepped.Connect(() => {
				debug.profilebegin("eggHudDisplay");
				if (shouldDisplayHud(player.Character, props.adornee)) {
					if (!isVisible) {
						setVisibility(true);
					}
				} else {
					if (isVisible) {
						setVisibility(false);
					}
				}
				debug.profileend();
			});

			return (): void => {
				connection.Disconnect();
			};
		});

		if (!isVisible) {
			return <></>;
		} else {
			return (
				<billboardgui
					Active={true}
					Adornee={props.adornee}
					AlwaysOnTop={true}
					Size={UDim2.fromScale(15, 20)}
					ClipsDescendants={true}
					ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
				>
					<HatchEggButton eggName={props.eggName} isVoid={props.isVoid} handleHatch={props.handleHatch} />
					<TripleHatchEggButton eggName={props.eggName} isVoid={props.isVoid} handleHatch={props.handleHatch} />
					<ToggleAutoHatchButton petsSize={props.possiblePets.size()} />

					<ImageLabel
						native={{
							Size: props.possiblePets.size() <= 6 ? UDim2.fromScale(0.5, 0.3) : UDim2.fromScale(0.5, 0.4),
							Position: props.possiblePets.size() <= 6 ? UDim2.fromScale(0.5, 0.525) : UDim2.fromScale(0.5, 0.485),
							Image: assetIds.images.ui.egg.background,
							ScaleType: Enum.ScaleType.Stretch,
						}}
					>
						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.9, 0.175),
								Position: UDim2.fromScale(0.5, 0),
								Text: `${props.eggName} Egg`,
							}}
							stroke={{ native: { Thickness: 2.5 } }}
						/>

						<BaseFrame
							Size={props.possiblePets.size() <= 6 ? UDim2.fromScale(0.925, 0.85) : UDim2.fromScale(0.925, 0.825)}
							Position={props.possiblePets.size() <= 6 ? UDim2.fromScale(0.5, 0.55) : UDim2.fromScale(0.5, 0.525)}
						>
							<uigridlayout
								CellPadding={
									props.possiblePets.size() <= 6 ? UDim2.fromScale(0.025, 0.1) : UDim2.fromScale(0.025, 0.025)
								}
								CellSize={props.possiblePets.size() <= 6 ? UDim2.fromScale(0.3, 0.35) : UDim2.fromScale(0.3, 0.275)}
								FillDirection={Enum.FillDirection.Horizontal}
								FillDirectionMaxCells={3}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Top}
								SortOrder={Enum.SortOrder.LayoutOrder}
							/>

							{Object.values(props.possiblePets).map((petInfo) => {
								if (petInfo.rarity === "Secret" || petInfo.rarity === "Primordial") {
									return <></>;
								}

								let hasHatchedVariant = false;

								const ownsPetInIndex = props.index.pets.get(petInfo.id);
								if (ownsPetInIndex !== undefined) {
									if (props.isVoid) {
										hasHatchedVariant = ownsPetInIndex.hatched.void > 0;
									} else {
										hasHatchedVariant = ownsPetInIndex.hatched.regular > 0;
									}
								}

								return (
									<PetFrame
										petId={petInfo.id}
										variant={props.isVoid ? "void" : "regular"}
										displayBackground={true}
										isBillboard={true}
										shouldBlackout={!hasHatchedVariant}
										selectedForAutoDelete={props.settings.autoDelete.includes(petInfo.id)}
										onActivated={(): void => {
											playSFX(UIEngagement.MajorEngagement);
											addOrRemoveToAutoDelete.SendToServer(petInfo.id);
										}}
									/>
								);
							})}
						</BaseFrame>

						<StrokeTextLabel
							native={{
								Position: props.possiblePets.size() <= 6 ? UDim2.fromScale(0.65, 0.9) : UDim2.fromScale(0.65, 0.91),
								Size: props.possiblePets.size() <= 6 ? UDim2.fromScale(0.3, 0.15) : UDim2.fromScale(0.3, 0.125),
								Text: twoDpAbbreviator.numberToString(props.isVoid ? eggCost.amount - reducedVoidCost : eggCost.amount),
								TextXAlignment: Enum.TextXAlignment.Left,
							}}
							stroke={{
								native: {
									Thickness: 2.5,
									Color: Color3.fromRGB(255, 255, 255),
								},
								currencyGradient: eggCost.currencyType,
							}}
						>
							<CurrencyIcon
								anchorPoint={new Vector2(1, 0.5)}
								position={UDim2.fromScale(-0.03, 0.5)}
								size={{ minimizedSize: 0.9, maximizedSize: 1 }}
								currency={eggCost.currencyType}
							/>
						</StrokeTextLabel>
					</ImageLabel>
				</billboardgui>
			);
		}
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
