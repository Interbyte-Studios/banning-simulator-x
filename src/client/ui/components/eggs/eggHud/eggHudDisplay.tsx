import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { EggName } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { EggsState } from "shared/rodux/eggs";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";
import { getEggCost } from "shared/util/getEggCost";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { font, vec2Middle } from "../../../commonValues";
import { PetFrame } from "../../../elements/petFrame";
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
	pets: Array<Pet>;
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

interface EggHudMappedProps {
	index: PlayerIndexState;
	eggs: EggsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggHudMappedProps {
	return {
		index: state.index,
		eggs: state.eggs,
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
		const { useEffect, useState } = hooks;
		const [isVisible, setVisibility] = useState(shouldDisplayHud(Players.LocalPlayer.Character, props.adornee));

		// find reduced egg cost provided by player mastery
		const eggMasteryReducedMultiplier = getEggsMastery(props.eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(props.eggName, props.isVoid, eggMasteryReducedMultiplier);

		useEffect(() => {
			const player = Players.LocalPlayer;

			const connection = RunService.RenderStepped.Connect(() => {
				if (shouldDisplayHud(player.Character, props.adornee)) {
					if (!isVisible) {
						setVisibility(true);
					}
				} else {
					if (isVisible) {
						setVisibility(false);
					}
				}
			});

			return (): void => {
				connection.Disconnect();
			};
		});

		if (!isVisible) {
			return <></>;
		}

		return (
			<billboardgui
				Active={true}
				Adornee={props.adornee}
				AlwaysOnTop={true}
				Size={UDim2.fromScale(15, 20)}
				ClipsDescendants={true}
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			>
				<HatchEggButton eggName={props.eggName} isVoid={props.isVoid} initiateHatch={props.initiateHatch} />
				<TripleHatchEggButton eggName={props.eggName} isVoid={props.isVoid} initiateHatch={props.initiateHatch} />
				<ToggleAutoHatchButton petsSize={props.pets.size()} />
				<imagelabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={props.pets.size() <= 6 ? UDim2.fromScale(0.5, 0.3) : UDim2.fromScale(0.5, 0.4)}
					Position={props.pets.size() <= 6 ? UDim2.fromScale(0.5, 0.525) : UDim2.fromScale(0.5, 0.485)}
					Image={assetIds.images.ui.egg.background}
				>
					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.9, 0.175)}
						Position={UDim2.fromScale(0.5, 0)}
						Text={`${props.eggName} Egg`}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2.5 }} />
					</textlabel>
					<frame
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={props.pets.size() <= 6 ? UDim2.fromScale(0.925, 0.85) : UDim2.fromScale(0.925, 0.825)}
						Position={props.pets.size() <= 6 ? UDim2.fromScale(0.5, 0.55) : UDim2.fromScale(0.5, 0.525)}
					>
						<uigridlayout
							CellPadding={props.pets.size() <= 6 ? UDim2.fromScale(0.025, 0.1) : UDim2.fromScale(0.025, 0.025)}
							CellSize={props.pets.size() <= 6 ? UDim2.fromScale(0.3, 0.35) : UDim2.fromScale(0.3, 0.275)}
							FillDirection={Enum.FillDirection.Horizontal}
							FillDirectionMaxCells={3}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Top}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>
						{Object.values(props.pets).map((petInfo) => {
							if (petInfo.rarity === "Prismatic" || petInfo.rarity === "Primordial") {
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
								/>
							);
						})}
					</frame>
					<textlabel
						BackgroundTransparency={1}
						Position={props.pets.size() <= 6 ? UDim2.fromScale(0.425, 0.825) : UDim2.fromScale(0.425, 0.84)}
						Size={props.pets.size() <= 6 ? UDim2.fromScale(0.5, 0.15) : UDim2.fromScale(0.5, 0.115)}
						Text={twoDpAbbreviator.numberToString(eggCost.amount)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2.5 }} />
						<CurrencyIcon
							anchorPoint={new Vector2(1, 0.5)}
							position={UDim2.fromScale(-0.03, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
							currency={eggCost.currencyType}
						/>
					</textlabel>
				</imagelabel>
			</billboardgui>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
