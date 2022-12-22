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
	addAnnouncement: (message: string, messageType: AnnouncementType) => {},
});

let numberOfAnnouncements = 0;
let lastCheck = 0;

/**
 * A context API that handles announcements.
 *
 * @param props The Roact children to display.
 * @returns A roact component.
 */
export const AnnouncementAPI = hooks(
	(props: Roact.PropsWithChildren<{}>, { useState, useCallback, useEffect, useValue }) => {
		const [errors, setErrors] = useState<
			Array<{ message: string; messageType: AnnouncementType; id: number; displayedTime: number }>
		>([]);

		const mounted = useValue(false);
		useEffect(() => {
			mounted.value = true;

			return (): void => {
				mounted.value = false;
			};
		}, []);

		useEffect(() => {
			const connection = RunService.RenderStepped.Connect(() => {
				if (mounted.value === false) {
					return;
				}

				const now = time();
				if (now - lastCheck < 1) {
					return;
				}
				lastCheck = now;

				let requiresUpdate = false;

				const newErrors = [...errors];
				for (const errorData of newErrors) {
					const now = time();
					if (now - errorData.displayedTime < 5) {
						continue;
					}

					requiresUpdate = true;

					const errorIndex = newErrors.findIndex((eData) => eData.id === errorData.id);
					newErrors.remove(errorIndex);
				}

				if (!requiresUpdate) {
					return;
				}

				if (mounted.value) {
					setErrors(newErrors);
				}
			});

			return (): void => connection.Disconnect();
		}, []);

		/**
		 * Adds an error to the API's state.
		 *
		 * @param message The message to display.
		 * @param displayTime The time the error is displayed (defaults to 5 seconds).
		 */
		const addAnnouncement = useCallback(
			(message: string, messageType: AnnouncementType): void => {
				numberOfAnnouncements += 1;

				const id = numberOfAnnouncements;
				const newErrors = [
					...errors,
					{
						message,
						messageType,
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
			addAnnouncement,
		};

		return <AnnouncementContext.Provider value={contextValue}>{props[Roact.Children]}</AnnouncementContext.Provider>;
	},
);
