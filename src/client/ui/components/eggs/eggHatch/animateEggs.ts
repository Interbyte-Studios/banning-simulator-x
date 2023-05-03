import { HttpService, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { HatchEffect, playSFX } from "client/util/playSound";
import { EggName, hatchDebounce } from "shared/configs/eggs";
import { RARITIES } from "shared/configs/rarities";
import { ValidEggAmount, validEggEmount } from "shared/remotes/eggs/hatchEgg";
import { ConfirmedPet } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";

type ValidEggId = 1 | 2 | 3 | 4;

export interface HatchEggParams {
	amount: ValidEggAmount;
	eggName: EggName;
	fastEnabled: boolean;
	pets?: Array<ConfirmedPet>;
	isVoid: boolean;
}

interface AnimatedEgg {
	id: ValidEggAmount;
	currentCFrame: CFrameValue;
	currentEgg: ValidEggId;
	eggModels: {
		1: Model;
		2: Model;
		3: Model;
		4: Model;
	};
}

interface AnimatedPet {
	id: ValidEggAmount;
	petId: number;
	currentCFrame: CFrameValue;
	flareDisplayed: boolean;
	raritySparklesDisplayed: boolean;
	flare?: (typeof ReplicatedStorage.assetObjects.emitters)["hatching emitters"]["flare"];
	raritySparkles?:
		| (typeof ReplicatedStorage.assetObjects.emitters)["hatching emitters"]["legendary"]
		| (typeof ReplicatedStorage.assetObjects.emitters)["hatching emitters"]["prismatic"]
		| (typeof ReplicatedStorage.assetObjects.emitters)["hatching emitters"]["primordial"];
	petModel: Model;
}

interface TweenDataDoc {
	tweenInfo: {
		regular: {
			segment1: TweenInfo;
			segment2: TweenInfo;
			segment3: TweenInfo;
			pets: TweenInfo;
		};
		fast: {
			segment1: TweenInfo;
			segment2: TweenInfo;
			segment3: TweenInfo;
			pets: TweenInfo;
		};
	};
	tweenData: {
		middle: {
			segment0: CFrame;
			segment1: CFrame;
			segment2: CFrame;
			segment3: CFrame;
		};
		left: {
			segment0: CFrame;
			segment1: CFrame;
			segment2: CFrame;
			segment3: CFrame;
		};
		right: {
			segment0: CFrame;
			segment1: CFrame;
			segment2: CFrame;
			segment3: CFrame;
		};
	};
}

/**
 * Class that manages the animation of eggs during egg hatching.
 */
export class AnimateEggs {
	/**
	 * A table of tween data correspondant to each egg id.
	 */
	private static tweenData: TweenDataDoc = {
		tweenInfo: {
			regular: {
				segment1: new TweenInfo(0.75, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				segment2: new TweenInfo(0.6, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				segment3: new TweenInfo(0.6, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				pets: new TweenInfo(0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.Out),
			},
			fast: {
				segment1: new TweenInfo(0.5, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				segment2: new TweenInfo(0.25, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				segment3: new TweenInfo(0.25, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
				pets: new TweenInfo(0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.Out),
			},
		},
		tweenData: {
			middle: {
				segment0: new CFrame(0, 7.5, -6.75),
				segment1: new CFrame(0, 0, -6.75),
				segment2: new CFrame(0, 0, -5.75).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(0, 0, -5).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
			left: {
				segment0: new CFrame(-3.5, 7.5, -7.75),
				segment1: new CFrame(-3.5, 0, -7.75),
				segment2: new CFrame(-3.5, 0, -6.75).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(-3.5, 0, -6).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
			right: {
				segment0: new CFrame(3.5, 7.5, -8),
				segment1: new CFrame(3.5, 0, -8),
				segment2: new CFrame(3.5, 0, -7).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(3.5, 0, -6.25).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
		},
	};

	/**
	 * The render guid for the animation currently being displayed.
	 */
	private static currentRenderGuid: string;

	/**
	 * Documents whether or not the egg animation has been initiated.
	 */
	public static eggAnimationInitiated = false;

	/**
	 * Documents whether or not the pet animation has been initiated.
	 */
	public static petAnimationInitiated = false;

	/**
	 * Documents whether or not the egg animation has been completed.
	 */
	public static eggAnimationComplete = true;

	/**
	 * Documents whether or not the pet animation has been completed.
	 */
	public static petAnimationComplete = true;

	/**
	 * The timestamp at which the player last hatched eggs.
	 */
	public static lasHatchTime = 0;

	/**
	 * An array of egg metadata currently being used to animate an egg hatch.
	 */
	private static animatedEggs: Array<AnimatedEgg> = [];

	/**
	 * An array of pet metadata currently being used to animate an egg hatch.
	 */
	private static animatedPets: Array<AnimatedPet> = [];

	/**
	 * Checks whether or not the player has waited the alotted time and can hatch an egg.
	 *
	 * @returns Whether or not the player has waited the specified debounce time.
	 */
	public static canHatchEgg(): boolean {
		if (this.eggAnimationComplete === false || this.petAnimationComplete === false) {
			return false;
		}

		if (RunService.IsStudio()) {
			return true;
		}

		return time() - this.lasHatchTime > hatchDebounce;
	}

	/**
	 * Gets the position that an egg should be at during a certain segment depending on its id.
	 *
	 * @param amount The amount of eggs being animated.
	 * @param id The id of the egg.
	 * @returns The segment containing CFrames for egg positions.
	 */
	private static getSegment(amount: ValidEggAmount, id: ValidEggId): TweenDataDoc["tweenData"]["middle"] {
		let segmentData: TweenDataDoc["tweenData"]["middle"] | undefined;
		switch (amount) {
			case 1: {
				segmentData = this.tweenData.tweenData.middle;
				break;
			}
			case 2: {
				switch (id) {
					case 1: {
						segmentData = this.tweenData.tweenData.left;
						break;
					}
					case 2: {
						segmentData = this.tweenData.tweenData.right;
						break;
					}
				}
				break;
			}
			case 3: {
				switch (id) {
					case 1: {
						segmentData = this.tweenData.tweenData.middle;
						break;
					}
					case 2: {
						segmentData = this.tweenData.tweenData.left;
						break;
					}
					case 3: {
						segmentData = this.tweenData.tweenData.right;
						break;
					}
				}
				break;
			}
		}
		assert(segmentData, `Expected to find segment data for amount: ${amount}, id: ${id}`);

		return segmentData;
	}

	/**
	 * Handles the animation for egg hatching.
	 *
	 * @param amount The amount of eggs being hatched.
	 * @param fastEnabled Whether or not the animation is fast.
	 */
	private static animateEggHatches(amount: ValidEggAmount, fastEnabled: boolean): void {
		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		/**
		 * Animates an egg's currentCFrame based on the segment the animation is currently at.
		 *
		 * @param eggData The egg to animate.
		 * @param _segment The segment of the animation.
		 * @param moveToNextId Whether or not to move to the next egg model.
		 */
		function animateEggSegment(
			eggData: AnimatedEgg,
			_segment: "segment1" | "segment2" | "segment3",
			moveToNextId?: boolean,
		): void {
			const segment = AnimateEggs.getSegment(amount, eggData.id);

			const animation = TweenService.Create(
				eggData.currentCFrame,
				fastEnabled
					? AnimateEggs.tweenData.tweenInfo.fast[_segment]
					: AnimateEggs.tweenData.tweenInfo.regular[_segment],
				{
					Value: segment[_segment],
				},
			);

			animation.Play();
			animation.Completed.Wait();

			if (moveToNextId) {
				eggData.eggModels[(eggData.currentEgg + 1) as ValidEggId].SetPrimaryPartCFrame(
					camera.GetRenderCFrame().mul(eggData.currentCFrame.Value),
				);

				eggData.eggModels[eggData.currentEgg].SetPrimaryPartCFrame(new CFrame(0, 0, 0));
				eggData.eggModels[eggData.currentEgg].Parent = undefined;
				eggData.currentEgg += 1;
			}
		}

		let amountComplete = 0;
		for (const eggData of this.animatedEggs) {
			task.spawn(() => {
				playSFX(HatchEffect.HatchImpact_1);
				animateEggSegment(eggData, "segment1");
				task.wait(0.5);

				playSFX(HatchEffect.HatchImpact_2);
				animateEggSegment(eggData, "segment2", true);
				task.wait(0.35);

				playSFX(HatchEffect.HatchImpact_1);
				animateEggSegment(eggData, "segment3", true);
				task.wait(0.35);

				const segment = this.getSegment(amount, eggData.id);

				const duration = 0.75;
				let timeStamp = 0;
				let spin = 0;
				while (timeStamp < 1) {
					spin += 0.35;

					const deltaTime = RunService.RenderStepped.Wait();

					timeStamp = math.min(timeStamp + deltaTime[0] / duration, 1);
					const alpha = TweenService.GetValue(timeStamp, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

					const shookTween = eggData.currentCFrame.Value.Lerp(segment.segment1.mul(CFrame.Angles(0, spin, 0)), alpha);
					eggData.currentCFrame.Value = shookTween;
					playSFX(HatchEffect.HatchImpact_2);
				}

				eggData.eggModels[eggData.currentEgg].SetPrimaryPartCFrame(new CFrame(0, 0, 0));
				eggData.eggModels[eggData.currentEgg].Parent = undefined;

				amountComplete += 1;
			});
		}

		while (amountComplete !== amount) {
			RunService.RenderStepped.Wait();
		}

		this.eggAnimationComplete = true;
	}

	/**
	 * Handles the animation for pet display.
	 *
	 * @param amount The amount of pets being displayed.
	 * @param fastEnabled Whether or not the animation is fast.
	 */
	private static animatePetHatches(amount: ValidEggAmount, fastEnabled: boolean): void {
		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		let amountComplete = 0;
		for (const petData of this.animatedPets) {
			task.spawn(() => {
				const segment = this.getSegment(amount, petData.id);

				if (petData.flare !== undefined) {
					petData.flare.Parent = Workspace;
				}

				if (petData.raritySparkles !== undefined) {
					petData.raritySparkles.Parent = Workspace;
				}

				petData.petModel.PivotTo(camera.GetRenderCFrame().mul(segment.segment1));
				petData.currentCFrame.Value = new CFrame(segment.segment1.X, segment.segment1.Y, segment.segment1.Z - 5);

				let rotationDegrees = 0;
				switch (amount) {
					case 1: {
						rotationDegrees = 0;
						break;
					}
					case 2: {
						switch (petData.id) {
							case 1: {
								rotationDegrees = -15;
								break;
							}
							case 2: {
								rotationDegrees = 15;
								break;
							}
						}
						break;
					}
					case 3: {
						switch (petData.id) {
							case 1: {
								rotationDegrees = 0;
								break;
							}
							case 2: {
								rotationDegrees = -15;
								break;
							}
							case 3: {
								rotationDegrees = 15;
								break;
							}
						}
						break;
					}
				}

				const animation = TweenService.Create(
					petData.currentCFrame,
					fastEnabled ? this.tweenData.tweenInfo.fast.pets : this.tweenData.tweenInfo.regular.pets,
					{
						Value: segment.segment1.mul(CFrame.Angles(0, math.rad(180), math.rad(rotationDegrees))),
					},
				);

				animation.Play();
				animation.Completed.Wait();
				task.wait(0.5);

				amountComplete += 1;
			});
		}
		playSFX(HatchEffect.HatchReveal);

		while (amountComplete !== amount) {
			RunService.RenderStepped.Wait();
		}

		task.wait(1);

		this.petAnimationComplete = true;
	}

	/**
	 * Hatches eggs upon request.
	 *
	 * @param params The parameters used for handling the hatching animation.
	 * @param params.amount The amount of eggs to animate for hatching.
	 * @param params.eggName The name of the egg.
	 */
	public static initiateEggHatch(params: HatchEggParams): void {
		this.eggAnimationInitiated = true;

		const eggFolder = ReplicatedStorage.assetObjects.eggs[params.eggName][params.isVoid ? "void" : "regular"];

		for (const i of $range(1, params.amount)) {
			const eggData: AnimatedEgg = {
				id: i as ValidEggAmount,
				currentCFrame: new Instance("CFrameValue"),
				currentEgg: 1,
				eggModels: {
					1: eggFolder.egg.Clone(),
					2: eggFolder["egg cracked 1"].Clone(),
					3: eggFolder["egg cracked 2"].Clone(),
					4: eggFolder["egg cracked 3"].Clone(),
				},
			};

			for (const [, egg] of pairs(eggData.eggModels)) {
				setAssetProperties("egg", egg);
				egg.Parent = Workspace;
			}

			const segment = this.getSegment(params.amount, eggData.id);
			eggData.currentCFrame.Value = segment.segment0;

			this.animatedEggs.push(eggData);
		}

		this.animateEggHatches(params.amount, params.fastEnabled);
	}

	/**
	 * Displays the hatched pets.
	 *
	 * @param params The parameters used for handling the hatching animation.
	 * @param params.amount The amount of eggs to animate for hatching.
	 * @param params.eggName The name of the egg.
	 */
	public static initiatePetHatch(params: HatchEggParams): void {
		assert(params.pets, `Expected to have pets to hatch.`);

		this.petAnimationInitiated = true;

		const petFolder = ReplicatedStorage.assetObjects.pets[params.eggName];

		let currentId = 0;
		for (const pet of params.pets) {
			const petMetadata = getPetData(pet.id);
			const rarityData = RARITIES[petMetadata.rarity];

			const petModel = petFolder.FindFirstChild(petMetadata.name) as Model;
			assert(petModel, `Expected to find pet model for pet with name ${petMetadata.name}`);

			currentId += 1;
			if (!validEggEmount(currentId)) {
				throw `Expected ${currentId} to be a valid egg amount.`;
			}

			const petData: AnimatedPet = {
				id: currentId,
				petId: petMetadata.id,
				currentCFrame: new Instance("CFrameValue"),
				petModel: petModel.Clone(),
				flareDisplayed: false,
				raritySparklesDisplayed: false,
			};

			setAssetProperties("pet", petData.petModel, params.isVoid ? "void" : "regular");
			petData.petModel.Parent = Workspace;

			if (params.amount === 1) {
				petData.flare = ReplicatedStorage.assetObjects.emitters["hatching emitters"].flare.Clone();
				petData.flare.attachment.flare.Color = new ColorSequence([
					new ColorSequenceKeypoint(0, rarityData.BeginningColor),
					new ColorSequenceKeypoint(1, rarityData.EndingColor),
				]);
				petData.flare.attachment.flare.Enabled = false;
				petData.flare.attachment.flare.Lifetime = new NumberRange(1);

				if (petMetadata.rarity === "Legendary") {
					petData.raritySparkles = ReplicatedStorage.assetObjects.emitters["hatching emitters"].legendary.Clone();
					petData.raritySparkles.attachment.legendary.Enabled = false;
					petData.raritySparkles.attachment.legendary.Lifetime = new NumberRange(0.5);
					petData.raritySparkles.attachment.legendary.Rate = 17;
					petData.raritySparkles.attachment.legendary.TimeScale = 0.3;
				} else if (petMetadata.rarity === "Prismatic") {
					petData.raritySparkles = ReplicatedStorage.assetObjects.emitters["hatching emitters"].prismatic.Clone();
					petData.raritySparkles.attachment.prismatic.Enabled = false;
					petData.raritySparkles.attachment.prismatic.Lifetime = new NumberRange(0.5);
					petData.raritySparkles.attachment.prismatic.Rate = 17;
					petData.raritySparkles.attachment.prismatic.TimeScale = 0.3;
				} else if (petMetadata.rarity === "Primordial") {
					petData.raritySparkles = ReplicatedStorage.assetObjects.emitters["hatching emitters"].primordial.Clone();
					petData.raritySparkles.attachment.primordial.Enabled = false;
					petData.raritySparkles.attachment.primordial.Lifetime = new NumberRange(0.5);
					petData.raritySparkles.attachment.primordial.Rate = 17;
					petData.raritySparkles.attachment.primordial.TimeScale = 0.3;
				}
			}

			this.animatedPets.push(petData);
		}

		if (params.amount !== 1) {
			let petWithHighestRarity = 0;
			let lastRarityId = 0;
			for (const pet of this.animatedPets) {
				const petData = getPetData(pet.petId);
				const rarityData = RARITIES[petData.rarity];

				if (rarityData.id < lastRarityId) {
					continue;
				}

				lastRarityId = rarityData.id;
				petWithHighestRarity = pet.id;
			}

			const petToAddEmitters = this.animatedPets.find((pet) => pet.id === petWithHighestRarity);
			if (petToAddEmitters !== undefined) {
				const petData = getPetData(petToAddEmitters.petId);
				const rarityData = RARITIES[petData.rarity];

				petToAddEmitters.flare = ReplicatedStorage.assetObjects.emitters["hatching emitters"].flare.Clone();
				petToAddEmitters.flare.attachment.flare.Color = new ColorSequence([
					new ColorSequenceKeypoint(0, rarityData.BeginningColor),
					new ColorSequenceKeypoint(1, rarityData.EndingColor),
				]);
				petToAddEmitters.flare.attachment.flare.Enabled = false;
				petToAddEmitters.flare.attachment.flare.Lifetime = new NumberRange(1);

				if (petData.rarity === "Legendary") {
					petToAddEmitters.raritySparkles =
						ReplicatedStorage.assetObjects.emitters["hatching emitters"].legendary.Clone();
					petToAddEmitters.raritySparkles.attachment.legendary.Enabled = false;
					petToAddEmitters.raritySparkles.attachment.legendary.Lifetime = new NumberRange(0.5);
					petToAddEmitters.raritySparkles.attachment.legendary.Rate = 17;
					petToAddEmitters.raritySparkles.attachment.legendary.TimeScale = 0.3;
				} else if (petData.rarity === "Prismatic") {
					petToAddEmitters.raritySparkles =
						ReplicatedStorage.assetObjects.emitters["hatching emitters"].prismatic.Clone();
					petToAddEmitters.raritySparkles.attachment.prismatic.Enabled = false;
					petToAddEmitters.raritySparkles.attachment.prismatic.Lifetime = new NumberRange(0.5);
					petToAddEmitters.raritySparkles.attachment.prismatic.Rate = 17;
					petToAddEmitters.raritySparkles.attachment.prismatic.TimeScale = 0.3;
				} else if (petData.rarity === "Primordial") {
					petToAddEmitters.raritySparkles =
						ReplicatedStorage.assetObjects.emitters["hatching emitters"].primordial.Clone();
					petToAddEmitters.raritySparkles.attachment.primordial.Enabled = false;
					petToAddEmitters.raritySparkles.attachment.primordial.Lifetime = new NumberRange(0.5);
					petToAddEmitters.raritySparkles.attachment.primordial.Rate = 17;
					petToAddEmitters.raritySparkles.attachment.primordial.TimeScale = 0.3;
				}
			}
		}

		this.animatePetHatches(params.amount, params.fastEnabled);
	}

	/**
	 * Handles the run service connection for the animation.
	 */
	public static handleAnimation(): void {
		if (!this.canHatchEgg()) {
			return;
		}
		this.lasHatchTime = time();

		this.eggAnimationComplete = false;
		this.petAnimationComplete = false;

		this.animatedEggs = [];
		this.animatedPets = [];

		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		this.currentRenderGuid = HttpService.GenerateGUID(false);
		RunService.BindToRenderStep(this.currentRenderGuid, Enum.RenderPriority.Camera.Value + 1, () => {
			for (const eggData of this.animatedEggs) {
				eggData.eggModels[eggData.currentEgg].PivotTo(camera.GetRenderCFrame().mul(eggData.currentCFrame.Value));
			}

			if (this.eggAnimationComplete) {
				for (const eggData of this.animatedEggs) {
					for (const [, eggModel] of pairs(eggData.eggModels)) {
						eggData.currentCFrame.Destroy();
						eggModel.Destroy();
					}
				}

				this.animatedEggs = [];

				for (const petData of this.animatedPets) {
					petData.petModel.PivotTo(camera.GetRenderCFrame().mul(petData.currentCFrame.Value));

					if (!petData.flareDisplayed) {
						if (petData.flare !== undefined) {
							petData.flare.CFrame = camera.GetRenderCFrame().mul(this.tweenData.tweenData.middle.segment1);
							petData.flare.attachment.flare.Emit(10);
							petData.flareDisplayed = true;
						}
					}

					if (!petData.raritySparklesDisplayed) {
						if (petData.raritySparkles !== undefined) {
							petData.raritySparkles.CFrame = camera.GetRenderCFrame().mul(this.tweenData.tweenData.middle.segment1);

							const particleEmitter = petData.raritySparkles.attachment.FindFirstChildOfClass("ParticleEmitter");
							if (particleEmitter !== undefined) {
								particleEmitter.Emit(10);
								petData.raritySparklesDisplayed = true;
							}
						}
					}
				}

				if (this.petAnimationComplete) {
					for (const petData of this.animatedPets) {
						petData.currentCFrame.Destroy();
						petData.petModel.Destroy();

						if (petData.flare !== undefined) {
							petData.flare.Destroy();
						}
					}

					this.animatedPets = [];

					this.eggAnimationInitiated = false;
					this.petAnimationInitiated = false;

					RunService.UnbindFromRenderStep(this.currentRenderGuid);
				}
			}
		});
	}
}
