import { RunService, TweenService, Workspace } from "@rbxts/services";
import { EggName, EGGS } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

export {};

interface eggAnimationData {
	cframeValue: CFrameValue;
	egg: Model;
}

const cframeValues: Array<eggAnimationData> = [];
const eggAnimationTweenInfo = new TweenInfo(2, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

/**
 * Animates the specified egg model.
 *
 * @param eggName The name of the egg.
 * @param variant The variant of the egg.
 */
function animateEgg(eggName: EggName, variant: Exclude<Variants, "radiant">): void {
	const eggFolder = Workspace.interactions.eggs[eggName][variant];
	const egg = eggFolder.egg;

	assert(egg.PrimaryPart, `Expected regular ${eggName} to have a primary part.`);

	const defaultPosition = egg.PrimaryPart.Position.Y;
	const animatedPosition = egg.PrimaryPart.Position.Y + 2;

	const cframeValue = new Instance("CFrameValue");
	cframeValue.Value = egg.PrimaryPart.CFrame;

	const eggAnimationData = {
		cframeValue,
		egg,
	};

	cframeValues.push(eggAnimationData);

	task.spawn(() => {
		if (egg.PrimaryPart === undefined) {
			throw `Expected to find primary part named "primary" for ${egg.Name}`;
		}

		const eggAnimation_up = TweenService.Create(cframeValue, eggAnimationTweenInfo, {
			Value: new CFrame(egg.PrimaryPart.Position.X, animatedPosition, egg.PrimaryPart.Position.Z),
		});

		const eggAnimation_down = TweenService.Create(cframeValue, eggAnimationTweenInfo, {
			Value: new CFrame(egg.PrimaryPart.Position.X, defaultPosition, egg.PrimaryPart.Position.Z),
		});

		// eslint-disable-next-line no-constant-condition
		while (true) {
			eggAnimation_up.Play();
			eggAnimation_up.Completed.Wait();

			eggAnimation_down.Play();
			eggAnimation_down.Completed.Wait();
		}
	});
}

for (const [name, data] of pairs(EGGS)) {
	if (!data.hatchable) {
		continue;
	}

	task.spawn(() => {
		animateEgg(name, "regular");
		if (name !== "500k Event") {
			task.wait(1);
			animateEgg(name, "void");
		}
	});
}

RunService.RenderStepped.Connect(() => {
	debug.profilebegin("eggAnimation");
	for (const eggData of cframeValues) {
		if (eggData.egg.PrimaryPart === undefined) {
			continue;
		}

		eggData.egg.SetPrimaryPartCFrame(eggData.cframeValue.Value);
	}
	debug.profileend();
});
