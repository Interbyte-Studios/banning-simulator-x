import { GameAnalytics } from "@rbxts/gameanalytics";
import Make from "@rbxts/make";
import { Players, RunService, SoundService } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { WorldName, WORLDS } from "shared/configs/worlds";

const musicQueue: Array<number> = [];

let currentWorld: WorldName | undefined;
let musicEnabled = true;
let volume = 0;

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
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
