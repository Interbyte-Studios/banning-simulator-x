import { CollectionService } from "@rbxts/services";
import { TAG_CONFIG } from "shared/configs/pets";

import { weldObject } from "./weldObject";

export type ValidAssetType = "egg" | "pet" | "talisman" | "weapon";

/**
 * Sets the properties of an asset object<model> depending on the type of asset it is.
 *
 * @param assetType The type of asset to set properties for.
 * @param assetObject The object<model>.
 * @param isVoid Whether or not the asset is a void asset.
 */
export function setAssetProperties(assetType: ValidAssetType, assetObject: Model | Tool, isVoid?: boolean): void {
	switch (assetType) {
		case "egg": {
			if (!assetObject.IsA("Model")) {
				throw `Expected egg: "${assetObject.Name}" to be a Model`;
			}

			for (const child of assetObject.GetChildren()) {
				if (!child.IsA("BasePart")) continue;

				if (assetObject.PrimaryPart === undefined && child.Name === "Primary") {
					assetObject.PrimaryPart = child;
				}

				child.CanCollide = false;
				child.Anchored = true;
				child.Name = "meshPart";
			}

			assert(assetObject.PrimaryPart, `No PrimaryPart set for ${assetObject.Name}`);
			assetObject.PrimaryPart.Name = "Primary";

			break;
		}
		case "pet": {
			if (!assetObject.IsA("Model")) {
				throw `Expected pet: "${assetObject.Name}" to be a Model`;
			}

			for (const child of assetObject.GetChildren()) {
				if (!child.IsA("BasePart")) continue;

				if (assetObject.PrimaryPart === undefined && child.Name === "Primary") {
					assetObject.PrimaryPart = child;
				}

				child.CanCollide = false;
				child.Anchored = false;
				child.Name = "meshPart";

				if (child.IsA("MeshPart")) {
					child.Massless = true;
				}

				if (isVoid) {
					const petEyes = child.FindFirstChild("Eyes");
					if (petEyes !== undefined && petEyes.IsA("Decal")) {
						petEyes.Color3 = Color3.fromRGB(255, 0, 255);
					}

					const tags = CollectionService.GetTags(child);
					for (const tag of tags) {
						for (const [tagIndex, tagPropertyData] of pairs(TAG_CONFIG.Void)) {
							if (tag !== tagIndex) continue;

							child.Color = tagPropertyData.Color;
							child.Material = tagPropertyData.Material;
						}
					}
				}
			}

			break;
		}
		case "talisman": {
			if (!assetObject.IsA("Model")) {
				throw `Expected talisman: "${assetObject.Name}" to be a Model`;
			}

			const primaryPart = assetObject.FindFirstChild("Primary") as BasePart;
			assert(primaryPart, `Failed to get primary part for ${assetObject.Name}`);

			assetObject.PrimaryPart = primaryPart;

			for (const child of assetObject.GetChildren()) {
				if (!child.IsA("BasePart")) continue;
				if (child === assetObject.PrimaryPart) continue;

				child.CanCollide = false;
				child.Anchored = false;
				child.Massless = true;
				child.Name = "meshPart";
			}

			assert(assetObject.PrimaryPart, `No PrimaryPart set for ${assetObject.Name}`);
			assetObject.PrimaryPart.Name = "Primary";

			weldObject(assetObject.GetChildren() as Array<BasePart>, assetObject.PrimaryPart);

			break;
		}
		case "weapon": {
			if (!assetObject.IsA("Tool")) {
				throw `Expected weapon: "${assetObject.Name}" to be a Tool`;
			}

			if (assetObject.FindFirstChild("Handle") === undefined) {
				throw `Expected to find a Handle in weapon: "${assetObject.Name}"`;
			}

			assetObject.CanBeDropped = false;

			for (const object of assetObject.GetChildren()) {
				if (!object.IsA("BasePart")) {
					continue;
				}

				object.CanCollide = false;
				object.Anchored = false;
			}

			break;
		}
	}
}
