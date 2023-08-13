import { GameAnalytics } from "@rbxts/gameanalytics";
import Make from "@rbxts/make";
import { Players, RunService, SoundService } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName, WORLDS } from "shared/configs/worlds";

let musicQueue: Array<number> = [];

let currentWorld: WorldName | undefined;
let musicEnabled = true;
let volume = 0;

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		debug.setmemorycategory("music");
		volume = 0.5 * (store.getState().settings.sound.music * 0.05);

		for (const sound of SoundService.GetChildren()) {
			if (!sound.IsA("Sound")) {
				return;
			}

			sound.Volume = volume;
		}

		store.changed.connect((newState, oldState) => {
			if (newState.settings.sound.music === oldState.settings.sound.music) {
				return;
			}

			volume = 0.5 * (newState.settings.sound.music * 0.05);

			for (const sound of SoundService.GetChildren()) {
				if (!sound.IsA("Sound")) {
					return;
				}

				sound.Volume = volume;
			}
		});
	})
	.catch((e) => {
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ Music Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ Lighting Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});

/**
 * Plays the current playlist.
 */
function loopPlaylist(): void {
	if (!musicEnabled) {
		return;
	}

	for (const musicId of musicQueue) {
		const sound = Make("Sound", {
			SoundId: `rbxassetid://${musicId}`,
			Parent: SoundService,
			Volume: volume,
		});

		sound.Play();
		sound.Ended.Wait();

		sound.Parent = undefined;
		sound.Destroy();
	}

	// Call loopPlaylist again after playing all sounds in the queue
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

	for (const id of worldData.music) {
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
		sound.Destroy();
	}

	musicEnabled = false;
}

let lastCheck = 0;
RunService.RenderStepped.Connect(() => {
	const now = time();
	if (now - lastCheck < 1) return;
	lastCheck = now;

	const world = getCurrentWorld();
	if (world !== currentWorld) {
		stopPlaylist();
		musicEnabled = true;
		musicQueue = [];
		currentWorld = world;

		// Set the playlist and start playing it for the new world
		if (currentWorld !== undefined) {
			setPlaylist(currentWorld);
		}
	}
});
