/**
 * Loops through all children of `instance` until it finds a child which has a name of `child` and passes an IsA call from `className`.
 *
 * @param instance The Instance to find the child of.
 * @param child The name of the child to search for.
 * @param className The type of the child (This is used in `IsA`).
 * @returns The child, if it was found.
 */
export function findFirstChildByNameWhichIsA<T extends keyof Instances>(
	instance: Instance,
	child: string,
	className: T,
): Instances[T] | undefined {
	// first scan by name
	const cachedFindByName = instance.FindFirstChild(child);
	if (cachedFindByName && cachedFindByName.IsA(className)) {
		return cachedFindByName;
	}

	// second scan by IsA
	const cachedFindByClass = instance.FindFirstChildWhichIsA(className);
	if (cachedFindByName && cachedFindByName.Name === child) {
		return cachedFindByClass;
	}

	// slow loop find
	for (const instanceChild of instance.GetChildren()) {
		if (instanceChild.Name === child && instanceChild.IsA(className)) {
			return instanceChild;
		}
	}

	return;
}
