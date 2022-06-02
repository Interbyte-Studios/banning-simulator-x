import { HttpService, Players, ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { EggNames } from "shared/configs/eggs";
import { setAssetProperties } from "shared/util/setAssetProperties";

const player = Players.LocalPlayer;

type ValidAmount = 1 | 2 | 3;
type ValidEggId = 1 | 2 | 3 | 4;

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

interface TweenDataDoc {
	tweenInfo: {
		segment1: TweenInfo;
		segment2: TweenInfo;
		segment3: TweenInfo;
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
		},
		tweenData: {
			middle: {
				segment0: new CFrame(0, 7.5, -6.75),
				segment1: new CFrame(0, 0, -6.75),
				segment2: new CFrame(0, 0, -5.75).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(0, 0, -5).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
			left: {
				segment0: new CFrame(-4.5, 7.5, -7.75),
				segment1: new CFrame(-4.5, 0, -7.75),
				segment2: new CFrame(-4.5, 0, -6.75).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(-4.5, 0, -6).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
			right: {
				segment0: new CFrame(4.5, 7.5, -7.75),
				segment1: new CFrame(4.5, 0, -7.75),
				segment2: new CFrame(4.5, 0, -6.75).mul(CFrame.Angles(0, 0, math.rad(25))),
				segment3: new CFrame(4.5, 0, -6).mul(CFrame.Angles(0, 0, math.rad(-23.5))),
			},
		},
	};

	/**
	 * The timestamp at which the player last hatched eggs.
	 */
	private static lastHatchTime = 0;

	/**
	 * The amount of time a player must wait before attempting hatching again.
	 */
	private static hatchTimeLimit = 3.5;

	/**
	 * The render guid for the animation currently being displayed.
	 */
	private static currentRenderGuid: string;

	/**
	 * Documents whether or not the egg animation has been completed.
	 */
	private static eggAnimationComplete = false;

	/**
	 * Documents whether or not the pet animation has been completed.
	 */
	private static petAnimationComplete = false;

	/**
	 * Gets the position that an egg should be at during a certain segment depending on its id.
	 *
	 * @param amount The amount of eggs being animated.
	 * @param id The id of the egg.
	 * @returns The segment containing CFrames for egg positions.
	 */
	private static getEggSegment(amount: ValidAmount, id: ValidEggId): TweenDataDoc["tweenData"]["middle"] {
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
	 * @param animatedEggs An array of eggData containing all the metadata necessary to animate them.
	 * @param amount The amount of eggs being hatched.
	 */
	private static animateEggHatches(animatedEggs: Array<AnimatedEgg>, amount: ValidAmount): void {
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
			const segment = AnimateEggs.getEggSegment(amount, eggData.id);

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
		for (const eggData of animatedEggs) {
			task.spawn(() => {
				animateEggSegment(eggData, "segment1");
				task.wait(0.5);

				animateEggSegment(eggData, "segment2", true);
				task.wait(0.35);

				animateEggSegment(eggData, "segment3", true);

				const segment = this.getEggSegment(amount, eggData.id);

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
	 * Hatches eggs upon request.
	 *
	 * @param amount The amount of eggs to animate for hatching.
	 * @param eggName The name of the egg.
	 * @param pets The pets being hatched.
	 * @param isVoid Whether or not the pets are void.
	 */
	public static hatchEggs(amount: ValidAmount, eggName: EggNames, pets: Array<number>, isVoid: boolean): void {
		const now = time();
		if (now - this.lastHatchTime < this.hatchTimeLimit) return;
		this.lastHatchTime = now;

		const character = player.Character;
		assert(character, `No character found for player ${player.Name}`);

		const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
		assert(humanoid, `No Humanoid found for player ${player.Name}`);

		const humanoidRootPart = humanoid.RootPart;
		assert(humanoidRootPart, `No HumanoidRootPart found for player ${player.Name}`);

		const camera = Workspace.CurrentCamera ?? Workspace.GetPropertyChangedSignal("CurrentCamera").Wait()[0];

		const eggFolder = ReplicatedStorage.assetObjects.eggs[eggName][isVoid ? "void" : "regular"];

		const animatedEggs: Array<AnimatedEgg> = [];
		this.eggAnimationComplete = false;
		this.petAnimationComplete = false;

		for (let i = 1; i <= amount; i++) {
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

			const segment = this.getEggSegment(amount, eggData.id);
			eggData.currentCFrame.Value = segment.segment0;

			animatedEggs.push(eggData);
		}

		this.currentRenderGuid = HttpService.GenerateGUID(false);
		RunService.BindToRenderStep(this.currentRenderGuid, Enum.RenderPriority.Camera.Value + 1, () => {
			for (const eggData of animatedEggs) {
				eggData.eggModels[eggData.currentEgg].SetPrimaryPartCFrame(
					camera.GetRenderCFrame().mul(eggData.currentCFrame.Value),
				);
			}

			if (this.eggAnimationComplete) {
				RunService.UnbindFromRenderStep(this.currentRenderGuid);
			}
		});

		this.animateEggHatches(animatedEggs, amount);
	}
}
