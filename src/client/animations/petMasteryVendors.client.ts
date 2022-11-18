import { CollectionService, RunService } from "@rbxts/services";
import { AssetAnimation } from "shared/assetTags";

/**
 * Animates pet mastery vendor models so they fly up and down like pets.
 *
 * @param petMasteryVendor The pet model of the pet mastery "vendor".
 */
function animateVendor(petMasteryVendor: Model): void {
	const primary = petMasteryVendor.PrimaryPart;
	assert(primary, `Expected pet mastery vendor to have a primary part.`);

	const originalCFrame = primary.CFrame;
	RunService.RenderStepped.Connect(() => {});
}

const petMasteryVendors = CollectionService.GetTagged(AssetAnimation.PetMasteryVendor);
for (const petVendor of petMasteryVendors) {
	assert(petVendor.IsA("Model"), `Expected pet mastery vendor ${petVendor.Name} to be a model.`);
	animateVendor(petVendor);
}
