import Make from "@rbxts/make";
import { Players, SoundService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";

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

export enum NPCImpact {
	NPCImpact1 = 11514630844,
}

export enum UIEngagement {
	MajorEngagement = 11738749109,
	MinorEngagement = 11738749109,
}

/**
 * Plays a specific sound effect.
 *
 * @param soundType The type of sound effect to play.
 */
export function playSFX(soundType: UIEngagement | WeaponSlash | NPCImpact | HatchEffect): void {
	debug.setmemorycategory("playSFX");
	const store = retrieveStore(Players.LocalPlayer);
	if (store === undefined) {
		return;
	}

	if (soundType === UIEngagement.MajorEngagement) {
		if (!store.getState().settings.sound.buttonClick) {
			return;
		}
	}

	if (soundType === UIEngagement.MinorEngagement) {
		if (!store.getState().settings.sound.buttonClick) {
			return;
		}
	}

	const sound = Make("Sound", { SoundId: `rbxassetid://${soundType}`, Parent: SoundService });
	sound.Volume = store.getState().settings.sound.soundEffects * 0.05;
	const [success] = pcall(() => sound.Play());
	if (success) {
		let connection: RBXScriptConnection | undefined = sound.Ended.Connect(() => {
			sound.Parent = undefined;
			sound.Destroy();
			if (connection !== undefined) {
				connection.Disconnect();
				connection = undefined;
			}
		});
	}
}
