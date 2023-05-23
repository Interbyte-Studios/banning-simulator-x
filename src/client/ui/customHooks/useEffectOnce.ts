import RoactHooks from "@rbxts/roact-hooks";

/**
 * Runs a callback once.
 *
 * @param callback The callback to run once.
 * @param hooks The Roact hooks object.
 */
export const useEffectOnce = (callback: () => void | (() => void), hooks: RoactHooks.CoreHooks): void => {
	hooks.useEffect(() => {
		const cleanup = callback();
		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	}, []);
};
