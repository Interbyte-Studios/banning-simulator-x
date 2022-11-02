import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, MarketplaceService, Players, RunService, Workspace } from "@rbxts/services";
import { hooks } from "client/ui/hooks";
import { EggName, EGGS } from "shared/configs/eggs";
import { GAMEPASSES } from "shared/configs/game";
import { Pet } from "shared/configs/pets";
import { StoreState } from "shared/rodux";

import { AnimateEggs } from "../eggHatch/animateEggs";
import { EggHudDisplay } from "./eggHudDisplay";

interface EggHudProps extends EggHudMappedProps {
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>;
}

interface EggHudMappedProps {
	autoActive: boolean;
	ownsTripleHatch: boolean;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): EggHudMappedProps {
	return {
		autoActive: state.settings.gameplay.autoHatch,
		ownsTripleHatch: state.gamepasses["Triple Hatch"],
	};
}

const player = Players.LocalPlayer;

/**
 * Finds the egg closest to the player and makes a request to hatch it.
 *
 * @param amount The amount of eggs to hatch.
 * @param initiateHatch The function to hatch the egg.
 * @param ownsTripleHatch Whether or not the player owns the triple hatch gamepass.
 */
async function hatchClosestEgg(
	amount: 1 | 3,
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>,
	ownsTripleHatch: boolean,
): Promise<void> {
	const character = player.Character;
	if (character === undefined) {
		return;
	}

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return;
	}

	let eggToHatch: EggName | undefined;
	let isVoid = false;
	for (const [name] of pairs(EGGS)) {
		const eggFolder = Workspace.interactions.eggs[name];

		const regularEgg = eggFolder.regular.egg.PrimaryPart;
		assert(regularEgg, `Expected PrimaryPart on egg ${name}`);

		const voidEgg = eggFolder.void.egg.PrimaryPart;
		assert(voidEgg, `Expected PrimaryPart on void egg ${name}`);

		if (humanoidRootPart.Position.sub(regularEgg.Position).Magnitude < 15) {
			eggToHatch = name;
			break;
		}

		if (humanoidRootPart.Position.sub(voidEgg.Position).Magnitude < 15) {
			eggToHatch = name;
			isVoid = true;
			break;
		}
	}

	if (eggToHatch === undefined) {
		return;
	}

	if (amount === 3 && !ownsTripleHatch) {
		MarketplaceService.PromptGamePassPurchase(player, GAMEPASSES["Triple Hatch"]);
		RunService.UnbindFromRenderStep("autoHatchAction");
		return;
	}

	await initiateHatch(amount, eggToHatch, isVoid);
}

/**
 * Manages egg hatching via ContextActionService.
 *
 * @param amount The amount of eggs to hatch.
 * @param initiateHatch The function to hatch the egg.
 * @param autoActive Whether or not auto-hatching is enabled.
 * @param ownsTripleHatch Whether or not the player owns the triple hatch gamepass.
 */
async function manageEggHatch(
	amount: 1 | 3,
	initiateHatch: (amount: 1 | 3, egg: EggName, isVoid: boolean) => Promise<void>,
	autoActive: boolean,
	ownsTripleHatch: boolean,
): Promise<void> {
	if (autoActive) {
		const character = player.Character;
		if (character === undefined) {
			return;
		}

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			return;
		}

		RunService.BindToRenderStep("autoHatchAction", Enum.RenderPriority.Last.Value, async () => {
			if (!AnimateEggs.canHatchEgg()) {
				return;
			}

			const character = player.Character;
			if (character === undefined) {
				RunService.UnbindFromRenderStep("autoHatchAction");
				return;
			}

			const humanoid = character.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				RunService.UnbindFromRenderStep("autoHatchAction");
				return;
			}

			await hatchClosestEgg(amount, initiateHatch, ownsTripleHatch);
		});

		const movementConnection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
			RunService.UnbindFromRenderStep("autoHatchAction");
			movementConnection.Disconnect();
			return;
		});

		const diedConnection = humanoid.Died.Connect(() => {
			RunService.UnbindFromRenderStep("autoHatchAction");
			diedConnection.Disconnect();
			return;
		});
	} else {
		if (!AnimateEggs.canHatchEgg()) {
			return;
		}

		await hatchClosestEgg(amount, initiateHatch, ownsTripleHatch);
	}
}

/**
 * Displays informational and interactable ui components for all eggs in the game.
 *
 * @param props Properties of the component.
 * @param props.initiateHatch A function that allows the player to hatch eggs.
 * @returns A roact element.
 */
export const EggHud = RoactRodux.connect(mapStateToProps)(
	hooks((props: EggHudProps, { useState, useEffect }) => {
		const [isActive, setIsActive] = useState(true);

		// handle hiding the hud when animating
		useEffect(() => {
			ContextActionService.BindAction(
				"hatchEgg",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					await manageEggHatch(1, props.initiateHatch, props.autoActive, false);
				},
				false,
				Enum.KeyCode.E,
			);

			ContextActionService.BindAction(
				"hatchEggTriple",
				async (_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					await manageEggHatch(3, props.initiateHatch, props.autoActive, props.ownsTripleHatch);
				},
				false,
				Enum.KeyCode.T,
			);

			const connection = RunService.Heartbeat.Connect(() => {
				if (
					!AnimateEggs.eggAnimationComplete ||
					!AnimateEggs.petAnimationComplete ||
					AnimateEggs.eggAnimationInitiated ||
					AnimateEggs.petAnimationInitiated
				) {
					if (isActive !== false) {
						setIsActive(false);
					}
				} else {
					if (isActive === false) {
						setIsActive(true);
					}
				}
			});

			return (): void => {
				connection.Disconnect();
				ContextActionService.UnbindAction("hatchEgg");
				ContextActionService.UnbindAction("hatchEggTriple");
			};
		});

		if (!isActive) {
			return <></>;
		}

		return (
			<frame Visible={false}>
				{Object.entries(EGGS).map(([eggName, eggData]) => {
					if (!eggData.hatchable) {
						return <></>;
					}

					const eggFolder = Workspace.interactions.eggs[eggName];

					const regularEgg = eggFolder.regular.egg.PrimaryPart;
					assert(regularEgg, `Expected PrimaryPart for regular ${eggName} egg`);

					const voidEgg = eggFolder.void.egg.PrimaryPart;
					assert(voidEgg, `Expected PrimaryPart for void ${eggName} egg`);

					const pets: Array<Pet> = [];
					for (const [, petData] of pairs(eggData.pets)) {
						pets.push(petData);
					}

					return (
						<frame Visible={false}>
							<EggHudDisplay
								adornee={regularEgg}
								eggName={eggName}
								isVoid={false}
								pets={pets}
								initiateHatch={props.initiateHatch}
							/>
							<EggHudDisplay
								adornee={voidEgg}
								eggName={eggName}
								isVoid={true}
								pets={pets}
								initiateHatch={props.initiateHatch}
							/>
						</frame>
					);
				})}
			</frame>
		);
	}),
);
