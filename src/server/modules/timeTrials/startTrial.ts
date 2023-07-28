import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage } from "@rbxts/services";
import { retrieveStore } from "server/playerStore";
import {
	TIME_TRIAL_BASE_NPCS,
	TIME_TRIAL_NPCS_PER_WAVE,
	TIME_TRIAL_NPCS_REMAINING,
	TIME_TRIAL_TIMER_ATTRIBUTE,
	TIME_TRIAL_WAVE_ATTRIBUTE,
} from "shared/configs/timeTrials";

import { currentTimeTrials, TimeTrialStatus } from ".";

/**
 * Starts a time trial for a certain player.
 *
 * @param player The player to start the time trial for.
 * @returns A function which is called each step of the game to
 * update the player's progress in the trial. The return result of this handler
 * indicates if the time trial has ran out of time.
 */
export function startTrial(player: Player): {
	cleanupHandler: Janitor;
	stepHandler: (step: number) => boolean;
} {
	const store = retrieveStore(player);

	const playerTrial = currentTimeTrials.get(player);
	assert(
		playerTrial?.status === TimeTrialStatus.WaitingForStart,
		`Attempt to start time trial for ${player}, but their status is ${playerTrial?.status}`,
	);

	// spawn initial NPCs
	const newNPCs: Array<{ instance: Model; lastAttack: number; attackAnim: AnimationTrack }> = [];
	while (newNPCs.size() < TIME_TRIAL_BASE_NPCS) {
		task.wait(0.5);
		const npc = ReplicatedStorage.assetObjects.npcs.FindFirstChild(playerTrial.selectedNPC) as Model;
		assert(npc !== undefined, "Could not find NPC to spawn for time trial");

		const newNpc = npc.Clone();
		const humanoid = newNpc.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			continue;
		}

		const healthMultiplier = playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.3 : 1.4;
		humanoid.MaxHealth = 200 * healthMultiplier ** playerTrial.wave + 1;
		humanoid.Health = humanoid.MaxHealth;

		const root = humanoid.RootPart;
		if (root === undefined) {
			continue;
		}

		const animator = humanoid.FindFirstChildOfClass("Animator");
		if (animator === undefined) {
			continue;
		}

		const spawnSize = playerTrial.npcSpawns.GetChildren().size();
		let randomSpawn: BasePart | undefined;
		for (let i = 0; i < spawnSize; i++) {
			const random = math.random(1, spawnSize);
			const spawn = playerTrial.npcSpawns.GetChildren()[random] as BasePart;
			if (spawn !== undefined) {
				randomSpawn = spawn;
				break;
			}
		}
		if (randomSpawn === undefined) {
			continue;
		}
		root.CFrame = new CFrame(randomSpawn.Position);
		newNpc.Parent = playerTrial.npcFolder;
		const attackAnim = animator.LoadAnimation(ReplicatedStorage.animations.weapons.Sword.Attack);
		newNPCs.push({
			instance: newNpc,
			lastAttack: 0,
			attackAnim: attackAnim,
		});
	}

	// update the status of the time trial
	currentTimeTrials.set(player, {
		...playerTrial,
		status: TimeTrialStatus.Ongoing,
		npcs: newNPCs,
	});

	return {
		cleanupHandler: playerTrial.cleanupHandler,
		/**
		 * A callback which should be fired each time the game steps.
		 *
		 * @param step The amount of time that elapsed since the last step.
		 * @returns If the time trial has completed.
		 */
		stepHandler: (step: number): boolean => {
			const now = time();

			const currentTrial = currentTimeTrials.get(player);
			assert(currentTrial !== undefined, `Attempt to step player ${player}'s trial, but they didn't have one`);

			player.SetAttribute(TIME_TRIAL_TIMER_ATTRIBUTE, currentTrial.timeRemaining - step);

			const newNPCs: Array<{ instance: Model; lastAttack: number; attackAnim: AnimationTrack }> = [];
			if (currentTrial.npcs.size() === 0) {
				for (let i = 0; i < TIME_TRIAL_BASE_NPCS + TIME_TRIAL_NPCS_PER_WAVE * currentTrial.wave; i++) {
					const npc = ReplicatedStorage.assetObjects.npcs.FindFirstChild(currentTrial.selectedNPC) as Model;
					assert(npc !== undefined, `Could not find NPC ${currentTrial.selectedNPC} to spawn for time trial`);

					const newNpc = npc.Clone();
					const humanoid = newNpc.FindFirstChildOfClass("Humanoid");
					if (humanoid === undefined) {
						continue;
					}

					const healthMultiplier =
						playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.3 : 1.4;
					humanoid.MaxHealth = 200 * healthMultiplier ** currentTrial.wave + 1;
					humanoid.Health = humanoid.MaxHealth;

					const root = humanoid.RootPart;
					if (root === undefined) {
						continue;
					}

					const animator = humanoid.FindFirstChildOfClass("Animator");
					if (animator === undefined) {
						continue;
					}

					const randomSpawn = currentTrial.npcSpawns.GetChildren()[
						math.random(1, currentTrial.npcSpawns.GetChildren().size() - 1)
					] as BasePart;
					root.CFrame = new CFrame(randomSpawn.Position);
					newNpc.Parent = currentTrial.npcFolder;

					const attackAnim = animator.LoadAnimation(ReplicatedStorage.animations.weapons.Sword.Attack);
					newNPCs.push({
						instance: newNpc,
						lastAttack: 0,
						attackAnim: attackAnim,
					});
				}
			}

			player.SetAttribute(TIME_TRIAL_NPCS_REMAINING, newNPCs.size() > 0 ? newNPCs.size() : currentTrial.npcs.size());
			player.SetAttribute(TIME_TRIAL_WAVE_ATTRIBUTE, newNPCs.size() > 0 ? currentTrial.wave + 1 : currentTrial.wave);

			const npcs = newNPCs.size() > 0 ? newNPCs : currentTrial.npcs;
			for (const npc of npcs) {
				const humanoid = npc.instance.FindFirstChildOfClass("Humanoid");
				if (humanoid === undefined) {
					continue;
				}

				const npcRoot = humanoid.RootPart;
				if (npcRoot === undefined) {
					continue;
				}

				const playerCharacter = player.Character;
				if (playerCharacter === undefined) {
					continue;
				}

				const playerHumanoid = playerCharacter.FindFirstChild("Humanoid") as Humanoid;
				if (playerHumanoid === undefined) {
					continue;
				}

				const playerRoot = playerHumanoid.RootPart;
				if (playerRoot === undefined) {
					continue;
				}

				if (npcRoot.Position.sub(playerRoot.Position).Magnitude < 5) {
					if (now - npc.lastAttack > 1) {
						const increasedDamageTaken =
							currentTrial.difficulty === "easy" ? 1.05 : currentTrial.difficulty === "medium" ? 1.08 : 1.15;
						const damageTaken = increasedDamageTaken ** currentTrial.wave;

						const reducedDamageMultiplier = store.getState().timeTrials["Ban Land"].damageReduction * 0.005;
						const totalDamage = damageTaken - damageTaken * reducedDamageMultiplier;

						npc.lastAttack = now;
						npc.attackAnim.Play();
						playerHumanoid.TakeDamage(totalDamage);
					}
				} else {
					humanoid.MoveTo(playerRoot.Position);
				}
			}

			currentTimeTrials.set(player, {
				...currentTrial,
				timeRemaining: currentTrial.timeRemaining - step,
				wave: newNPCs.size() > 0 ? currentTrial.wave + 1 : currentTrial.wave,
				npcs: newNPCs.size() > 0 ? newNPCs : currentTrial.npcs,
			});

			// return if we have finished the time trial.
			return currentTrial.timeRemaining - step <= 0;
		},
	};
}
