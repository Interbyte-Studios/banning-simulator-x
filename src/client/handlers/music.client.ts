import Make from "@rbxts/make";
import { Players, RunService, SoundService } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName, WORLDS } from "shared/configs/worlds";

const musicQueue: Array<number> = [];

let currentWorld: WorldName | undefined;
let musicEnabled = true;
let volume = 0.8;

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		volume = 0.8 * (store.getState().settings.sound.music / 10);

		store.changed.connect((newState, oldState) => {
			if (newState.settings.sound.music === oldState.settings.sound.music) {
				return;
			}

			volume = 0.8 * (newState.settings.sound.music / 10);

			for (const sound of SoundService.GetChildren()) {
				if (!sound.IsA("Sound")) {
					return;
				}

				sound.Volume = volume;
			}
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});

/**
 * Plays the current playlist.
 */
function loopPlaylist(): void {
	for (const musicId of musicQueue) {
		if (!musicEnabled) {
			return;
		}

		const sound = Make("Sound", {
			SoundId: `rbxassetid://${musicId}`,
			Parent: SoundService,
		});

		sound.Volume = volume;

		sound.Play();
		sound.Ended.Wait();

		sound.Parent = undefined;
		sound.Destroy();
	}

	if (!musicEnabled) {
		return;
	}

	loopPlaylist();
}

/**
 * Sets the music to play in the current world.
 *
 * @param world The world to play music for.
 */
function setPlaylist(world: WorldName): void {
	const worldData = WORLDS[world];

	musicQueue.clear();

	for (const [, id] of pairs(worldData.music)) {
		musicQueue.push(id);
	}

	loopPlaylist();
}

/**
 * Stops music from playing.
 */
export function stopPlaylist(): void {
	for (const sound of SoundService.GetChildren()) {
		if (!sound.IsA("Sound")) {
			return;
		}

		sound.Stop();
	}

	musicEnabled = false;
}

task.spawn(() => {
	RunService.RenderStepped.Connect(() => {
		const world = getCurrentWorld();
		if (world === undefined) {
			return;
		}

		if (world === currentWorld) {
			return;
		}
		currentWorld = world;

		setPlaylist(world);
	});
});
