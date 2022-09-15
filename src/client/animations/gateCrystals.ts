import { CollectionService, RunService, TweenService } from "@rbxts/services";
import { GATE_CRYSTALS_TAG } from "shared/assetTags";

const gateCrystals = CollectionService.GetTagged(GATE_CRYSTALS_TAG);

interface crystalAnimationData {
	cframeValue: CFrameValue;
	crystalPart: BasePart;
}

const cframeValues: Array<crystalAnimationData> = [];
const crystalTweenInfo = new TweenInfo(5, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

for (const crystal of gateCrystals) {
	task.spawn(() => {
		if (crystal.IsA("Model")) {
			if (crystal.PrimaryPart === undefined) {
				throw `Expected to find primary part named "primary" for ${crystal.Name}`;
			}

			const defaultPosition = crystal.PrimaryPart.Position.Y;
			const animatedPosition = crystal.PrimaryPart.Position.Y + 10;

			const cframeValue = new Instance("CFrameValue");
			cframeValue.Value = crystal.PrimaryPart.CFrame;

			const crystalAnimationData = {
				cframeValue,
				crystalPart: crystal.PrimaryPart,
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
	});
}

RunService.RenderStepped.Connect(() => {
	for (const crystalData of cframeValues) {
		crystalData.crystalPart.CFrame = crystalData.cframeValue.Value;
	}
});
