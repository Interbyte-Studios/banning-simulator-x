import { CollectionService, RunService, TweenService } from "@rbxts/services";
import { AssetAnimation } from "shared/assetTags";

interface crystalAnimationData {
	cframeValue: CFrameValue;
	crystal: Model;
}

const cframeValues: Array<crystalAnimationData> = [];
const crystalTweenInfo = new TweenInfo(5, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

/**
 * Initializes and organizes the information necessary to animate a tagged crystal model.
 *
 * @param crystal The crystal model.
 * @param floatDistance The distance at which the crystal model will fly in the air.
 */
function animateCrystal(crystal: Model, floatDistance: number): void {
	if (crystal.PrimaryPart === undefined) {
		throw `Expected to find primary part named "primary" for ${crystal.Name}`;
	}

	const defaultPosition = crystal.PrimaryPart.Position.Y;
	const animatedPosition = crystal.PrimaryPart.Position.Y + floatDistance;

	const cframeValue = new Instance("CFrameValue");
	cframeValue.Value = crystal.PrimaryPart.CFrame;

	const crystalAnimationData = {
		cframeValue,
		crystal,
	};

	cframeValues.push(crystalAnimationData);

	task.spawn(() => {
		if (crystal.PrimaryPart === undefined) {
			throw `Expected to find primary part named "primary" for ${crystal.Name}`;
		}

		const crystalAnimation_up = TweenService.Create(cframeValue, crystalTweenInfo, {
			Value: new CFrame(crystal.PrimaryPart.Position.X, animatedPosition, crystal.PrimaryPart.Position.Z),
		});

		const crystalAnimation_down = TweenService.Create(cframeValue, crystalTweenInfo, {
			Value: new CFrame(crystal.PrimaryPart.Position.X, defaultPosition, crystal.PrimaryPart.Position.Z),
		});

		// eslint-disable-next-line no-constant-condition
		while (true) {
			crystalAnimation_up.Play();
			crystalAnimation_up.Completed.Wait();

			crystalAnimation_down.Play();
			crystalAnimation_down.Completed.Wait();
		}
	});
}

const gateCrystals = CollectionService.GetTagged(AssetAnimation.GateCrystal);
for (const crystal of gateCrystals) {
	task.spawn(() => {
		if (crystal.IsA("Model")) {
			animateCrystal(crystal, 10);
		}
	});
}

const smallCrystals = CollectionService.GetTagged(AssetAnimation.SmallCrystal);
for (const crystal of smallCrystals) {
	task.spawn(() => {
		if (crystal.IsA("Model")) {
			animateCrystal(crystal, 4);
		}
	});
}

RunService.RenderStepped.Connect(() => {
	debug.profilebegin("crystalAnimation");
	for (const crystalData of cframeValues) {
		if (crystalData.crystal.PrimaryPart === undefined) {
			continue;
		}

		crystalData.crystal.SetPrimaryPartCFrame(crystalData.cframeValue.Value);
	}
	debug.profileend();
});
