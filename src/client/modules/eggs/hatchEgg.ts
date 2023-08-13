import {
	ContentProvider,
	Lighting,
	Players,
	ReplicatedStorage,
	RunService,
	TweenService,
	Workspace,
} from "@rbxts/services";
import { HatchEffect, playSFX } from "client/util/playSound";
import { EggName } from "shared/configs/eggs";
import { RARITIES } from "shared/configs/rarities";
import { HatchedPet } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { isValidEggHatchUI } from "./eggUI";
import { setIsHatching } from "./isHatching";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const hatch = playerGui.WaitForChild("Hatch");
assert(isValidEggHatchUI(hatch), `Invalid Egg Hatching UI`);

const hatchLight = Lighting.WaitForChild("HatchLight") as ColorCorrectionEffect;
const blurEffect = Lighting.WaitForChild("Blur") as BlurEffect;
const depthOfField = Lighting.WaitForChild("DepthOfField") as DepthOfFieldEffect;

// Preset CFrames
const middleScreenCFrame = new Instance("CFrameValue");
middleScreenCFrame.Value = new CFrame(0, 0, 0);

const leftScreenCFrame = new Instance("CFrameValue");
leftScreenCFrame.Value = new CFrame(-4.5, 0, 0);

const rightScreenCFrame = new Instance("CFrameValue");
rightScreenCFrame.Value = new CFrame(4.5, 0, 0);

const bottomLeftScreenCFrame = new Instance("CFrameValue");
bottomLeftScreenCFrame.Value = new CFrame(-5.5, -2, 0);

const bottomRightScreenCFrame = new Instance("CFrameValue");
bottomRightScreenCFrame.Value = new CFrame(5.5, -2, 0);

const topLeftScreenCFrame = new Instance("CFrameValue");
topLeftScreenCFrame.Value = new CFrame(-5.5, 2.6, 0);

const topRightScreenCFrame = new Instance("CFrameValue");
topRightScreenCFrame.Value = new CFrame(5.5, 2.6, 0);

/**
 * Animates egg hatching.
 *
 * @param egg The egg to hatch.
 * @param isVoid Whether or not the egg is a void egg.
 * @param pets The pets to hatch.
 * @param fastHatch Whether or not the user owns fast hatch.
 */
export const animateEggHatch = (egg: EggName, isVoid: boolean, pets: Array<HatchedPet>, fastHatch: boolean): void => {
	debug.setmemorycategory("hatchEggModule");
	const camera = Workspace.CurrentCamera;
	assert(camera, `Failed to animate single egg hatch | Couldn't find camera.`);
	setIsHatching(true);

	// disable UI | note: would use roact, but due to Roact batching stateful updates, it's not possible to manipulate roact the way we need to :(
	playerGui.GetChildren().forEach((instance) => {
		if (instance.IsA("ScreenGui") && instance.Name !== "Chat" && instance.Name !== "Hatch") {
			instance.Enabled = false;

			instance.GetDescendants().forEach((descendant) => {
				if (descendant.IsA("BillboardGui")) {
					descendant.Enabled = false;
				}
			});
		}
	});

	// zoom camera out for animation
	const cameraTweenInfo = new TweenInfo(0.15, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);
	const cameraTweenAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, 30)),
	});

	const blurBeforeHatch = blurEffect.Size;
	TweenService.Create(blurEffect, cameraTweenInfo, {
		Size: 0,
	}).Play();
	depthOfField.Enabled = true;
	depthOfField.FarIntensity = 0;
	TweenService.Create(depthOfField, cameraTweenInfo, {
		FarIntensity: 1,
	}).Play();

	camera.CameraType = Enum.CameraType.Scriptable;
	cameraTweenAnimation.Play();
	cameraTweenAnimation.Completed.Wait();

	// verify we have a max of 5 pets to hatch
	if (pets.size() > 5) {
		// reset camera
		const resetCameraAnimation = TweenService.Create(camera, cameraTweenInfo, {
			CFrame: camera.CFrame.mul(new CFrame(0, 0, -30)),
		});

		resetCameraAnimation.Play();
		resetCameraAnimation.Completed.Wait();
		camera.CameraType = Enum.CameraType.Custom;

		playerGui.GetChildren().forEach((instance) => {
			if (instance.IsA("ScreenGui")) {
				instance.Enabled = true;

				instance.GetDescendants().forEach((descendant) => {
					if (descendant.IsA("BillboardGui")) {
						descendant.Enabled = true;
					}
				});
			}
		});
		setIsHatching(false);
		return;
	}

	const eggModel = ReplicatedStorage.assetObjects.eggs[egg][isVoid ? "void" : "regular"].egg.Clone();
	const eggModels = pets.map(() => {
		const model = eggModel.Clone();
		setAssetProperties("egg", model, isVoid ? "void" : "regular");
		ContentProvider.PreloadAsync([model]);
		model.Parent = Workspace;

		return model;
	});

	const petsData = pets.map((hatchedPet) => {
		const data = getPetData(hatchedPet.id);
		const variant = hatchedPet.magicPet ? (isVoid ? "radiant" : "void") : isVoid ? "void" : "regular";
		const model = ReplicatedStorage.assetObjects.pets[egg][data.name].Clone();

		const rarityData = RARITIES[data.rarity];
		const rarityColorSequence = new ColorSequence([
			new ColorSequenceKeypoint(0, rarityData.BeginningColor),
			new ColorSequenceKeypoint(1, rarityData.EndingColor),
		]);
		const rarityGradient = new Instance("UIGradient");
		rarityGradient.Rotation = -90;
		rarityGradient.Color = rarityColorSequence;

		setAssetProperties("pet", model, variant);
		ContentProvider.PreloadAsync([model]);
		model.Parent = Workspace;
		return {
			data,
			variant,
			model,
			rarityGradient,
			autoDeleted: hatchedPet.autoDeleted,
		};
	});

	// create "upvalues" to log CFrame manipulation
	const distanceValue = new Instance("NumberValue");
	distanceValue.Value = -9.5;

	const rotationValue = new Instance("NumberValue");
	const positionValue = new Instance("NumberValue");

	// Handle egg animation on every step
	const eggAnimation = RunService.RenderStepped.Connect(() => {
		debug.profilebegin("eggAnimation");
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(0, positionValue.Value, distanceValue.Value);
		const cframeAngles = CFrame.Angles(0, 0, math.rad(rotationValue.Value));

		eggModels.forEach((model, index) => {
			let eggCFrame: CFrameValue | undefined;
			if (eggModels.size() === 1) {
				eggCFrame = middleScreenCFrame;
			} else if (eggModels.size() === 2) {
				eggCFrame = index === 0 ? leftScreenCFrame : rightScreenCFrame;
			} else if (eggModels.size() === 3) {
				eggCFrame = index === 0 ? middleScreenCFrame : index === 1 ? leftScreenCFrame : rightScreenCFrame;
			} else if (eggModels.size() === 4) {
				eggCFrame =
					index === 0
						? bottomLeftScreenCFrame
						: index === 1
						? topLeftScreenCFrame
						: index === 2
						? bottomRightScreenCFrame
						: topRightScreenCFrame;
			} else if (eggModels.size() === 5) {
				eggCFrame =
					index === 0
						? middleScreenCFrame
						: index === 1
						? bottomLeftScreenCFrame
						: index === 2
						? topLeftScreenCFrame
						: index === 3
						? bottomRightScreenCFrame
						: topRightScreenCFrame;
			}
			if (eggCFrame !== undefined) {
				const animatedCFrame = cameraCFrame.mul(cframePosition).mul(eggCFrame.Value);
				model.PivotTo(CFrame.lookAt(animatedCFrame.Position, cameraCFrame.Position).mul(cframeAngles));
			}
		});
		debug.profileend();
	});

	// animate
	// move egg to center
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.375 / 2 : 0.375, Enum.EasingStyle.Quint), {
		Value: pets.size() >= 4 ? -7.5 : pets.size() >= 3 ? -6.5 : pets.size() >= 2 ? -6 : -5,
	}).Play();

	positionValue.Value = -6;
	rotationValue.Value = 0;

	TweenService.Create(positionValue, new TweenInfo(fastHatch ? 0.25 : 0.4, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();

	task.wait(fastHatch ? 0.25 / 2 : 0.2);

	// rock egg to left and right
	for (let i = 0; i < 2; i++) {
		playSFX(HatchEffect.HatchImpact_1);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.18 / 2 : 0.145, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: -30,
			},
		).Play();
		task.wait(fastHatch ? 0.25 / 2 : 0.165);
		playSFX(HatchEffect.HatchImpact_2);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.18 / 2 : 0.145, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: 30,
			},
		).Play();
		task.wait(fastHatch ? 0.25 / 2 : 0.165);
	}
	task.wait(fastHatch ? 0.1 / 2 : 0.1);

	// distance the egg then bring it into the players screen (transition to pet)
	TweenService.Create(rotationValue, new TweenInfo(fastHatch ? 0.2 / 2 : 0.15, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.5 / 2 : 0.5, Enum.EasingStyle.Quint), {
		Value: -15.5,
	}).Play();
	task.wait(fastHatch ? 0.4 / 2 : 0.4);
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.5 / 2 : 0.5, Enum.EasingStyle.Quint), {
		Value: -1,
	});
	task.wait(fastHatch ? 0.1 / 2 : 0.2);

	// display a flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 0.2 / 2 : 0.15, Enum.EasingStyle.Quint), {
		Brightness: 1,
	}).Play();

	// end egg animation
	eggAnimation.Disconnect();
	for (const eggModel of eggModels) {
		eggModel.Destroy();
	}
	positionValue.Value = 0;
	rotationValue.Value = 300;
	task.wait(fastHatch ? 0.125 / 2 : 0.125);

	// todo: show the pet information GUI
	hatch.Stop.Visible = true;

	if (pets.size() === 1) {
		hatch.hatch1.Visible = true;
		hatch.hatch1.Middle.PetName.Text = petsData[0].data.name;
		hatch.hatch1.Middle.PetRarity.Text = petsData[0].data.rarity;
		petsData[0].rarityGradient.Parent = hatch.hatch1.Middle.PetRarity;
		hatch.hatch1.Middle.AutoDeleted.Visible = petsData[0].autoDeleted;
	} else if (pets.size() === 2) {
		hatch.hatch2.Visible = true;

		hatch.hatch2.Left.PetName.Text = petsData[0].data.name;
		hatch.hatch2.Left.PetRarity.Text = petsData[0].data.rarity;
		petsData[0].rarityGradient.Parent = hatch.hatch2.Left.PetRarity;
		hatch.hatch2.Left.AutoDeleted.Visible = petsData[0].autoDeleted;

		hatch.hatch2.Right.PetName.Text = petsData[1].data.name;
		hatch.hatch2.Right.PetRarity.Text = petsData[1].data.rarity;
		petsData[1].rarityGradient.Parent = hatch.hatch2.Right.PetRarity;
		hatch.hatch2.Right.AutoDeleted.Visible = petsData[1].autoDeleted;
	} else if (pets.size() === 3) {
		hatch.hatch3.Visible = true;

		hatch.hatch3.Middle.PetName.Text = petsData[0].data.name;
		hatch.hatch3.Middle.PetRarity.Text = petsData[0].data.rarity;
		petsData[0].rarityGradient.Parent = hatch.hatch3.Middle.PetRarity;
		hatch.hatch3.Middle.AutoDeleted.Visible = petsData[0].autoDeleted;

		hatch.hatch3.Left.PetName.Text = petsData[1].data.name;
		hatch.hatch3.Left.PetRarity.Text = petsData[1].data.rarity;
		petsData[1].rarityGradient.Parent = hatch.hatch3.Left.PetRarity;
		hatch.hatch3.Left.AutoDeleted.Visible = petsData[1].autoDeleted;

		hatch.hatch3.Right.PetName.Text = petsData[2].data.name;
		hatch.hatch3.Right.PetRarity.Text = petsData[2].data.rarity;
		petsData[2].rarityGradient.Parent = hatch.hatch3.Right.PetRarity;
		hatch.hatch3.Right.AutoDeleted.Visible = petsData[2].autoDeleted;
	} else if (pets.size() === 4) {
		hatch.hatch4.Visible = true;

		hatch.hatch4.BottomLeft.PetName.Text = petsData[0].data.name;
		hatch.hatch4.BottomLeft.PetRarity.Text = petsData[0].data.rarity;
		petsData[0].rarityGradient.Parent = hatch.hatch4.BottomLeft.PetRarity;
		hatch.hatch4.BottomLeft.AutoDeleted.Visible = petsData[0].autoDeleted;

		hatch.hatch4.TopLeft.PetName.Text = petsData[1].data.name;
		hatch.hatch4.TopLeft.PetRarity.Text = petsData[1].data.rarity;
		petsData[1].rarityGradient.Parent = hatch.hatch4.TopLeft.PetRarity;
		hatch.hatch4.TopLeft.AutoDeleted.Visible = petsData[1].autoDeleted;

		hatch.hatch4.BottomRight.PetName.Text = petsData[2].data.name;
		hatch.hatch4.BottomRight.PetRarity.Text = petsData[2].data.rarity;
		petsData[2].rarityGradient.Parent = hatch.hatch4.BottomRight.PetRarity;
		hatch.hatch4.BottomRight.AutoDeleted.Visible = petsData[2].autoDeleted;

		hatch.hatch4.TopRight.PetName.Text = petsData[3].data.name;
		hatch.hatch4.TopRight.PetRarity.Text = petsData[3].data.rarity;
		petsData[3].rarityGradient.Parent = hatch.hatch4.TopRight.PetRarity;
		hatch.hatch4.TopRight.AutoDeleted.Visible = petsData[3].autoDeleted;
	} else if (pets.size() === 5) {
		hatch.hatch5.Visible = true;

		hatch.hatch5.Middle.PetName.Text = petsData[0].data.name;
		hatch.hatch5.Middle.PetRarity.Text = petsData[0].data.rarity;
		petsData[0].rarityGradient.Parent = hatch.hatch5.Middle.PetRarity;
		hatch.hatch5.Middle.AutoDeleted.Visible = petsData[0].autoDeleted;

		hatch.hatch5.BottomLeft.PetName.Text = petsData[1].data.name;
		hatch.hatch5.BottomLeft.PetRarity.Text = petsData[1].data.rarity;
		petsData[1].rarityGradient.Parent = hatch.hatch5.BottomLeft.PetRarity;
		hatch.hatch5.BottomLeft.AutoDeleted.Visible = petsData[1].autoDeleted;

		hatch.hatch5.TopLeft.PetName.Text = petsData[2].data.name;
		hatch.hatch5.TopLeft.PetRarity.Text = petsData[2].data.rarity;
		petsData[2].rarityGradient.Parent = hatch.hatch5.TopLeft.PetRarity;
		hatch.hatch5.TopLeft.AutoDeleted.Visible = petsData[2].autoDeleted;

		hatch.hatch5.BottomRight.PetName.Text = petsData[3].data.name;
		hatch.hatch5.BottomRight.PetRarity.Text = petsData[3].data.rarity;
		petsData[3].rarityGradient.Parent = hatch.hatch5.BottomRight.PetRarity;
		hatch.hatch5.BottomRight.AutoDeleted.Visible = petsData[3].autoDeleted;

		hatch.hatch5.TopRight.PetName.Text = petsData[4].data.name;
		hatch.hatch5.TopRight.PetRarity.Text = petsData[4].data.rarity;
		petsData[4].rarityGradient.Parent = hatch.hatch5.TopRight.PetRarity;
		hatch.hatch5.TopRight.AutoDeleted.Visible = petsData[4].autoDeleted;
	}

	// animate pet and hide flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 0.6 / 2 : 0.6, Enum.EasingStyle.Quint), {
		Brightness: 0,
	}).Play();
	distanceValue.Value = pets.size() >= 4 ? -7.5 : pets.size() >= 3 ? -6.5 : pets.size() >= 2 ? -6 : -5;
	const petAnimation = RunService.RenderStepped.Connect(() => {
		debug.profilebegin("petEggAnimation_triple");
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(0, positionValue.Value, distanceValue.Value);

		petsData.forEach((data, index) => {
			let petCFrame: CFrameValue | undefined;
			if (eggModels.size() === 1) {
				petCFrame = middleScreenCFrame;
			} else if (eggModels.size() === 2) {
				petCFrame = index === 0 ? leftScreenCFrame : rightScreenCFrame;
			} else if (eggModels.size() === 3) {
				petCFrame = index === 0 ? middleScreenCFrame : index === 1 ? leftScreenCFrame : rightScreenCFrame;
			} else if (eggModels.size() === 4) {
				petCFrame =
					index === 0
						? bottomLeftScreenCFrame
						: index === 1
						? topLeftScreenCFrame
						: index === 2
						? bottomRightScreenCFrame
						: topRightScreenCFrame;
			} else if (eggModels.size() === 5) {
				petCFrame =
					index === 0
						? middleScreenCFrame
						: index === 1
						? bottomLeftScreenCFrame
						: index === 2
						? topLeftScreenCFrame
						: index === 3
						? bottomRightScreenCFrame
						: topRightScreenCFrame;
			}
			if (petCFrame !== undefined) {
				const animatedCFrame = cameraCFrame.mul(cframePosition).mul(petCFrame.Value);
				data.model.PivotTo(CFrame.lookAt(animatedCFrame.Position, cameraCFrame.Position));
			}
		});
		debug.profileend();
	});

	playSFX(HatchEffect.HatchReveal);
	task.wait(fastHatch ? 0.5 / 2 : 0.5);
	TweenService.Create(
		positionValue,
		new TweenInfo(fastHatch ? 0.5 / 2 : 0.5, Enum.EasingStyle.Back, Enum.EasingDirection.In),
		{
			Value: -7,
		},
	).Play();
	task.wait(fastHatch ? 0.5 / 2 : 0.5);

	// end pet animation and clean up entire animation
	petAnimation.Disconnect();
	distanceValue.Destroy();
	rotationValue.Destroy();
	positionValue.Destroy();

	petsData.forEach((petData) => {
		petData.model.Destroy();
		petData.rarityGradient.Destroy();
	});

	hatch.hatch1.Visible = false;
	hatch.hatch2.Visible = false;
	hatch.hatch3.Visible = false;
	hatch.hatch4.Visible = false;
	hatch.hatch5.Visible = false;
	hatch.Stop.Visible = false;

	// reset camera
	const resetCameraAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, -30)),
	});

	resetCameraAnimation.Play();
	resetCameraAnimation.Completed.Wait();
	camera.CameraType = Enum.CameraType.Custom;

	TweenService.Create(blurEffect, cameraTweenInfo, {
		Size: blurBeforeHatch,
	}).Play();
	TweenService.Create(depthOfField, cameraTweenInfo, {
		FarIntensity: 0,
	}).Play();

	// enable UI
	playerGui.GetChildren().forEach((instance) => {
		if (instance.IsA("ScreenGui")) {
			instance.Enabled = true;

			instance.GetDescendants().forEach((descendant) => {
				if (descendant.IsA("BillboardGui")) {
					descendant.Enabled = true;
				}
			});
		}
	});
	setIsHatching(false);
};
