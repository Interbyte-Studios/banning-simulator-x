import { a } from "@rbxts/fitumi";

/**
 * Creates a mock Player object.
 *
 * @returns The mocked player.
 */
export function useMockPlayer(): Player {
	const player = a.fake<Player>();

	const attributeCache: Map<string, AttributeValue> = new Map();

	player.Character = undefined;

	// implement attribute function with cache

	// eslint-disable-next-line jsdoc/require-jsdoc
	player.SetAttribute = (attribute, value): void => {
		if (value === undefined) {
			attributeCache.delete(attribute);
		} else {
			attributeCache.set(attribute, value);
		}
	};

	// eslint-disable-next-line jsdoc/require-jsdoc
	player.GetAttribute = (attribute): AttributeValue | undefined => attributeCache.get(attribute);

	return player;
}
