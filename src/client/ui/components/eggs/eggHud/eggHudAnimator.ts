import Flipper from "@rbxts/flipper";
import { Players, RunService } from "@rbxts/services";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";

type HudMotor = Flipper.GroupMotor<{ X: number; Y: number }>;

interface HudBindingSet {
	adornee: BasePart;
	motor: HudMotor;
}

/**
 * Handles storing and using setBinding functions to animate the egg hud displays.
 */
export class eggHudAnimator {
	/**
	 * An array of motors connected to egg hud ui's.
	 */
	private static motorSets: Array<HudBindingSet> = [];

	/**
	 * The configuration for flipper motors.
	 */
	private static motorConfig = {
		frequency: 5,
		dampingRatio: 1,
	};

	/**
	 * The required magnitude between the player's position and the egg hud adornee's position in order to display an egg hud UI.
	 */
	private static magnitudeRequirement = 15;

	/**
	 * The set goal for when the egg hud ui is active [flipper reference].
	 */
	private static isActiveGoal = 1;

	/**
	 * The set goal for when the egg hud ui is dormant [flipper reference].
	 */
	private static isDormantGoal = 0;

	/**
	 * Expected binding values for a egg hud ui that is displayed to the player.
	 */
	private static isActive = new Flipper.Spring(eggHudAnimator.isActiveGoal, eggHudAnimator.motorConfig);

	/**
	 * Expected binding values for a egg hud ui that is not displayted to the player.
	 */
	private static isDormant = new Flipper.Spring(eggHudAnimator.isDormantGoal, eggHudAnimator.motorConfig);

	/**
	 * Adds a motor to the array of active motors.
	 *
	 * @param adornee The part associated with the hud that the motor handles animation values for (for checking distance).
	 * @param motor The motor to add to the registry.
	 */
	public static addMotor(adornee: BasePart, motor: HudMotor): void {
		this.motorSets.push({
			adornee: adornee,
			motor: motor,
		});
	}

	/**
	 * Removes a motor from the array of active motors.
	 *
	 * @param adornee The part associated with the hud that the motor handles animation values for.
	 */
	public static removeMotors(adornee: BasePart): void {
		const motorIndex = this.motorSets.findIndex((x) => x.adornee === adornee);
		assert(motorIndex !== -1, `Attempt to destroy motor that did not exist with adornee ${adornee.GetFullName()}`);

		const motor = this.motorSets[motorIndex];
		motor.motor.destroy();
		this.motorSets.unorderedRemove(motorIndex);
	}

	/**
	 * Clears all the motors from the active motors array.
	 */
	public static clearMotors(): void {
		for (const motor of this.motorSets) {
			motor.motor.destroy();
		}

		this.motorSets.clear();
	}

	private static cleanupTasks: Array<() => void> = [];

	/**
	 * Starts the animator service.
	 */
	public static init(): void {
		const player = Players.LocalPlayer;

		const connection = RunService.Heartbeat.Connect(() => {
			if (player.Character === undefined) {
				return;
			}

			for (const bindingSetData of this.motorSets) {
				const magnitudeToBasePart = getMagnitudeBetweenPlayerAndObject(player.Character, bindingSetData.adornee);
				if (magnitudeToBasePart !== undefined) {
					if (magnitudeToBasePart <= this.magnitudeRequirement) {
						if (bindingSetData.motor.getValue() !== { X: this.isActiveGoal, Y: this.isActiveGoal }) {
							bindingSetData.motor.setGoal({
								X: this.isActive,
								Y: this.isActive,
							});
						}
					} else {
						if (bindingSetData.motor.getValue() !== { X: this.isDormantGoal, Y: this.isDormantGoal }) {
							bindingSetData.motor.setGoal({
								X: this.isDormant,
								Y: this.isDormant,
							});
						}
					}
				}
			}
		});

		this.cleanupTasks.push(() => connection.Disconnect());
	}

	/**
	 * Cleans up the animator.
	 */
	public static destroy(): void {
		this.cleanupTasks.forEach((task) => task());

		// clear motors
		this.clearMotors();
	}
}
