import { HttpService, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { canHatchEgg } from "client/eggs/canHatchEgg";
import { EggNames } from "shared/configs/eggs";
import { getPetData } from "shared/util/getPetData";
import { setAssetProperties } from "shared/util/setAssetProperties";

type ValidAmount = 1 | 2 | 3;
type ValidEggId = 1 | 2 | 3 | 4;

export interface HatchEggParams {
	amount: ValidAmount;
	eggName: EggNames;
	pets?: Array<number>;
	isVoid: boolean;
}

interface AnimatedEgg {
	id: ValidAmount;
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
	id: ValidAmount;
	currentCFrame: CFrameValue;
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
	 * Documents whether or not the egg animation has been completed.
	 */
	private static eggAnimationComplete = true;

	/**
	 * Documents whether or not the pet animation has been completed.
	 */
	private static petAnimationComplete = true;

	/**
	 * An array of egg metadata currently being used to animate an egg hatch.
	 */
	private static animatedEggs: Array<AnimatedEgg> = [];

	/**
	 * An array of pet metadata currently being used to animate an egg hatch.
	 */
	private static animatedPets: Array<AnimatedPet> = [];

	/**
	 * Gets the position that an egg should be at during a certain segment depending on its id.
	 *
	 * @param amount The amount of eggs being animated.
	 * @param id The id of the egg.
	 * @returns The segment containing CFrames for egg positions.
	 */
	private static getSegment(amount: ValidAmount, id: ValidEggId): TweenDataDoc["tweenData"]["middle"] {
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
	private static animateEggHatches(amount: ValidAmount): void {
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

				eggData.currentEgg += 1;
				eggData.eggModels[(eggData.currentEgg - 1) as ValidEggId].SetPrimaryPartCFrame(new CFrame(0, 0, 0));
				eggData.eggModels[(eggData.currentEgg - 1) as ValidEggId].Parent = undefined;
			}
		}

		let amountComplete = 0;
		for (const eggData of this.animatedEggs) {
			task.spawn(() => {
				animateEggSegment(eggData, "segment1");
				task.wait(0.5);

				animateEggSegment(eggData, "segment2", true);
				task.wait(0.35);

				animateEggSegment(eggData, "segment3", true);

				const segment = this.getSegment(amount, eggData.id);

				const duration = 1;
				let timeStamp = 0;
				let spin = 0;
				while (timeStamp < 1) {
					spin += 0.35;

					const deltaTime = RunService.RenderStepped.Wait();

					timeStamp = math.min(timeStamp + deltaTime[0] / duration, 1);
					const alpha = TweenService.GetValue(timeStamp, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);

					const shookTween = eggData.currentCFrame.Value.Lerp(segment.segment1.mul(CFrame.Angles(0, spin, 0)), alpha);
					eggData.currentCFrame.Value = shookTween;
				}

				eggData.eggModels[eggData.currentEgg].SetPrimaryPartCFrame(new CFrame(0, 0, 0));
				eggData.eggModels[eggData.currentEgg].Parent = undefined;

				amountComplete += 1;
			});
		}

		while (amountComplete !== 3) {
			RunService.RenderStepped.Wait();
		}

		this.eggAnimationComplete = true;
	}

	/**
	 * Handles the animation for pet display.
	 *
	 * @param amount The amount of pets being displayed.
	 */
	private static animatePetHatches(amount: ValidAmount): void {
		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		let amountComplete = 0;
		for (const petData of this.animatedPets) {
			task.spawn(() => {
				const segment = this.getSegment(amount, petData.id);

				petData.petModel.SetPrimaryPartCFrame(camera.GetRenderCFrame().mul(segment.segment1));
				petData.currentCFrame.Value = segment.segment3;

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

		while (amountComplete !== 3) {
			RunService.RenderStepped.Wait();
		}

		this.petAnimationComplete = true;
	}

	/**
	 * Hatches eggs upon request.
	 *
	 * @param params The parameters used for handling the hatching animation.
	 * @param params.amount The amount of eggs to animate for hatching.
	 * @param params.eggName The name of the egg.
	 */
	public static hatchEggs(params: HatchEggParams): void {
		const eggFolder = ReplicatedStorage.assetObjects.eggs[params.eggName][params.isVoid ? "void" : "regular"];

		for (let i = 1; i <= params.amount; i++) {
			const eggData: AnimatedEgg = {
				id: i as ValidAmount,
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
	 * @param params The parameters used for handling the hatching animation.
	 * @param params.amount The amount of eggs to animate for hatching.
	 * @param params.eggName The name of the egg.
	 * @param params.pets The pets being hatched.
	 */
	public static hatchPets(params: HatchEggParams): void {
		if (params.pets === undefined) return;

		const petFolder = ReplicatedStorage.assetObjects.pets[params.eggName];

		let currentId = 0;
		for (const pet of params.pets) {
			const petMetadata = getPetData(params.eggName, pet);

			const petModel = petFolder.FindFirstChild(petMetadata.petName) as Model;
			assert(petModel, `Expected to find pet model for pet with name ${petMetadata.petName}`);

			currentId += 1;
			const petData: AnimatedPet = {
				id: currentId as ValidAmount,
				currentCFrame: new Instance("CFrameValue"),
				petModel: petModel.Clone(),
			};

			setAssetProperties("pet", petData.petModel, params.isVoid);
			petData.petModel.Parent = Workspace;

			this.animatedPets.push(petData);
		}

		this.animatePetHatches(params.amount);
	}

	/**
	 * Handles the run service connection for the animation.
	 */
	public static handleAnimation(): void {
		if (!this.eggAnimationComplete || !this.petAnimationComplete) return;

		const canHatch = canHatchEgg();
		if (canHatch === false) return;

		this.eggAnimationComplete = false;
		this.petAnimationComplete = false;

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
						eggModel.Destroy();
					}
				}

				this.animatedEggs = [];

				for (const petData of this.animatedPets) {
					if (petData.petModel.PrimaryPart === undefined) {
						warn(`No primary part for animated pet.`);
						continue;
					}

					petData.petModel.SetPrimaryPartCFrame(camera.GetRenderCFrame().mul(petData.currentCFrame.Value));
				}

				if (this.petAnimationComplete) {
					for (const petData of this.animatedPets) {
						petData.petModel.Destroy();
					}

					this.animatedPets = [];

					RunService.UnbindFromRenderStep(this.currentRenderGuid);
				}
			}
		});

		for (const eggData of this.animatedEggs) {
			for (const [, eggModel] of pairs(eggData.eggModels)) {
				eggModel.Destroy();
			}
		}
	}
}
