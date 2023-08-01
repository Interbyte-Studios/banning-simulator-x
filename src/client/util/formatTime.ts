/**
 *
 * @param int Number.
 * @returns String.
 */
function format(int: number): string {
	return string.format("%02i", int);
}

/**
 *
 * @param seconds The amount of seconds.
 * @returns The seconds converted to a formatted time.
 */
export function formatTime(seconds: number): string {
	debug.setmemorycategory("formatTime");
	let minutes = (seconds - (seconds % 60)) / 60;
	seconds -= minutes * 60;

	let hours = (minutes - (minutes % 60)) / 60;
	minutes -= hours * 60;

	const days = (hours - (hours % 24)) / 24;
	hours -= days * 24;

	const daysText = days > 0 ? format(days) + "d:" : "";
	const hoursText = hours > 0 ? format(hours) + "h:" : "";
	const minutesText = minutes > 0 ? format(minutes) + "m:" : "";

	return daysText + hoursText + minutesText + format(seconds) + "s";
}
