import Make from "@rbxts/make";
import { SoundService } from "@rbxts/services";

export enum SoundEffect {
	HatchImpact_1 = 9854462642,
	HatchImpact_2 = 9854463496,
	HatchReveal = 9854540368,
}

/**
 * Plays background music.
 *
 * @param musicId The id of the background music to play.
 */
export function playMusic(musicId: number): void {
	const sound = Make("Sound", {
		SoundId: `rbxassetid://${musicId}`,
		Parent: SoundService,
	});

	sound.Play();
	sound.Ended.Wait();

	const connection = sound.Ended.Connect(() => {
		sound.Parent = undefined;
		sound.Destroy();
		connection.Disconnect();
	});
}

/**
 * Plays a specific sound effect.
 *
 * @param soundType The type of sound effect to play.
 */
export function playEffect(soundType: SoundEffect): void {
	const sound = Make("Sound", {
		SoundId: `rbxassetid://${soundType}`,
		Parent: SoundService,
	});

	sound.Play();

	const connection = sound.Ended.Connect(() => {
		sound.Parent = undefined;
		sound.Destroy();
		connection.Disconnect();
	});
}
