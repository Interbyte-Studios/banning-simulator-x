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

	let primary = egg.PrimaryPart;
	if (primary === undefined) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (egg.PrimaryPart !== undefined) {
				primary = egg.PrimaryPart;
				break;
			}
		}
	}

	const defaultPosition = primary.Position.Y;
	const animatedPosition = primary.Position.Y + 2;

	const cframeValue = new Instance("CFrameValue");
	cframeValue.Value = primary.CFrame;

	const eggAnimationData = {
		cframeValue,
		egg,
	};

	cframeValues.push(eggAnimationData);

	task.spawn(() => {
		let primary = egg.PrimaryPart;
		if (primary === undefined) {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(1);
				if (egg.PrimaryPart !== undefined) {
					primary = egg.PrimaryPart;
				}
			}
		}

		const eggAnimation_up = TweenService.Create(cframeValue, eggAnimationTweenInfo, {
			Value: new CFrame(primary.Position.X, animatedPosition, primary.Position.Z),
		});

		const eggAnimation_down = TweenService.Create(cframeValue, eggAnimationTweenInfo, {
			Value: new CFrame(primary.Position.X, defaultPosition, primary.Position.Z),
		});

		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (egg.PrimaryPart !== undefined) {
				eggAnimation_up.Play();
				eggAnimation_up.Completed.Wait();

				eggAnimation_down.Play();
				eggAnimation_down.Completed.Wait();
			} else task.wait(1);
		}
	});
}

for (const [name, data] of pairs(EGGS)) {
	if (!data.hatchable) {
		continue;
	}

	task.spawn(() => {
		task.wait(5);
		animateEgg(name, "regular");
		if (name !== "Throwback") {
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

		eggData.egg.PivotTo(eggData.cframeValue.Value);
	}
	debug.profileend();
});
