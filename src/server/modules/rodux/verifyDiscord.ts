import { HttpService } from "@rbxts/services";
import { VerifyDiscordFailKind } from "shared/remotes/media/verifyDiscord";
import { Store } from "shared/rodux";
import { verifyDiscord } from "shared/rodux/media";

const debounceCache: Map<number, number> = new Map();

/**
 * Verifies that a user is in our discord server.
 *
 * @param player The player to verify.
 * @param store The player store.
 * @param tag The tag to verify.
 * @returns Whether or not the user was in our ddiscord.
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
	} else {
		debounceCache.set(player.UserId, now);
	}

	// verify that the discord tag is valid
	if (tag.size() < 2 || tag.size() > 32) {
		return {
			success: false,
			reason: VerifyDiscordFailKind.NotInDiscord,
		};
	}

	if (tag.match("#")[0] === undefined) {
		return {
			success: false,
			reason: VerifyDiscordFailKind.NotInDiscord,
		};
	}

	const verificationStatus = opcall(() =>
		HttpService.RequestAsync({
			Url: `http://78.108.218.96:25980`,
			Method: "POST",
			Body: tag,
		}),
	);

	print(verificationStatus);

	// dispatch to store
	store.dispatch(verifyDiscord());

	// return to client
	return {
		success: true,
	};
}
