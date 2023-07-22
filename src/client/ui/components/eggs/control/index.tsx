import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, MarketplaceService, Players, Workspace } from "@rbxts/services";
import { animateSingleEggHatch, animateTripleEggHatch } from "client/modules/eggs/hatchEgg";
import { getIsHatching } from "client/modules/eggs/isHatching";
import { getIsTrading } from "client/modules/isTradingCache";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { EggName, EGGS, hatchDebounce } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { Pet, Variants } from "shared/configs/pets";
import { HatchEggFailKind } from "shared/remotes/eggs/hatchEgg";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { EggsState } from "shared/rodux/eggs";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { SettingsState } from "shared/rodux/settings";
import { WorldsState } from "shared/rodux/worlds";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { EggHudDisplay } from "./eggHudDisplay";

/**
 * A log of when the player last hatched.
 */
let lastHatchTime = 0;

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
	};
}

/**
 * Disables auto hatch via a button.
 */
export function disableHatch(): void {
	autoEnabled = false;
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
			async (eggName: EggName, variant: Exclude<Variants, "radiant">, amount: 1 | 3) => {
				if (autoEnabled) {
					return;
				}

				// initial time check
				const now = time();
				const canHatch = now - lastHatchTime > hatchDebounce;
				if (!canHatch) {
					addAnnouncement(
						`You must wait ${statsAbbreviator.numberToString(
							hatchDebounce - (now - lastHatchTime),
						)} seconds before hatching another egg!`,
						AnnouncementType.Error,
					);
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

				// check that user owns world
				const eggData = getEggData(eggName);
				const ownsWorld = props.worlds.find((x) => x.name === eggData.world);
				if (ownsWorld === undefined) {
					addAnnouncement(`You must own the ${eggData.world} world to hatch this egg!`, AnnouncementType.Error);
					return;
				}

				// check that user owns zone
				const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
				if (ownsZone === undefined) {
					addAnnouncement(`You must own the ${eggData.zone} zone to hatch this egg!`, AnnouncementType.Error);
					return;
				}

				// check that character still exists (if it doesn't, neither does the camera)
				const character = Players.LocalPlayer.Character;
				if (character === undefined) {
					addAnnouncement(`Could not find your character. Please rejoin.`, AnnouncementType.Error);
					return;
				}

				// check that user is within distance
				const isWithinDistance = withinDistanceToHatch(character, eggName, variant === "void");
				if (!isWithinDistance) {
					addAnnouncement(`You aren't close enough to hatch that egg!`, AnnouncementType.Error);
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

					task.spawn(async () => {
						while (autoEnabled) {
							// check to be sure they've waited long enough
							const now = time();
							const canHatch = now - lastHatchTime > hatchDebounce;
							if (!canHatch) {
								continue;
							}
							lastHatchTime = now;
							warn(`hatch`);

							// make sure they aren't still hatching
							if (getIsHatching()) {
								continue;
							}

							// make sure they're not trading
							if (getIsTrading()) {
								addAnnouncement(`You cannot hatch while your trading!`, AnnouncementType.Error);
								autoEnabled = false;
								break;
							}

							// check that character still exists (if it doesn't, neither does the camera)
							const character = Players.LocalPlayer.Character;
							if (character === undefined) {
								addAnnouncement(`There was an issue hatching the egg. Try again later. [3]`, AnnouncementType.Error);
								autoEnabled = false;
								break;
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
								break;
							}

							// check inventory space
							if (inventorySize.value + amount > getPetInventorySize(props.gamepasses)) {
								addAnnouncement(`You do not have enough inventory space to hatch the egg!`, AnnouncementType.Error);
								autoEnabled = false;
								break;
							}

							const requestHatch = await hatchEgg.CallServerAsync(amount, eggName, variant === "void");
							if (requestHatch.success) {
								if (requestHatch.pets.size() === 3) {
									animateTripleEggHatch(eggName, variant === "void", requestHatch.pets, props.gamepasses["Fast Hatch"]);
								} else {
									animateSingleEggHatch(
										eggName,
										requestHatch.pets[0].id,
										variant === "void",
										requestHatch.pets[0].autoDeleted,
										props.gamepasses["Fast Hatch"],
									);
								}
							} else {
								if (requestHatch.reason === HatchEggFailKind.NoCharacter) {
									addAnnouncement(
										`You could not hatch because your character could not be found.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NoCurrency) {
									addAnnouncement(
										`You could not hatch because you do not have enough currency.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NoGamepass) {
									addAnnouncement(
										`You could not hatch because you do not own the triple egg gamepass.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NoInventory) {
									addAnnouncement(
										`You could not hatch because you do not have enough inventory space.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NoWorld) {
									addAnnouncement(
										`You could not hatch because you do not own the world required to hatch that egg.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NoZone) {
									addAnnouncement(
										`You could not hatch because you do not own the zone required to hatch that egg.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.NotWithinDistance) {
									addAnnouncement(
										`You could not hatch because you are not close enough to hatch an egg.`,
										AnnouncementType.Error,
									);
								} else if (requestHatch.reason === HatchEggFailKind.TooFast) {
									addAnnouncement(`You could not hatch because you are hatching too fast.`, AnnouncementType.Error);
								} else if (requestHatch.reason === HatchEggFailKind.Trading) {
									addAnnouncement(
										`You could not hatch because you cannot hatch while you are trading.`,
										AnnouncementType.Error,
									);
								} else {
									addAnnouncement(`There was an issue hatching the egg. Try again later. [4]`, AnnouncementType.Error);
								}
							}
						}
					});
				} else {
					lastHatchTime = now;

					const requestHatch = await hatchEgg.CallServerAsync(amount, eggName, variant === "void");
					if (requestHatch.success) {
						if (requestHatch.pets.size() === 3) {
							animateTripleEggHatch(eggName, variant === "void", requestHatch.pets, props.gamepasses["Fast Hatch"]);
						} else {
							animateSingleEggHatch(
								eggName,
								requestHatch.pets[0].id,
								variant === "void",
								requestHatch.pets[0].autoDeleted,
								props.gamepasses["Fast Hatch"],
							);
						}
					} else {
						addAnnouncement(`There was an issue hatching the egg. Try again later. [5]`, AnnouncementType.Error);
					}
				}
			},
			[props.eggs, props.worlds, props.currencies, props.pets, props.settings, props.gamepasses],
		);

		useEffect(() => {
			const player = Players.LocalPlayer;
			const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

			const character = Players.LocalPlayer.Character ?? Players.LocalPlayer.CharacterAdded.Wait()[0];
			if (character === undefined) {
				warn(`Could not find character. Will not be able to unbind AutoHatch from RenderStepped.`);
				return;
			}

			const humanoid = character.WaitForChild("Humanoid") as Humanoid;
			if (humanoid === undefined) {
				warn(`Could not find Humanoid. Will not be able to unbind AutoHatch from RenderStepped.`);
				return;
			}

			let movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
				if (autoEnabled) {
					autoEnabled = false;
				}

				return;
			});

			let diedConnection = humanoid.Died.Connect(() => {
				if (autoEnabled) {
					autoEnabled = false;
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
					if (autoEnabled) {
						autoEnabled = false;
					}

					return;
				});

				diedConnection = humanoid.Died.Connect(() => {
					if (autoEnabled) {
						autoEnabled = false;
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
							} else {
								await handleHatch(eggName, "regular", 1);
							}
							break;
						} else if (eggName !== "Radioactive") {
							const withinDistanceForVoid = withinDistanceToHatch(character, eggName, true);
							if (withinDistanceForVoid) {
								if (autoEnabled) {
									autoEnabled = false;
								} else {
									await handleHatch(eggName, "void", 1);
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
								await handleHatch(eggName, "regular", 3);
							}
							break;
						} else if (eggName !== "Radioactive") {
							const withinDistanceForVoid = withinDistanceToHatch(character, eggName, true);
							if (withinDistanceForVoid) {
								if (autoEnabled) {
									autoEnabled = false;
								} else {
									await handleHatch(eggName, "void", 3);
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
		}, []);

		return (
			<frame Visible={false}>
				{Object.entries(EGGS).map(([eggName, eggData]) => {
					if (!eggData.hatchable) {
						return <></>;
					}
					const eggFolder = Workspace.interactions.eggs[eggName];
					const regularEgg = eggFolder.regular.egg.PrimaryPart;
					const voidEgg = eggFolder.void.egg.PrimaryPart;

					const pets: Array<Pet> = [];
					for (const [, petData] of pairs(eggData.pets)) {
						pets.push(petData);
					}

					return (
						<frame Visible={false}>
							{regularEgg && (
								<EggHudDisplay
									adornee={regularEgg}
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
