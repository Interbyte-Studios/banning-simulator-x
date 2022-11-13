import Roact from "@rbxts/roact";

import { hooks } from "../hooks";

export const AnnouncementContext = Roact.createContext({
	errors: identity<Array<{ message: string }>>([]),
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
	const [errors, setErrors] = useState<Array<{ message: string }>>([]);

	/**
	 * @param message The message to display.
	 * @param displayTime The time the announcement is displayed (defaults to 5 seconds).
	 */
	const addError = (message: string, displayTime?: number): void => {
		const newError = { message };
		setErrors([...errors, newError]);

		warn("setting error");

		task.delay(displayTime ?? 5, () => {
			const errorIndex = errors.findIndex((e) => e === newError);
			const newErrors = [...errors];
			newErrors.remove(errorIndex);
			setErrors(newErrors);
		});
	};

	const _errors = [...errors];

	const contextValue = {
		errors: _errors,
		addError: useCallback((message, status) => addError(message, status), []),
	};

	return <AnnouncementContext.Provider value={contextValue}>{props[Roact.Children]}</AnnouncementContext.Provider>;
});
