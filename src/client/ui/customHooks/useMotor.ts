// reference: https://github.com/Reselim/roact-flipper/blob/master/src/useMotor.lua

import { GroupMotor, SingleMotor } from "@rbxts/flipper";
import { CoreHooks } from "@rbxts/roact-hooks";

type SingleMotorParam = ConstructorParameters<typeof SingleMotor>[0];
type GroupMotorParam = ConstructorParameters<typeof GroupMotor>[0];
export type MotorInitialValue = SingleMotorParam | GroupMotorParam;
export type Motor<T extends MotorInitialValue> = T extends SingleMotorParam ? SingleMotor : GroupMotor<T>;

/**
 * @param initialValue The initial value of the motor.
 * @returns The motor that is created.
 */
function createMotor<T extends MotorInitialValue>(initialValue: T): Motor<T> {
	if (typeIs(initialValue, "number")) {
		return new SingleMotor(initialValue) as Motor<T>;
	} else {
		return new GroupMotor(initialValue) as Motor<T>;
	}
}

/**
 * @param hooks The Roact hooks object.
 * @param initialValue The initial value for the motor.
 * @returns The created motor, which is cached.
 */
export function useMotor<T extends MotorInitialValue>(hooks: CoreHooks, initialValue: T): Motor<T> {
	const isFirstUse = hooks.useValue(false);
	const motor = hooks.useValue(createMotor(initialValue)).value;

	// handle motor cleanup
	if (!isFirstUse.value) {
		isFirstUse.value = true;
		hooks.useEffect(() => {
			return () => {
				motor.destroy();
			};
		}, []);
	}

	return motor;
}
