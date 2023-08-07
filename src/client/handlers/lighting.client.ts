import { GameAnalytics } from "@rbxts/gameanalytics";
import { Lighting, Players, RunService } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { getCurrentWorld } from "client/util/getCurrentWorld";

const player = Players.LocalPlayer;

const colorCorrection = Lighting.WaitForChild("ColorCorrection") as ColorCorrectionEffect;
const sky = Lighting.WaitForChild("Sky") as Sky;

const cyberAtmosphere = new Instance("Atmosphere");
cyberAtmosphere.Density = 0.288;
cyberAtmosphere.Offset = 1;
cyberAtmosphere.Color = Color3.fromRGB(0, 0, 255);
cyberAtmosphere.Decay = Color3.fromRGB(85, 0, 255);
cyberAtmosphere.Glare = 0.1;
cyberAtmosphere.Haze = 1.6;

onStoreCreated(player)
	.andThen((store) => {
		debug.setmemorycategory("lighting");
		Lighting.ClockTime = store.getState().settings.visual.timeOfDay;

		let lastcheck = 0;
		RunService.RenderStepped.Connect(() => {
			debug.setmemorycategory("cyberLighting");
			const now = time();
			if (now - lastcheck < 1) return;
			lastcheck = now;
			debug.profilebegin("cyberLighting");
			const currentWorld = getCurrentWorld();
			if (currentWorld === "Cyber Cities") {
				Lighting.ClockTime = 14;
				sky.CelestialBodiesShown = true;
				sky.SkyboxBk = "rbxassetid://5084575798";
				sky.SkyboxDn = "rbxassetid://5084575916";
				sky.SkyboxFt = "rbxassetid://5103949679";
				sky.SkyboxLf = "rbxassetid://5103948542";
				sky.SkyboxRt = "rbxassetid://5103948784";
				sky.SkyboxUp = "rbxassetid://5084576400";
				cyberAtmosphere.Parent = Lighting;
				colorCorrection.Saturation = 0.6;
			} else {
				sky.CelestialBodiesShown = false;
				cyberAtmosphere.Parent = undefined;
				sky.SkyboxBk = "rbxassetid://7643700666";
				sky.SkyboxDn = "rbxassetid://7643743687";
				sky.SkyboxFt = "rbxassetid://7644304186";
				sky.SkyboxLf = "rbxassetid://7644288724";
				sky.SkyboxRt = "rbxassetid://7643700819";
				sky.SkyboxUp = "rbxassetid://7643757404";
				colorCorrection.Saturation = 0.4;
				Lighting.ClockTime = store.getState().settings.visual.timeOfDay;
			}

			debug.profileend();
		});

		store.changed.connect((newState, oldState) => {
			if (newState.settings.visual.timeOfDay === oldState.settings.visual.timeOfDay) {
				return;
			}

			Lighting.ClockTime = newState.settings.visual.timeOfDay;
		});
	})
	.catch((e) => {
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ Lighting Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ Lighting Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
