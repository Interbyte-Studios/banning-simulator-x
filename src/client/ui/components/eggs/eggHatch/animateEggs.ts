import { HttpService, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { playEffect, SoundEffect } from "client/util/playSound";
import { EggName, hatchDebounce } from "shared/configs/eggs";
import { ConfirmedPet, ValidEggAmount } from "shared/remotes/eggs/hatchEgg";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";

type ValidEggId = 1 | 2 | 3 | 4;

export interface HatchEggParams {
	amount: ValidEggAmount;
	eggName: EggName;
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
	currentCFrame: CFrameValue;
	flareLifetime: NumberValue;
	flare: typeof ReplicatedStorage.assetObjects.hatch;
	petModel: Model;
}

interface TweenDataDoc {
	tweenInfo: {
		segment1: TweenInfo;
		segment2: TweenInfo;
		segment3: TweenInfo;
		pets: TweenInfo;
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
			segment1: new TweenInfo(1, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
			segment2: new TweenInfo(0.3, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
			segment3: new TweenInfo(0.3, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out),
			pets: new TweenInfo(0.5, Enum.EasingStyle.Sine, Enum.EasingDirection.Out),
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
	 */
	private static animateEggHatches(amount: ValidEggAmount): void {
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

			const animation = TweenService.Create(eggData.currentCFrame, AnimateEggs.tweenData.tweenInfo[_segment], {
				Value: segment[_segment],
			});

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
				playEffect(SoundEffect.HatchImpact_1);
				animateEggSegment(eggData, "segment1");
				task.wait(0.5);

				playEffect(SoundEffect.HatchImpact_2);
				animateEggSegment(eggData, "segment2", true);
				task.wait(0.35);

				playEffect(SoundEffect.HatchImpact_1);
				animateEggSegment(eggData, "segment3", true);

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
					playEffect(SoundEffect.HatchImpact_2);
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
	 */
	private static animatePetHatches(amount: ValidEggAmount): void {
		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		let amountComplete = 0;
		for (const petData of this.animatedPets) {
			task.spawn(() => {
				const segment = this.getSegment(amount, petData.id);

				petData.flare.Parent = Workspace;

				task.delay(0.15, () => {
					TweenService.Create(
						petData.flareLifetime,
						new TweenInfo(0.85, Enum.EasingStyle.Linear, Enum.EasingDirection.Out),
						{
							Value: 0,
						},
					).Play();
				});

				petData.petModel.SetPrimaryPartCFrame(camera.GetRenderCFrame().mul(segment.segment1));
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

				const animation = TweenService.Create(petData.currentCFrame, this.tweenData.tweenInfo.pets, {
					Value: segment.segment1.mul(CFrame.Angles(0, math.rad(180), math.rad(rotationDegrees))),
				});

				animation.Play();
				animation.Completed.Wait();
				task.wait(0.5);

				amountComplete += 1;
			});
		}
		playEffect(SoundEffect.HatchReveal);

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

		this.animateEggHatches(params.amount);
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
			const petMetadata = getPetData(params.eggName, pet.id);

			const petModel = petFolder.FindFirstChild(petMetadata.name) as Model;
			assert(petModel, `Expected to find pet model for pet with name ${petMetadata.name}`);

			currentId += 1;
			const petData: AnimatedPet = {
				id: currentId as ValidEggAmount,
				currentCFrame: new Instance("CFrameValue"),
				flareLifetime: new Instance("NumberValue"),
				flare: ReplicatedStorage.assetObjects.hatch.Clone(),
				petModel: petModel.Clone(),
			};

			setAssetProperties("pet", petData.petModel, params.isVoid);
			petData.petModel.Parent = Workspace;

			petData.flareLifetime.Value = 0.75;

			this.animatedPets.push(petData);
		}

		this.animatePetHatches(params.amount);
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
				eggData.eggModels[eggData.currentEgg].SetPrimaryPartCFrame(
					camera.GetRenderCFrame().mul(eggData.currentCFrame.Value),
				);
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
					petData.petModel.SetPrimaryPartCFrame(camera.GetRenderCFrame().mul(petData.currentCFrame.Value));
					petData.flare.CFrame = petData.petModel.GetPrimaryPartCFrame();
					petData.flare.attachment.flare.Lifetime = new NumberRange(petData.flareLifetime.Value);
				}

				if (this.petAnimationComplete) {
					for (const petData of this.animatedPets) {
						petData.currentCFrame.Destroy();
						petData.flareLifetime.Destroy();
						petData.petModel.Destroy();
						petData.flare.Destroy();
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
