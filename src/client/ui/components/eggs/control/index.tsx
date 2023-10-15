import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, MarketplaceService, Players, RunService, Workspace } from "@rbxts/services";
import { getIsHatching } from "client/modules/eggs/isHatching";
import { getIsTrading } from "client/modules/isTradingCache";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { EggName, EGGS, isEventEgg } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { Pet, Variants } from "shared/configs/pets";
import { ValidEggAmount, validEggAmount } from "shared/remotes/eggs/hatchEgg";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { EggsState } from "shared/rodux/eggs";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { RebirthState } from "shared/rodux/rebirths";
import { SettingsState } from "shared/rodux/settings";
import { WorldsState } from "shared/rodux/worlds";
import { getEggCost } from "shared/util/getEggCost";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { EggHudDisplay } from "./eggHudDisplay";

/**
 * Whether or not the player is auto hatching.
 */
let autoEnabled = false;

interface EggHudMappedProps {
	eggs: EggsState;
	worlds: WorldsState;
	currencies: CurrenciesState;
	pets: PetsState;
	gamepasses: GamepassesState;
	settings: SettingsState;
	rebirths: RebirthState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggHudMappedProps {
	return {
		eggs: state.eggs,
		worlds: state.worlds,
		currencies: state.currencies,
		pets: state.pets,
		gamepasses: state.gamepasses,
		settings: state.settings,
		rebirths: state.rebirths,
	};
}

/**
 * Disables auto hatch via a button.
 */
export function disableHatch(): void {
	autoEnabled = false;
	RunService.UnbindFromRenderStep("autoHatchEgg");
}

/**
 * Displays informational and interactable ui components for all eggs in the game.
 *
 * @param props Properties of the component.
 * @param props.initiateHatch A function that allows the player to hatch eggs.
 * @returns A roact element.
 */
export const EggHud = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggHudMappedProps, { useEffect, useCallback, useContext, useValue }) => {
		const { hatchEgg } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		const currencies = useValue(props.currencies);
		const inventorySize = useValue(props.pets.size());

		/**
		 * Checks if the player is trading.
		 *
		 * @param eggName The name of the egg to check.
		 * @param variant The variant of the egg to check.
		 * @param amount The amount of eggs to check.
		 */
		const handleHatch = useCallback(
			async (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: ValidEggAmount) => {
				if (autoEnabled) {
					return;
				}

				// Check that the user isn't already hatching an egg.
				if (getIsHatching()) {
					return;
				}

				// initial trading check
				if (getIsTrading()) {
					addAnnouncement(`You cannot hatch while your trading!`, AnnouncementType.Error);
					return;
				}

				// find reduced egg cost provided by player mastery
				const eggMasteryReducedMultiplier = getEggsMastery(props.eggs).reducedEggCostMultiplier;
				const eggCost = getEggCost(eggName, variant === "void", eggMasteryReducedMultiplier);

				// check cost
				if (currencies.value[eggCost.currencyType] < eggCost.amount * amount) {
					addAnnouncement(
						`You need ${statsAbbreviator.numberToString(
							eggCost.amount * amount - currencies.value[eggCost.currencyType],
						)} more ${eggCost.currencyType} to hatch ${amount} ${eggName} eggs!`,
						AnnouncementType.Error,
					);
					return;
				}

				// check inventory space
				if (inventorySize.value + amount > getPetInventorySize(props.gamepasses)) {
					addAnnouncement(`You do not have enough inventory space to hatch the egg!`, AnnouncementType.Error);
					return;
				}

				if (props.settings.gameplay.autoHatch) {
					autoEnabled = true;
					RunService.BindToRenderStep("autoHatchEgg", Enum.RenderPriority.Camera.Value + 1, () => {
						// make sure they aren't still hatching
						if (getIsHatching()) {
							return;
						}

						if (!autoEnabled) {
							autoEnabled = false;
							RunService.UnbindFromRenderStep("autoHatchEgg");
							return;
						}

						// make sure they're not trading
						if (getIsTrading()) {
							addAnnouncement(`You cannot hatch while your trading!`, AnnouncementType.Error);
							autoEnabled = false;
							RunService.UnbindFromRenderStep("autoHatchEgg");
							return;
						}

						// check that character still exists (if it doesn't, neither does the camera)
						const character = Players.LocalPlayer.Character;
						if (character === undefined) {
							addAnnouncement(`There was an issue hatching the egg. Try again later. [3]`, AnnouncementType.Error);
							autoEnabled = false;
							RunService.UnbindFromRenderStep("autoHatchEgg");
							return;
						}

						// check cost
						if (currencies.value[eggCost.currencyType] < eggCost.amount * amount) {
							addAnnouncement(
								`You need ${statsAbbreviator.numberToString(
									eggCost.amount * amount - currencies.value[eggCost.currencyType],
								)} more ${eggCost.currencyType} to hatch ${amount} ${eggName} eggs!`,
								AnnouncementType.Error,
							);
							autoEnabled = false;
							RunService.UnbindFromRenderStep("autoHatchEgg");
							return;
						}

						// check inventory space
						if (inventorySize.value + amount > getPetInventorySize(props.gamepasses)) {
							addAnnouncement(`You do not have enough inventory space to hatch the egg!`, AnnouncementType.Error);
							autoEnabled = false;
							RunService.UnbindFromRenderStep("autoHatchEgg");
							return;
						}

						hatchEgg.SendToServer(amount, eggName, variant === "void");
					});
				} else {
					hatchEgg.SendToServer(amount, eggName, variant === "void");
				}
			},
			[props.eggs, props.currencies, props.pets, props.settings, props.gamepasses, props.rebirths],
		);

		useEffect(() => {
			const player = Players.LocalPlayer;
			const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

			const character = Players.LocalPlayer.Character ?? Players.LocalPlayer.CharacterAdded.Wait()[0];
			if (character === undefined) {
				return;
			}

			const humanoid = character.WaitForChild("Humanoid") as Humanoid;
			if (humanoid === undefined) {
				return;
			}

			let movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
				if (autoEnabled) {
					autoEnabled = false;
					RunService.UnbindFromRenderStep("autoHatchEgg");
				}

				return;
			});

			let diedConnection = humanoid.Died.Connect(() => {
				if (autoEnabled) {
					autoEnabled = false;
					RunService.UnbindFromRenderStep("autoHatchEgg");
				}

				const camera = Workspace.CurrentCamera;
				if (camera !== undefined && camera.CameraType !== Enum.CameraType.Custom) {
					camera.CameraType = Enum.CameraType.Custom;

					playerGui.GetChildren().forEach((instance) => {
						if (instance.IsA("ScreenGui")) {
							instance.Enabled = true;

							instance.GetDescendants().forEach((descendant) => {
								if (descendant.IsA("BillboardGui")) {
									descendant.Enabled = true;
								}
							});
						}
					});
				}

				return;
			});

			const characterAdded = Players.LocalPlayer.CharacterAdded.Connect(() => {
				movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
					autoEnabled = false;
					RunService.UnbindFromRenderStep("autoHatchEgg");

					return;
				});

				diedConnection = humanoid.Died.Connect(() => {
					if (autoEnabled) {
						autoEnabled = false;
						RunService.UnbindFromRenderStep("autoHatchEgg");
					}

					const camera = Workspace.CurrentCamera;
					if (camera !== undefined && camera.CameraType !== Enum.CameraType.Custom) {
						camera.CameraType = Enum.CameraType.Custom;
					}

					return;
				});
			});

			return (): void => {
				movementConnection.Disconnect();
				diedConnection.Disconnect();
				characterAdded.Disconnect();
			};
		}, []);

		useEffect(() => {
			currencies.value = props.currencies;
			inventorySize.value = props.pets.size();
		}, [props.currencies, props.pets]);

		// handle hiding the hud when animating
		useEffect(() => {
			ContextActionService.BindAction(
				"hatchEgg",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					const character = Players.LocalPlayer.Character;
					if (character === undefined) {
						return;
					}

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					if (humanoid === undefined) {
						return;
					}

					for (const [eggName, eggData] of pairs(EGGS)) {
						if (!eggData.hatchable) {
							continue;
						}

						const withinDistanceForRegular = withinDistanceToHatch(character, eggName, false);
						if (withinDistanceForRegular) {
							if (autoEnabled) {
								autoEnabled = false;
								RunService.UnbindFromRenderStep("autoHatchEgg");
							} else {
								const hatchAmount = 1 + props.rebirths.additionalEggs;
								if (!validEggAmount(hatchAmount)) {
									return warn(`Attempted to hatch invalid amount of eggs: ${hatchAmount}`);
								}

								await handleHatch(eggName, "regular", hatchAmount);
							}
							break;
						} else {
							const withinDistanceForVoid = withinDistanceToHatch(character, eggName, true);
							if (withinDistanceForVoid) {
								if (autoEnabled) {
									autoEnabled = false;
									RunService.UnbindFromRenderStep("autoHatchEgg");
								} else {
									const hatchAmount = 1 + props.rebirths.additionalEggs;
									if (!validEggAmount(hatchAmount)) {
										return warn(`Attempted to hatch invalid amount of eggs: ${hatchAmount}`);
									}

									await handleHatch(eggName, "void", hatchAmount);
								}
								break;
							}
						}
					}
				},
				false,
				Enum.KeyCode.Q,
			);

			ContextActionService.BindAction(
				"hatchEggTriple",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					if (!props.gamepasses["Triple Hatch"]) {
						MarketplaceService.PromptProductPurchase(Players.LocalPlayer, GAMEPASSES["Triple Hatch"]);
						return;
					}

					const character = Players.LocalPlayer.Character;
					if (character === undefined) {
						return;
					}

					const humanoid = character.FindFirstChildOfClass("Humanoid");
					if (humanoid === undefined) {
						return;
					}

					for (const [eggName, eggData] of pairs(EGGS)) {
						if (!eggData.hatchable) {
							continue;
						}

						const withinDistanceForRegular = withinDistanceToHatch(character, eggName, false);
						if (withinDistanceForRegular) {
							if (autoEnabled) {
								autoEnabled = false;
							} else {
								const hatchAmount = 3 + props.rebirths.additionalEggs;
								if (!validEggAmount(hatchAmount)) {
									return warn(`Attempted to hatch invalid amount of eggs: ${hatchAmount}`);
								}
								await handleHatch(eggName, "regular", hatchAmount);
							}
							break;
						} else {
							const withinDistanceForVoid = withinDistanceToHatch(character, eggName, true);
							if (withinDistanceForVoid) {
								if (autoEnabled) {
									autoEnabled = false;
								} else {
									const hatchAmount = 3 + props.rebirths.additionalEggs;
									if (!validEggAmount(hatchAmount)) {
										return warn(`Attempted to hatch invalid amount of eggs: ${hatchAmount}`);
									}
									await handleHatch(eggName, "void", hatchAmount);
								}
								break;
							}
						}
					}
				},
				false,
				Enum.KeyCode.T,
			);

			return (): void => {
				ContextActionService.UnbindAction("hatchEgg");
				ContextActionService.UnbindAction("hatchEggTriple");
			};
		}, [props.settings.gameplay.autoHatch, props.rebirths]);

		return (
			<frame Visible={false}>
				{Object.entries(EGGS).map(([eggName, eggData]) => {
					if (!eggData.hatchable) {
						return <></>;
					}
					const eggFolder = Workspace.interactions.eggs[eggName];
					const regularEgg = eggFolder.FindFirstChild("regular");
					if (regularEgg === undefined) {
						return <></>;
					}

					const eggPrimary = (regularEgg.FindFirstChild("egg") as Model).PrimaryPart;
					if (eggPrimary === undefined) {
						return <></>;
					}

					const pets: Array<Pet> = [];
					for (const pet of eggData.pets) {
						pets.push(pet);
					}

					if (isEventEgg(eggName)) {
						return (
							<frame Visible={false}>
								{regularEgg && (
									<EggHudDisplay
										adornee={eggPrimary}
										eggName={eggName}
										isVoid={false}
										possiblePets={pets}
										handleHatch={handleHatch}
									/>
								)}
							</frame>
						);
					}

					const voidEgg = eggFolder.void.egg.PrimaryPart;

					return (
						<frame Visible={false}>
							{regularEgg && (
								<EggHudDisplay
									adornee={eggPrimary}
									eggName={eggName}
									isVoid={false}
									possiblePets={pets}
									handleHatch={handleHatch}
								/>
							)}
							{voidEgg && (
								<EggHudDisplay
									adornee={voidEgg}
									eggName={eggName}
									isVoid={true}
									possiblePets={pets}
									handleHatch={handleHatch}
								/>
							)}
						</frame>
					);
				})}
			</frame>
		);
	}),
);
