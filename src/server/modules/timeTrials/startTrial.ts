import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage } from "@rbxts/services";
import { retrieveStore } from "server/playerStore";
import {
	TIME_TRIAL_BASE_NPCS,
	TIME_TRIAL_NPCS_REMAINING,
	TIME_TRIAL_TIMER_ATTRIBUTE,
	TIME_TRIAL_WAVE_ATTRIBUTE,
} from "shared/configs/timeTrials";

import { getNpcFolder } from "../npcs/getNpcFolder";
import { lerpPosition } from "../npcs/runStep";
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
	const newNPCs: Array<{ instance: BasePart; lastAttack: number }> = [];
	while (newNPCs.size() < TIME_TRIAL_BASE_NPCS) {
		task.wait(0.5);
		const npc = ReplicatedStorage.assetObjects.npcs.FindFirstChild(playerTrial.selectedNPC) as Model;
		assert(npc !== undefined, "Could not find NPC to spawn for time trial");

		const healthMultiplier =
			playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.28 : 1.3;

		const newNpc = new Instance("Part");
		newNpc.Size = new Vector3(1, 1, 1);
		newNpc.Anchored = true;
		newNpc.CanCollide = false;
		newNpc.Name = playerTrial.selectedNPC;
		newNpc.SetAttribute("MaxHealth", 200 * healthMultiplier ** playerTrial.wave + 1);
		newNpc.SetAttribute("Health", 200 * healthMultiplier ** playerTrial.wave + 1);
		newNpc.Parent = getNpcFolder();

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
		newNpc.CFrame = new CFrame(randomSpawn.Position);
		newNPCs.push({
			instance: newNpc,
			lastAttack: 0,
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

			const newNPCs: Array<{ instance: BasePart; lastAttack: number }> = [];
			if (currentTrial.npcs.size() === 0) {
				for (let i = 0; i < TIME_TRIAL_BASE_NPCS + math.floor(currentTrial.wave / 5); i++) {
					const npc = ReplicatedStorage.assetObjects.npcs.FindFirstChild(playerTrial.selectedNPC) as Model;
					assert(npc !== undefined, "Could not find NPC to spawn for time trial");

					const healthMultiplier =
						playerTrial.difficulty === "easy" ? 1.25 : playerTrial.difficulty === "medium" ? 1.28 : 1.3;

					const newNpc = new Instance("Part");
					newNpc.Size = new Vector3(1, 1, 1);
					newNpc.Name = playerTrial.selectedNPC;
					newNpc.Anchored = true;
					newNpc.CanCollide = false;
					newNpc.SetAttribute("MaxHealth", 200 * healthMultiplier ** playerTrial.wave + 1);
					newNpc.SetAttribute("Health", 200 * healthMultiplier ** playerTrial.wave + 1);
					newNpc.Parent = getNpcFolder();

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
					newNpc.CFrame = new CFrame(randomSpawn.Position);
					newNpc.Parent = getNpcFolder();
					newNPCs.push({
						instance: newNpc,
						lastAttack: 0,
					});
				}
			}

			player.SetAttribute(TIME_TRIAL_NPCS_REMAINING, newNPCs.size() > 0 ? newNPCs.size() : currentTrial.npcs.size());
			player.SetAttribute(TIME_TRIAL_WAVE_ATTRIBUTE, newNPCs.size() > 0 ? currentTrial.wave + 1 : currentTrial.wave);

			const npcs = newNPCs.size() > 0 ? newNPCs : currentTrial.npcs;
			for (const npc of npcs) {
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

				// Might start handling this on client via remote as well
				if (npc.instance.Position.sub(playerRoot.Position).Magnitude < 5) {
					if (now - npc.lastAttack > 1) {
						const increasedDamageTaken =
							currentTrial.difficulty === "easy" ? 1.05 : currentTrial.difficulty === "medium" ? 1.055 : 1.06;
						const damageTaken = increasedDamageTaken ** currentTrial.wave;

						const reducedDamageMultiplier = store.getState().timeTrials["Ban Land"].damageReduction * 0.005;
						const totalDamage = damageTaken - damageTaken * reducedDamageMultiplier;

						npc.lastAttack = now;
						playerHumanoid.TakeDamage(totalDamage);
					}
				} else {
					lerpPosition(npc.instance, playerRoot.Position, 0.01);
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
