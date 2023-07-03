import { PhysicsService, Players, Workspace } from "@rbxts/services";

const npcCollisionGroup = "NPCCollisions";
if (!PhysicsService.IsCollisionGroupRegistered(npcCollisionGroup)) {
	PhysicsService.RegisterCollisionGroup(npcCollisionGroup);
}

const playerCollisionGroup = "PlayerCollisions";
if (!PhysicsService.IsCollisionGroupRegistered(playerCollisionGroup)) {
	PhysicsService.RegisterCollisionGroup(playerCollisionGroup);
}

PhysicsService.CollisionGroupSetCollidable(npcCollisionGroup, npcCollisionGroup, false);
PhysicsService.CollisionGroupSetCollidable(playerCollisionGroup, playerCollisionGroup, false);
PhysicsService.CollisionGroupSetCollidable(npcCollisionGroup, playerCollisionGroup, false);
PhysicsService.CollisionGroupSetCollidable(playerCollisionGroup, npcCollisionGroup, false);

/**
 * A function to register player characters with the physics service.
 *
 * @param character The character to register.
 */
const onCharacterAdded = (character: Model): void => {
	for (const part of character.GetDescendants()) {
		if (!part.IsA("BasePart")) {
			continue;
		}

		part.CollisionGroup = playerCollisionGroup;
	}
};

/**
 * A function to register NPCs with the physics service.
 *
 * @param npc The NPC to register.
 */
const registerNPC = (npc: Model): void => {
	for (const part of npc.GetDescendants()) {
		if (!part.IsA("BasePart")) {
			continue;
		}

		part.CollisionGroup = npcCollisionGroup;
	}
};

Players.PlayerAdded.Connect((player) => {
	player.CharacterAdded.Connect(onCharacterAdded);

	if (player.Character) {
		onCharacterAdded(player.Character);
	}
});

const npcs = Workspace.WaitForChild("npcs");
for (const npc of npcs.GetChildren()) {
	if (!npc.IsA("Model")) {
		continue;
	}

	registerNPC(npc);
}

npcs.ChildAdded.Connect((npc) => {
	if (!npc.IsA("Model")) {
		return;
	}

	registerNPC(npc);
});
