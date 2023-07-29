import { Workspace } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { checkCanAttack, clearAttackLog } from "server/modules/npcs/npcAttackCache";
import { currentTimeTrials } from "server/modules/timeTrials";
import { WORLDS } from "shared/configs/worlds";
import { UniversalWorldData } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { isNpcCharacter, NpcCharacter } from "shared/remotes/damageNPC";
import { Store } from "shared/rodux";
import { addBans } from "shared/rodux/bans";
import { getPetStrength } from "shared/util/getPetStrength";
import { getTalismanStatEffect } from "shared/util/getTalismanDamage";
import { getWeaponDamage } from "shared/util/getWeaponDamage";

import { runStep } from "../modules/npcs/runStep";
import { NpcWorldState } from "../modules/npcs/worldState";

let npcAttacks: Array<{ player: Player; store: Store; character: NpcCharacter }> = [];
remotes.Server.Get("damageNPC").Connect(
	withPlayerStore((player, store, character, wasTrials) => {
		const canAttack = checkCanAttack(player, character, time());
		if (!canAttack) {
			return;
		}

		if (character === undefined) {
			return;
		}

		if (!isNpcCharacter(character)) {
			return;
		}

		const playercharacter = player.Character;
		if (playercharacter === undefined) {
			return;
		}

		const playerHumanoid = playercharacter.FindFirstChildOfClass("Humanoid");
		if (playerHumanoid === undefined) {
			return;
		}

		const playerRoot = playerHumanoid.RootPart;
		if (playerRoot === undefined) {
			return;
		}

		const npcRoot = character.Humanoid.RootPart;
		if (npcRoot === undefined) {
			return;
		}

		if (wasTrials) {
			const currentTimeTrial = currentTimeTrials.get(player);
			if (currentTimeTrial === undefined) {
				return;
			}

			if (currentTimeTrial.npcs.find((npc) => npc.instance === character) === undefined) {
				return;
			}

			const storeState = store.getState();
			const currentWeaponData = storeState.weapons.find((weapon) => weapon.id === storeState.currentWeapon.id);
			if (currentWeaponData === undefined) {
				return;
			}

			const timeTrialDamageMultiplier = storeState.timeTrials["Ban Land"].damage * 0.005;
			const weaponDamage = getWeaponDamage(currentWeaponData);
			const talismanStatEffects = getTalismanStatEffect(
				storeState.currentTalisman,
				storeState.talismans.find((talisman) => talisman.id === storeState.currentTalisman)?.phase,
			);

			const equippedPets = store.getState().pets.filter((pet) => pet.equipped);
			let petDamageBonus = 0;
			let petBansBonus = 0;
			for (const pet of equippedPets) {
				const petStrength = getPetStrength(pet);
				petDamageBonus += petStrength.petDamage;
				petBansBonus += petStrength.petBans;
			}

			const damageAmount = weaponDamage + talismanStatEffects.damage + petDamageBonus;
			character.Humanoid.TakeDamage(damageAmount + damageAmount * timeTrialDamageMultiplier);

			if (character.Humanoid.Health <= 0) {
				currentTimeTrials.set(player, {
					...currentTimeTrial,
					npcs: currentTimeTrial.npcs.filter((npc) => npc.instance !== character),
				});

				store.dispatch(addBans(petBansBonus));

				task.delay(0.5, (): void => {
					clearAttackLog(character);
					character.Destroy();

					const questBans = (player.GetAttribute("petQuestBan") as number) + 1 ?? 0;
					player.SetAttribute("petQuestBan", questBans ?? 0);
				});
			}
		} else {
			const currentState = store.getState();
			for (const [worldName, worldData] of pairs(UniversalWorldData)) {
				for (const [zoneName, zoneData] of pairs(worldData)) {
					const npcData = zoneData.npcs.find((npcData) => npcData.name === character.Name);
					if (npcData === undefined) {
						continue;
					}

					const ownsWorld = currentState.worlds.find((storedWorld) => storedWorld.name === worldName);
					if (ownsWorld === undefined) {
						return;
					}

					const ownsZone = ownsWorld.zones.find((storedZone) => storedZone === zoneName);
					if (ownsZone === undefined) {
						return;
					}
				}
			}

			const npcAttack = {
				player,
				store,
				character,
			};
			npcAttacks.push(npcAttack);
		}
	}),
);

// generate world state
const npcState = [];

for (const [worldName, worldInfo] of pairs(WORLDS)) {
	// create npcs
	const world = Workspace.worlds[worldName];

	const zones: NpcWorldState["zones"] = [];

	const worldState: NpcWorldState = {
		name: worldName,
		zones: zones,
	};
	npcState.push(worldState);

	for (const [zoneName] of pairs(worldInfo.zones)) {
		const zoneFolder = world.zones.FindFirstChild(zoneName);
		assert(zoneFolder, `World ${worldName} did not contain zone ${zoneName}`);

		// get floor to spawn on
		const floor = zoneFolder.FindFirstChild("floor");
		assert(floor, `Failed to get floor for ${zoneFolder.GetFullName()}`);
		assert(floor.IsA("BasePart"), `Found floor "${floor.GetFullName()}" but it was not a BasePart`);

		const { Position: position, Size: size } = floor;
		const halfSize = size.div(2).mul(new Vector3(1, 0, 1));

		const halfHeight = new Vector3(0, size.Y / 2, 0);
		const fiveStuds = new Vector3(0, 10, 0);

		zones.push({
			name: zoneName,
			npcs: [],
			spawn: {
				floor,
				min: position.sub(halfSize).add(halfHeight).add(fiveStuds),
				max: position.add(halfSize).add(halfHeight).add(fiveStuds),
			},
		});
	}
}

// eslint-disable-next-line no-constant-condition
while (true) {
	// run step
	runStep(npcState, npcAttacks, time());
	npcAttacks = [];

	task.wait();
}
