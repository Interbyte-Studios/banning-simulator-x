import { VerifyDiscordFailKind } from "shared/remotes/media/verifyDiscord";

/**
 * Verifies that a given string meets the criteria to be considered a valid Discord tag.
 *
 * @param tag The tag to verify.
 * @returns Whether or not the tag is valid.
 */
export function verifyDiscordTag(tag: string): { success: true } | { success: false; reason: VerifyDiscordFailKind } {
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

	if (string.split(tag, "#")[1].size() !== 4) {
		return {
			success: false,
			reason: VerifyDiscordFailKind.NotInDiscord,
		};
	}

	if (string.split(tag, "#")[0].size() < 2 || string.split(tag, "#")[0].size() > 32) {
		return {
			success: false,
			reason: VerifyDiscordFailKind.NotInDiscord,
		};
	}

	return {
		success: true,
	};
}
