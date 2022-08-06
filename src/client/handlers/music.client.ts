import Make from "@rbxts/make";
import { RunService, SoundService } from "@rbxts/services";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName, WORLDS } from "shared/configs/worlds";

const musicQueue: Array<number> = [];
let currentlyPlaying: Sound | undefined;

/**
 * Plays the current playlist.
 */
function loopPlaylist(): void {
	if (currentlyPlaying) {
		currentlyPlaying.Parent = undefined;
		currentlyPlaying.Destroy();
	}

	for (const musicId of musicQueue) {
		const sound = Make("Sound", {
			SoundId: `rbxassetid://${musicId}`,
			Parent: SoundService,
		});

		sound.Play();
		sound.Ended.Wait();

		sound.Parent = undefined;
		sound.Destroy();
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

let currentWorld: WorldName | undefined;
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
