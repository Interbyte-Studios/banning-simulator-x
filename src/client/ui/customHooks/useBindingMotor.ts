import { Binding } from "@rbxts/roact";
import { CoreHooks } from "@rbxts/roact-hooks";

import { Motor, MotorInitialValue, useMotor } from "./useMotor";

const assignedMotorKey = {} as symbol;

/**
 * @param hooks The Roact hooks object.
 * @param initialValue The initial value of the motor.
 * @returns An object containing the motor and binding.
 */
export function useBindingMotor<T extends MotorInitialValue>(
	hooks: CoreHooks,
	initialValue: T,
): { motor: Motor<T>; binding: Binding<T> } {
	const motor = useMotor(hooks, initialValue);
	const [value, setValue] = hooks.useBinding(motor.getValue());

	if (motor[assignedMotorKey as keyof typeof motor] !== undefined) {
		return {
			motor,
			binding: motor[assignedMotorKey as keyof typeof motor] as Binding<T>,
		};
	}

	motor.onStep(setValue);
	(motor as unknown as { [index: typeof assignedMotorKey]: Binding<T> })[assignedMotorKey] = value as Binding<T>;

	return {
		motor,
		binding: value as Binding<T>,
	};
}
