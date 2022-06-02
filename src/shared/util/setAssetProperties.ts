/**
 * Sets the properties of an asset object<model> depending on the type of asset it is.
 *
 * @param assetType The type of asset to set properties for.
 * @param assetObject The object<model>.
 */
export function setAssetProperties(assetType: "egg" | "pet", assetObject: Model): void {
	switch (assetType) {
		case "egg": {
			for (const child of assetObject.GetChildren()) {
				if (!child.IsA("BasePart")) continue;

				if (assetObject.PrimaryPart === undefined && child.Name === "Primary") {
					assetObject.PrimaryPart = child;
				}

				child.CanCollide = false;
				child.Anchored = true;
			}

			assert(assetObject.PrimaryPart, `No PrimaryPart set for ${assetObject.Name}`);
			break;
		}
		case "pet": {
			throw `Not implemented.`;
		}
	}
}
