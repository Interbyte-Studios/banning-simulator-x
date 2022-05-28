import Flipper from "@rbxts/flipper";
import { Players, RunService } from "@rbxts/services";
import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";

interface HudBindingSet {
	adornee: BasePart;
	currentValue: {
		X: number;
		Y: number;
	};
	setGoal(goals: { X?: Flipper.Spring; Y?: Flipper.Spring }): void;
}

/**
 * Handles storing and using setBinding functions to animate the egg hud displays.
 */
export class eggHudAnimatorService {
	/**
	 * An array of "binding sets".
	 */
	public static bindingSets: Array<HudBindingSet> = [];

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
	private static isActive = {
		X: new Flipper.Spring(this.isActiveGoal, {
			frequency: 5,
			dampingRatio: 1,
		}),

		Y: new Flipper.Spring(this.isActiveGoal, {
			frequency: 5,
			dampingRatio: 1,
		}),
	};

	/**
	 * Expected binding values for a egg hud ui that is not displayted to the player.
	 */
	private static isDormant = {
		X: new Flipper.Spring(this.isDormantGoal, {
			frequency: 5,
			dampingRatio: 1,
		}),

		Y: new Flipper.Spring(this.isDormantGoal, {
			frequency: 4,
			dampingRatio: 0.75,
		}),
	};

	/**
	 * Starts the animator service.
	 */
	public static init(): void {
		const player = Players.LocalPlayer;

		RunService.Heartbeat.Connect(() => {
			for (const bindingSetData of this.bindingSets) {
				const magnitudeToBasePart = getMagnitudeBetweenPlayerAndObject(player, bindingSetData.adornee);
				if (magnitudeToBasePart !== undefined) {
					if (magnitudeToBasePart <= this.magnitudeRequirement) {
						if (bindingSetData.currentValue !== { X: this.isActiveGoal, Y: this.isActiveGoal }) {
							bindingSetData.setGoal(this.isActive);
						}
					} else {
						if (bindingSetData.currentValue !== { X: this.isDormantGoal, Y: this.isDormantGoal }) {
							bindingSetData.setGoal(this.isDormant);
						}
					}
				}
			}
		});
	}
}
