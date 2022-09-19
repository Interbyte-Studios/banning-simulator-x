import { HttpService } from "@rbxts/services";
import { VerifyDiscordFailKind } from "shared/remotes/media/verifyDiscord";
import { Store } from "shared/rodux";
import { verifyDiscord } from "shared/rodux/media";
import { verifyDiscordTag } from "shared/util/verifyDiscordTag";

const debounceCache: Map<number, number> = new Map();

/**
 * Verifies that a user is in our discord server.
 *
 * @param player The player to verify.
 * @param store The player store.
 * @param tag The tag to verify.
 * @returns Whether or not the user was in our discord.
 */
export function checkDiscordVerification(
	player: Player,
	store: Store,
	tag: string,
): { success: true } | { success: false; reason: VerifyDiscordFailKind } {
	// verify that the user isn't spamming requests
	const playerDebounceCache = debounceCache.get(player.UserId);
	const now = time();
	if (playerDebounceCache !== undefined) {
		if (now - playerDebounceCache < 5) {
			return { success: false, reason: VerifyDiscordFailKind.RateLimit };
		}
		debounceCache.set(player.UserId, now);
	} else {
		debounceCache.set(player.UserId, now);
	}

	// verify that the discord tag is valid
	const checkTagValidity = verifyDiscordTag(tag);
	if (!checkTagValidity.success) {
		return {
			success: false,
			reason: checkTagValidity.reason,
		};
	}

	// make request to server
	const [verificationSuccess, verificationResponse] = pcall(() =>
		HttpService.RequestAsync({
			Url: `http://78.108.218.96:25980`,
			Method: "POST",
			Headers: {
				["Content-Type"]: "application/json",
			},
			Body: HttpService.JSONEncode({
				DiscordTag: tag,
			}),
		}),
	);

	if (!(verificationSuccess && verificationResponse.Body !== "Internal Error")) {
		return {
			success: false,
			reason: VerifyDiscordFailKind.InternalError,
		};
	}

	switch (verificationResponse.Body) {
		case "User found!": {
			store.dispatch(verifyDiscord());

			return {
				success: true,
			};
		}
		case "User not found!": {
			return {
				success: false,
				reason: VerifyDiscordFailKind.NotInDiscord,
			};
		}
		default: {
			return {
				success: false,
				reason: VerifyDiscordFailKind.InternalError,
			};
		}
	}
}
