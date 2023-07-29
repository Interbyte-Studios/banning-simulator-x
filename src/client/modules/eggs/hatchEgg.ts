import Object from "@rbxts/object-utils";
import {
	ContentProvider,
	Lighting,
	Players,
	ReplicatedStorage,
	RunService,
	TweenService,
	Workspace,
} from "@rbxts/services";
import { getPetDecal } from "client/util/getPetDecal";
import { HatchEffect, playSFX } from "client/util/playSound";
import { EggName } from "shared/configs/eggs";
import { RARITIES } from "shared/configs/rarities";
import { HatchedPet } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { setIsHatching } from "./isHatching";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

const hatchGui = playerGui.WaitForChild("Hatch") as ScreenGui;

const middleRarity = hatchGui.FindFirstChild("MiddleRarity") as TextLabel;
const middleAutoDeleted = hatchGui.FindFirstChild("MiddleAutoDeleted") as TextLabel;
const middleName = hatchGui.FindFirstChild("MiddleName") as TextLabel;
const middleDecal = middleName.FindFirstChild("ImageLabel") as ImageLabel;

const leftRarity = hatchGui.FindFirstChild("LeftRarity") as TextLabel;
const leftAutoDeleted = hatchGui.FindFirstChild("LeftAutoDeleted") as TextLabel;
const leftName = hatchGui.FindFirstChild("LeftName") as TextLabel;
const leftDecal = leftName.FindFirstChild("ImageLabel") as ImageLabel;

const rightRarity = hatchGui.FindFirstChild("RightRarity") as TextLabel;
const rightAutoDeleted = hatchGui.FindFirstChild("RightAutoDeleted") as TextLabel;
const rightName = hatchGui.FindFirstChild("RightName") as TextLabel;
const rightDecal = rightName.FindFirstChild("ImageLabel") as ImageLabel;

const stopButton = hatchGui.FindFirstChild("Stop") as ImageButton;

const hatchLight = Lighting.WaitForChild("HatchLight") as ColorCorrectionEffect;

/**
 * A number value representative of the pet's current rotation in the animation.
 */
const petRotation = new Instance("NumberValue");
petRotation.Value = 0;

/**
 * Whether or not the pet is spinning in the animation.
 */
let spin = false;

// Runservice connection to handle spinning
RunService.RenderStepped.Connect(() => {
	debug.profilebegin("Egg Spin");
	if (spin) {
		petRotation.Value += 3;
	} else {
		petRotation.Value += 0.7;
	}
	debug.profileend();
});

/**
 * Animate the hatching of a single egg.
 *
 * @param egg The egg to hatch.
 * @param pet The pet to hatch.
 * @param isVoid Whether or not the egg is a void egg.
 * @param wasAutoDeleted Whether or not the egg was auto deleted.
 * @param fastHatch Whether or not the user owns fast hatch.
 */
export const animateSingleEggHatch = (
	egg: EggName,
	pet: number,
	isVoid: boolean,
	wasAutoDeleted: boolean,
	fastHatch: boolean,
): void => {
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
	const cameraTweenInfo = new TweenInfo(0.25, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);
	const cameraTweenAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, 30)),
	});

	camera.CameraType = Enum.CameraType.Scriptable;
	cameraTweenAnimation.Play();
	cameraTweenAnimation.Completed.Wait();

	const petData = getPetData(pet);

	const eggModel = ReplicatedStorage.assetObjects.eggs[egg][isVoid ? "void" : "regular"].egg.Clone();
	const petModel = ReplicatedStorage.assetObjects.pets[egg][petData.name].Clone();
	ContentProvider.PreloadAsync([eggModel, petModel]);

	setAssetProperties("egg", eggModel, isVoid ? "void" : "regular");
	setAssetProperties("pet", petModel, isVoid ? "void" : "regular");

	const rarityData = RARITIES[petData.rarity];
	const petDecal = getPetDecal(petData.id, isVoid ? "void" : "regular");

	const rarityParticle =
		ReplicatedStorage.assetObjects.emitters["hatching emitters"][
			petData.rarity === "Legendary"
				? "legendary"
				: petData.rarity === "Secret"
				? "Secret"
				: petData.rarity === "Primordial"
				? "primordial"
				: "flare"
		].Clone();

	const rarityParticleAttachment = rarityParticle.FindFirstChildOfClass("Attachment");
	assert(rarityParticleAttachment, `Failed to animate single egg hatch | Couldn't find rarity particle attachment.`);

	const rarityParticleEmitter = rarityParticleAttachment.FindFirstChildOfClass("ParticleEmitter");
	assert(rarityParticleEmitter, `Failed to animate single egg hatch | Couldn't find rarity particle emitter.`);

	const rarityColor = new ColorSequence([
		new ColorSequenceKeypoint(0, rarityData.BeginningColor),
		new ColorSequenceKeypoint(1, rarityData.EndingColor),
	]);

	if (petData.rarity !== "Legendary" && petData.rarity !== "Secret" && petData.rarity !== "Primordial") {
		rarityParticleEmitter.Color = rarityColor;
	}

	const rarityGradient = new Instance("UIGradient");
	rarityGradient.Rotation = -90;
	rarityGradient.Color = rarityColor;

	eggModel.Parent = Workspace;
	petModel.Parent = Workspace;
	rarityParticle.Parent = Workspace;

	// reset pet rotation
	petRotation.Value = 0;

	// create "upvalues" to log CFrame manipulation
	const cframeValue = new Instance("CFrameValue");
	cframeValue.Value = new CFrame(-3, 0, 0);

	const distanceValue = new Instance("NumberValue");
	distanceValue.Value = -9.5;

	const rotationValue = new Instance("NumberValue");
	const positionValue = new Instance("NumberValue");

	// Handle egg animation on every step
	const eggAnimation = RunService.RenderStepped.Connect(() => {
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(3, positionValue.Value, distanceValue.Value);
		const cframeAngles = CFrame.Angles(0, math.rad(180), math.rad(rotationValue.Value));
		eggModel.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue.Value).mul(cframeAngles));
	});

	// animate
	// move egg to center
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.75 / 2 : 0.75, Enum.EasingStyle.Quint), {
		Value: -5,
	}).Play();

	positionValue.Value = -6;
	rotationValue.Value = 0;

	TweenService.Create(positionValue, new TweenInfo(fastHatch ? 0.25 : 5, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();

	task.wait(fastHatch ? 0.5 / 2 : 0.5);

	// rock egg to left and right
	for (let i = 0; i < 2; i++) {
		playSFX(HatchEffect.HatchImpact_1);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.275 / 2 : 0.275, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: -30,
			},
		).Play();
		task.wait(fastHatch ? 0.35 / 2 : 0.35);
		playSFX(HatchEffect.HatchImpact_2);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.275 / 2 : 0.275, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: 30,
			},
		).Play();
		task.wait(fastHatch ? 0.35 / 2 : 0.35);
	}
	task.wait(fastHatch ? 0.1 / 2 : 0.1);

	// distance the egg then bring it into the players screen (transition to pet)
	TweenService.Create(rotationValue, new TweenInfo(fastHatch ? 0.2 / 2 : 0.2, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.75 / 2 : 0.75, Enum.EasingStyle.Quint), {
		Value: -15.5,
	}).Play();
	task.wait(fastHatch ? 0.375 / 2 : 0.375);
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.15 / 2 : 0.15, Enum.EasingStyle.Quint), {
		Value: -1,
	});
	task.wait(fastHatch ? 0.155 / 2 : 0.155);

	// display a flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 0.3 / 2 : 0.3, Enum.EasingStyle.Quint), {
		Brightness: 1,
	}).Play();

	// end egg animation
	eggAnimation.Disconnect();
	eggModel.Destroy();
	positionValue.Value = 0;
	rotationValue.Value = 300;
	task.wait(fastHatch ? 0.235 / 2 : 0.235);

	// todo: show the pet information GUI
	stopButton.Visible = true;

	middleName.Text = petData.name;
	middleDecal.Image = petDecal;
	middleName.Visible = true;

	middleRarity.Text = petData.rarity;
	rarityGradient.Parent = middleRarity;
	middleRarity.Visible = true;

	middleAutoDeleted.Visible = wasAutoDeleted;

	// animate pet and hide flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 0.75 / 2 : 0.75, Enum.EasingStyle.Quint), {
		Brightness: 0,
	}).Play();
	distanceValue.Value = -8.5;
	const petAnimation = RunService.RenderStepped.Connect(() => {
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(3, positionValue.Value, distanceValue.Value);
		const cframeAngles = CFrame.Angles(0, math.rad(petRotation.Value), 0);
		petModel.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue.Value).mul(cframeAngles));
		rarityParticle.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue.Value).mul(cframeAngles));
	});

	spin = true;
	playSFX(HatchEffect.HatchReveal);
	task.wait(fastHatch ? 0.25 / 2 : 0.25);
	rarityParticleEmitter.Emit(1);
	task.wait(fastHatch ? 0.75 / 2 : 0.75);
	// todo: hide pet information gui
	spin = false;

	task.wait(fastHatch ? 0.05 / 2 : 0.05);
	TweenService.Create(
		positionValue,
		new TweenInfo(fastHatch ? 0.3 / 2 : 0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In),
		{
			Value: -7,
		},
	).Play();
	task.wait(fastHatch ? 0.35 / 2 : 0.35);

	// end pet animation and clean up entire animation
	petAnimation.Disconnect();
	petModel.Destroy();
	cframeValue.Destroy();
	distanceValue.Destroy();
	rotationValue.Destroy();
	positionValue.Destroy();
	rarityGradient.Destroy();
	rarityParticleEmitter.Clear();
	rarityParticle.Destroy();

	middleDecal.Image = "";
	middleName.Visible = false;
	middleRarity.Visible = false;
	middleAutoDeleted.Visible = false;
	stopButton.Visible = false;

	// reset camera
	const resetCameraAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, -30)),
	});

	resetCameraAnimation.Play();
	resetCameraAnimation.Completed.Wait();
	camera.CameraType = Enum.CameraType.Custom;

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

/**
 * Animate the hatching of a single egg.
 *
 * @param egg The egg to hatch.
 * @param isVoid Whether or not the egg is a void egg.
 * @param pets The pets to hatch.
 * @param fastHatch Whether or not the user owns fast hatch.
 */
export const animateTripleEggHatch = (
	egg: EggName,
	isVoid: boolean,
	pets: Array<HatchedPet>,
	fastHatch: boolean,
): void => {
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
	const cameraTweenInfo = new TweenInfo(0.25, Enum.EasingStyle.Quart, Enum.EasingDirection.Out);
	const cameraTweenAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, 30)),
	});

	camera.CameraType = Enum.CameraType.Scriptable;
	cameraTweenAnimation.Play();
	cameraTweenAnimation.Completed.Wait();

	const eggModel1 = ReplicatedStorage.assetObjects.eggs[egg][isVoid ? "void" : "regular"].egg.Clone();
	const eggModel2 = ReplicatedStorage.assetObjects.eggs[egg][isVoid ? "void" : "regular"].egg.Clone();
	const eggModel3 = ReplicatedStorage.assetObjects.eggs[egg][isVoid ? "void" : "regular"].egg.Clone();

	const pet1Data = getPetData(pets[0].id);
	const pet2Data = getPetData(pets[1].id);
	const pet3Data = getPetData(pets[2].id);

	const pet1Model = ReplicatedStorage.assetObjects.pets[egg][pet1Data.name].Clone();
	const pet2Model = ReplicatedStorage.assetObjects.pets[egg][pet2Data.name].Clone();
	const pet3Model = ReplicatedStorage.assetObjects.pets[egg][pet3Data.name].Clone();

	ContentProvider.PreloadAsync([eggModel1, eggModel2, eggModel3, pet1Model, pet2Model, pet3Model]);

	setAssetProperties("egg", eggModel1, isVoid ? "void" : "regular");
	setAssetProperties("egg", eggModel2, isVoid ? "void" : "regular");
	setAssetProperties("egg", eggModel3, isVoid ? "void" : "regular");
	setAssetProperties("pet", pet1Model, isVoid ? "void" : "regular");
	setAssetProperties("pet", pet2Model, isVoid ? "void" : "regular");
	setAssetProperties("pet", pet3Model, isVoid ? "void" : "regular");

	const pet1Decal = getPetDecal(pet1Data.id, isVoid ? "void" : "regular");
	const pet2Decal = getPetDecal(pet2Data.id, isVoid ? "void" : "regular");
	const pet3Decal = getPetDecal(pet3Data.id, isVoid ? "void" : "regular");

	const pet1RarityData = RARITIES[pet1Data.rarity];
	const pet2RarityData = RARITIES[pet2Data.rarity];
	const pet3RarityData = RARITIES[pet3Data.rarity];

	const highestRarity = math.max(pet1RarityData.id, pet2RarityData.id, pet3RarityData.id);
	const highestRarityData = Object.entries(RARITIES).find(([, rarityData]) => rarityData.id === highestRarity);
	assert(highestRarityData, `Failed to animate triple egg hatch | Couldn't find highest rarity data.`);

	const rarityParticle =
		ReplicatedStorage.assetObjects.emitters["hatching emitters"][
			highestRarityData[0] === "Legendary"
				? "legendary"
				: highestRarityData[0] === "Secret"
				? "Secret"
				: highestRarityData[0] === "Primordial"
				? "primordial"
				: "flare"
		].Clone();

	const rarityParticleAttachment = rarityParticle.FindFirstChildOfClass("Attachment");
	assert(rarityParticleAttachment, `Failed to animate single egg hatch | Couldn't find rarity particle attachment.`);

	const rarityParticleEmitter = rarityParticleAttachment.FindFirstChildOfClass("ParticleEmitter");
	assert(rarityParticleEmitter, `Failed to animate single egg hatch | Couldn't find rarity particle emitter.`);

	const highestRarityColor = new ColorSequence([
		new ColorSequenceKeypoint(0, highestRarityData[1].BeginningColor),
		new ColorSequenceKeypoint(1, highestRarityData[1].EndingColor),
	]);

	const rarity1Color = new ColorSequence([
		new ColorSequenceKeypoint(0, pet1RarityData.BeginningColor),
		new ColorSequenceKeypoint(1, pet1RarityData.EndingColor),
	]);

	const rarity2Color = new ColorSequence([
		new ColorSequenceKeypoint(0, pet2RarityData.BeginningColor),
		new ColorSequenceKeypoint(1, pet2RarityData.EndingColor),
	]);

	const rarity3Color = new ColorSequence([
		new ColorSequenceKeypoint(0, pet3RarityData.BeginningColor),
		new ColorSequenceKeypoint(1, pet3RarityData.EndingColor),
	]);

	if (
		highestRarityData[0] !== "Legendary" &&
		highestRarityData[0] !== "Secret" &&
		highestRarityData[0] !== "Primordial"
	) {
		rarityParticleEmitter.Color = highestRarityColor;
	}

	const rarity1Gradient = new Instance("UIGradient");
	rarity1Gradient.Rotation = -90;
	rarity1Gradient.Color = rarity1Color;

	const rarity2Gradient = new Instance("UIGradient");
	rarity2Gradient.Rotation = -90;
	rarity2Gradient.Color = rarity2Color;

	const rarity3Gradient = new Instance("UIGradient");
	rarity3Gradient.Rotation = -90;
	rarity3Gradient.Color = rarity3Color;

	eggModel1.Parent = Workspace;
	eggModel2.Parent = Workspace;
	eggModel3.Parent = Workspace;

	pet1Model.Parent = Workspace;
	pet2Model.Parent = Workspace;
	pet3Model.Parent = Workspace;

	rarityParticle.Parent = Workspace;

	// reset pet rotation
	petRotation.Value = 0;

	// create "upvalues" to log CFrame manipulation
	const cframeValue1 = new Instance("CFrameValue");
	cframeValue1.Value = new CFrame(-3, 0, 0);
	const cframeValue2 = new Instance("CFrameValue");
	cframeValue2.Value = new CFrame(-6.5, 0, 0);
	const cframeValue3 = new Instance("CFrameValue");
	cframeValue3.Value = new CFrame(0.5, 0, 0);

	const distanceValue = new Instance("NumberValue");
	distanceValue.Value = -9.5;

	const rotationValue = new Instance("NumberValue");
	const positionValue = new Instance("NumberValue");

	// Handle egg animation on every step
	const eggAnimation = RunService.RenderStepped.Connect(() => {
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(3, positionValue.Value, distanceValue.Value);
		const cframeAngles = CFrame.Angles(0, math.rad(180), math.rad(rotationValue.Value));
		eggModel1.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue1.Value).mul(cframeAngles));
		eggModel2.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue2.Value).mul(cframeAngles));
		eggModel3.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue3.Value).mul(cframeAngles));
	});

	// animate
	// move egg to center
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.75 / 2 : 0.75, Enum.EasingStyle.Quint), {
		Value: -5,
	}).Play();

	positionValue.Value = -6;
	rotationValue.Value = 0;

	TweenService.Create(positionValue, new TweenInfo(fastHatch ? 0.3 : 0.6, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();

	task.wait(fastHatch ? 0.5 / 2 : 0.5);

	// rock egg to left and right
	for (let i = 0; i < 2; i++) {
		playSFX(HatchEffect.HatchImpact_1);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.275 / 2 : 0.275, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: -30,
			},
		).Play();
		task.wait(fastHatch ? 0.35 / 2 : 0.35);
		playSFX(HatchEffect.HatchImpact_2);
		TweenService.Create(
			rotationValue,
			new TweenInfo(fastHatch ? 0.275 / 2 : 0.275, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
			{
				Value: 30,
			},
		).Play();
		task.wait(fastHatch ? 0.35 / 2 : 0.35);
	}
	task.wait(fastHatch ? 0.1 / 2 : 0.1);

	// distance the egg then bring it into the players screen (transition to pet)
	TweenService.Create(rotationValue, new TweenInfo(fastHatch ? 0.2 / 2 : 0.2, Enum.EasingStyle.Quint), {
		Value: 0,
	}).Play();
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.75 / 2 : 0.75, Enum.EasingStyle.Quint), {
		Value: -15.5,
	}).Play();
	task.wait(fastHatch ? 0.375 / 2 : 0.375);
	TweenService.Create(distanceValue, new TweenInfo(fastHatch ? 0.15 / 2 : 0.15, Enum.EasingStyle.Quint), {
		Value: -1,
	});
	task.wait(fastHatch ? 0.155 / 2 : 0.155);

	// display a flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 0.3 / 15 : 0.3, Enum.EasingStyle.Quint), {
		Brightness: 1,
	}).Play();

	// end egg animation
	eggAnimation.Disconnect();
	eggModel1.Destroy();
	eggModel2.Destroy();
	eggModel3.Destroy();
	positionValue.Value = 0;
	rotationValue.Value = 300;
	task.wait(fastHatch ? 0.235 / 2 : 0.235);

	// todo: show the pet information GUI
	stopButton.Visible = true;

	middleName.Text = pet1Data.name;
	middleDecal.Image = pet1Decal;
	middleName.Visible = true;

	middleRarity.Text = pet1Data.rarity;
	rarity1Gradient.Parent = middleRarity;
	middleRarity.Visible = true;

	middleAutoDeleted.Visible = pets[0].autoDeleted;

	leftName.Text = pet2Data.name;
	leftDecal.Image = pet2Decal;
	leftName.Visible = true;

	leftRarity.Text = pet2Data.rarity;
	rarity2Gradient.Parent = leftRarity;
	leftRarity.Visible = true;

	leftAutoDeleted.Visible = pets[1].autoDeleted;

	rightName.Text = pet3Data.name;
	rightDecal.Image = pet3Decal;
	rightName.Visible = true;

	rightRarity.Text = pet3Data.rarity;
	rarity3Gradient.Parent = rightRarity;
	rightRarity.Visible = true;

	rightAutoDeleted.Visible = pets[2].autoDeleted;

	// animate pet and hide flash effect
	TweenService.Create(hatchLight, new TweenInfo(fastHatch ? 1.5 / 2 : 1.5, Enum.EasingStyle.Quint), {
		Brightness: 0,
	}).Play();
	distanceValue.Value = -8.5;
	const petAnimation = RunService.RenderStepped.Connect(() => {
		const cameraCFrame = camera.CFrame;
		const cframePosition = new CFrame(3, positionValue.Value, distanceValue.Value);
		const cframeAngles = CFrame.Angles(0, math.rad(petRotation.Value), 0);
		pet1Model.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue1.Value).mul(cframeAngles));
		pet2Model.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue2.Value).mul(cframeAngles));
		pet3Model.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue3.Value).mul(cframeAngles));
		rarityParticle.PivotTo(cameraCFrame.mul(cframePosition).mul(cframeValue1.Value).mul(cframeAngles));
	});

	spin = true;
	playSFX(HatchEffect.HatchReveal);
	task.wait(fastHatch ? 0.25 / 2 : 0.25);
	rarityParticleEmitter.Emit(1);
	task.wait(fastHatch ? 0.75 / 2 : 0.75);
	// todo: hide pet information gui
	spin = false;

	task.wait(fastHatch ? 0.05 / 2 : 0.05);
	TweenService.Create(
		positionValue,
		new TweenInfo(fastHatch ? 0.6 / 2 : 0.6, Enum.EasingStyle.Back, Enum.EasingDirection.In),
		{
			Value: -7,
		},
	).Play();
	task.wait(fastHatch ? 0.35 / 2 : 0.35);

	// end pet animation and clean up entire animation
	petAnimation.Disconnect();
	pet1Model.Destroy();
	pet2Model.Destroy();
	pet3Model.Destroy();
	cframeValue1.Destroy();
	cframeValue2.Destroy();
	cframeValue3.Destroy();
	distanceValue.Destroy();
	rotationValue.Destroy();
	positionValue.Destroy();
	rarity1Gradient.Destroy();
	rarity2Gradient.Destroy();
	rarity3Gradient.Destroy();
	rarityParticleEmitter.Clear();
	rarityParticle.Destroy();

	middleDecal.Image = "";
	middleName.Visible = false;
	middleRarity.Visible = false;
	middleAutoDeleted.Visible = false;
	leftName.Visible = false;
	leftRarity.Visible = false;
	leftAutoDeleted.Visible = false;
	rightName.Visible = false;
	rightRarity.Visible = false;
	rightAutoDeleted.Visible = false;
	stopButton.Visible = false;

	// reset camera
	const resetCameraAnimation = TweenService.Create(camera, cameraTweenInfo, {
		CFrame: camera.CFrame.mul(new CFrame(0, 0, -30)),
	});

	resetCameraAnimation.Play();
	resetCameraAnimation.Completed.Wait();
	camera.CameraType = Enum.CameraType.Custom;

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
