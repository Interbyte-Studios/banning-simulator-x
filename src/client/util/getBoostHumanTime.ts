import { ValidBoostTime } from "shared/rodux/boosts";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

/**
 * Converts a numeric boost time in minutes to a human understandable length.
 *
 * @param boostTime The amount of minutes the boost will last.
 * @returns The human readable time.
 */
export function getBoostHumanTime(boostTime: ValidBoostTime): string {
	switch (boostTime) {
		case 15: {
			return "15m";
		}
		case 30: {
			return "30m";
		}
		case 60: {
			return "1h";
		}
		case 120: {
			return "2h";
		}
		default:
			throw new UnreachableCaseError(boostTime);
	}
}
