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
import { CurrenciesState } from "shared/rodux/currencies";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";
import { getEggCost } from "shared/util/getEggCost";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { font, vec2Middle } from "../../../commonValues";
import { PetFrame } from "../../../elements/petFrame";
import { HatchEggButton } from "./hatchEgg";
import { ToggleAutoDeleteButton } from "./toggleAutoDelete";
import { ToggleAutoHatchButton } from "./toggleAutoHatch";
import { TripleHatchEggButton } from "./tripleHatchEgg";

interface EggHudProps extends MappedEggHudProps {
	adornee: BasePart;
	eggName: EggName;
	isVoid: boolean;
	pets: Array<Pet>;
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
	displayAutoDeleteMenu: () => void;
}

interface MappedEggHudProps {
	autoActive: boolean;
	currenciesState: CurrenciesState;
	gamepassesState: GamepassesState;
	petsState: PetsState;
	worldsState: WorldsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): MappedEggHudProps {
	return {
		autoActive: state.settings.gameplay.autoHatch,
		currenciesState: state.currencies,
		gamepassesState: state.gamepasses,
		petsState: state.pets,
		worldsState: state.worlds,
	};
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
/* eslint-disable jsdoc/require-jsdoc */
export const EggHudDisplay = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggHudProps, hooks) => {
		const { useEffect, useState } = hooks;
		const [isVisible, setVisibility] = useState(true);

		const eggCost = getEggCost(props.eggName, props.isVoid);

		const activationDistance = 15;

		useEffect(() => {
			const player = Players.LocalPlayer;

			const connection = RunService.RenderStepped.Connect(() => {
				const character = player.Character;
				if (!character) {
					return;
				}

				const magnitudeToBasePart = getMagnitudeBetweenPlayerAndObject(character, props.adornee);
				if (magnitudeToBasePart === undefined) {
					// character did not exist
					return;
				}

				if (magnitudeToBasePart <= activationDistance) {
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
				<ToggleAutoDeleteButton petsSize={props.pets.size()} displayAutoDeleteMenu={props.displayAutoDeleteMenu} />
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
						<BaseUIStroke Thickness={2.5} />
					</textlabel>
					<frame
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={props.pets.size() <= 6 ? UDim2.fromScale(0.925, 0.85) : UDim2.fromScale(0.925, 0.825)}
						Position={props.pets.size() <= 6 ? UDim2.fromScale(0.5, 0.55) : UDim2.fromScale(0.5, 0.525)}
					>
						<uigridlayout
							CellPadding={UDim2.fromScale(0.025, 0.1)}
							CellSize={props.pets.size() <= 6 ? UDim2.fromScale(0.3, 0.35) : UDim2.fromScale(0.3, 0.225)}
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

							return (
								<PetFrame
									eggName={props.eggName}
									petId={petInfo.id}
									variant={props.isVoid ? "void" : "regular"}
									displayBackground={false}
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
						<BaseUIStroke Thickness={2} />
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
