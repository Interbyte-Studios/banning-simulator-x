import { CollectionService } from "@rbxts/services";
import { TAG_CONFIG, Variants } from "shared/configs/pets";

export type ValidAssetType = "egg" | "pet" | "talisman" | "weapon";

/**
 * Sets the properties of an asset object<model> depending on the type of asset it is.
 *
 * @param assetType The type of asset to set properties for.
 * @param assetObject The object<model>.
 * @param variant The variant of the asset.
 */
export function setAssetProperties(assetType: ValidAssetType, assetObject: Model | Tool, variant?: Variants): void {
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

				if (variant === "void") {
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
				} else if (variant === "radiant") {
					const petEyes = child.FindFirstChild("Eyes");
					if (petEyes !== undefined && petEyes.IsA("Decal")) {
						petEyes.Color3 = Color3.fromRGB(255, 191, 161);
					}

					const tags = CollectionService.GetTags(child);
					for (const tag of tags) {
						for (const [tagIndex, tagPropertyData] of pairs(TAG_CONFIG.Radiant)) {
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

			for (const child of assetObject.GetChildren()) {
				if (!child.IsA("BasePart")) continue;

				if (assetObject.PrimaryPart === undefined && child.Name === "Primary") {
					assetObject.PrimaryPart = child;
				}

				child.CanCollide = false;
				child.Anchored = false;
				child.Name = "meshPart";
			}

			assert(assetObject.PrimaryPart, `No PrimaryPart set for ${assetObject.Name}`);
			assetObject.PrimaryPart.Name = "Primary";

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
