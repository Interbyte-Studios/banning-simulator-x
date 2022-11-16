import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";

import { hooks } from "../hooks";

export enum AnnouncementType {
	Error,
	Announcement,
}

export const AnnouncementContext = Roact.createContext({
	errors: identity<
		ReadonlyArray<{ message: string; messageType: AnnouncementType; id: number; displayedTime: number }>
	>([]),
	// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	addError: (message: string) => {},
});

let numberOfAnnouncements = 0;

/**
 * A context API that handles announcements.
 *
 * @param props The Roact children to display.
 * @returns A roact component.
 */
export const AnnouncementAPI = hooks((props: Roact.PropsWithChildren<{}>, { useState, useCallback, useEffect }) => {
	const [errors, setErrors] = useState<
		Array<{ message: string; messageType: AnnouncementType; id: number; displayedTime: number }>
	>([]);

	useEffect(() => {
		let lastCheck = 0;
		const connection = RunService.Heartbeat.Connect(() => {
			const now = time();
			if (now - lastCheck < 1) {
				return;
			}
			lastCheck = now;

			const filteredErrors: Array<number> = [];
			for (const errorData of errors) {
				const now = time();
				if (now - errorData.displayedTime < 5) {
					continue;
				}

				filteredErrors.push(errorData.id);
			}

			const newErrors = [...errors];
			filteredErrors.forEach((id) => {
				const errorIndex = newErrors.findIndex((errorData) => errorData.id === id);
				newErrors.remove(errorIndex);
			});
			setErrors(newErrors);
		});

		return (): void => {
			connection.Disconnect();
		};
	}, [errors]);

	/**
	 * Adds an error to the API's state.
	 *
	 * @param message The message to display.
	 * @param displayTime The time the error is displayed (defaults to 5 seconds).
	 */
	const addError = useCallback(
		(message: string): void => {
			numberOfAnnouncements += 1;

			const id = numberOfAnnouncements;
			const newErrors = [
				...errors,
				{
					message,
					messageType: AnnouncementType.Error,
					id,
					displayedTime: time(),
				},
			];

			setErrors(newErrors);
		},
		[errors, setErrors],
	);

	const contextValue = {
		errors,
		addError,
	};

	return <AnnouncementContext.Provider value={contextValue}>{props[Roact.Children]}</AnnouncementContext.Provider>;
});
