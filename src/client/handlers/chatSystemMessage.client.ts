import { StarterGui } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { getPetData } from "shared/util/getPetData";

const hatchSystemMessage = remotes.Client.GetNamespace("eggs").Get("hatchEggSystemMessage");
hatchSystemMessage.Connect((playerWhoHatched, petId, petVariant, hatchedOrFused) => {
	const petData = getPetData(petId);

	let Color: Color3;
	if (petData.rarity === "Legendary") {
		Color = Color3.fromRGB(255, 198, 82);
	} else if (petData.rarity === "Secret") {
		Color = Color3.fromRGB(53, 255, 8);
	} else if (petData.rarity === "Primordial") {
		Color = Color3.fromRGB(255, 0, 255);
	} else {
		Color = Color3.fromRGB(255, 255, 255);
	}

	StarterGui.SetCore("ChatMakeSystemMessage", {
		Text: `[SYSTEM] ${playerWhoHatched.Name} ${hatchedOrFused} a ${petVariant} ${petData.rarity} ${petData.name}!`,
		Color: Color,
	});
});
