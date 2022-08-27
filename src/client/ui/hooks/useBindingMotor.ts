import { Binding } from "@rbxts/roact";
import { CoreHooks } from "@rbxts/roact-hooks";

import { Motor, MotorInitialValue, useMotor } from "./useMotor";

/**
 * @param hooks The Roact hooks object.
 * @param initialValue The initial value of the motor.
 * @returns An object containing the motor and binding.
 */
export function useBindingMotor<T extends MotorInitialValue>(
	hooks: CoreHooks,
	initialValue: T,
): { motor: Motor<T>; binding: Binding<T> } {
	const isFirstUse = hooks.useValue(false);
	const motor = useMotor(hooks, initialValue);
	const [value, setValue] = hooks.useBinding(motor.getValue());

	if (!isFirstUse.value) {
		isFirstUse.value = true;
		motor.onStep(setValue);
	}

	return {
		motor,
		binding: value as Binding<T>,
	};
}
