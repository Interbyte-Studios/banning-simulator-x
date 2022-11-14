import Roact from "@rbxts/roact";

import { hooks } from "../hooks";

export enum AnnouncementType {
	Error,
	Announcement,
}

export const AnnouncementContext = Roact.createContext({
	errors: identity<ReadonlyArray<{ message: string; messageType: AnnouncementType; id: number }>>([]),
	// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
	addError: (message: string, displayTime?: number) => {},
});

/**
 * A context API that handles announcements.
 *
 * @param props The Roact children to display.
 * @returns A roact component.
 */
export const AnnouncementAPI = hooks((props: Roact.PropsWithChildren<{}>, { useState, useCallback }) => {
	const [errors, setErrors] = useState<Array<{ message: string; messageType: AnnouncementType; id: number }>>([]);
	warn(errors);

	/**
	 * Adds an error to the API's state.
	 *
	 * @param message The message to display.
	 * @param displayTime The time the error is displayed (defaults to 5 seconds).
	 */
	const addError = useCallback(
		(message: string, displayTime?: number): void => {
			const newErrors = [
				...errors,
				{
					message,
					messageType: AnnouncementType.Error,
					id: errors.size(),
				},
			];

			warn("new error added");
			setErrors(newErrors);

			/*
		task.delay(displayTime ?? 5, () => {
			const errorIndex = errors.findIndex((e) => e.id === numberOfAnnouncements);
			const newErrors = [...errors];
			newErrors.remove(errorIndex);
			setErrors(newErrors);
		});
		*/
		},
		[errors, setErrors],
	);

	const contextValue = {
		errors,
		addError,
	};

	return <AnnouncementContext.Provider value={contextValue}>{props[Roact.Children]}</AnnouncementContext.Provider>;
});
