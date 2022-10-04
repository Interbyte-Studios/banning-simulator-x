import Make from "@rbxts/make";
import { SoundService } from "@rbxts/services";

export enum HatchEffect {
	HatchImpact_1 = 9854462642,
	HatchImpact_2 = 9854463496,
	HatchReveal = 9854540368,
}

export enum WeaponSlash {
	Slash1 = 11104013859,
	Slash2 = 11104013822,
	Slash3 = 11104013752,
}

export enum NPCHit {
	Hit1 = 11158275165,
}

/**
 * Plays a specific sound effect.
 *
 * @param soundType The type of sound effect to play.
 * @param sfxVolume The volume of the player's sound effects settings.
 */
export function playSFX(soundType: HatchEffect | WeaponSlash | NPCHit, sfxVolume: number): void {
	const sound = Make("Sound", {
		SoundId: `rbxassetid://${soundType}`,
		Parent: SoundService,
	});

	sound.Play();
	sound.Volume = 0.8 * (sfxVolume / 10);

	const connection = sound.Ended.Connect(() => {
		sound.Parent = undefined;
		sound.Destroy();
		connection.Disconnect();
	});
}
