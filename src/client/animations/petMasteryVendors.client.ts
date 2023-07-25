import { CollectionService, RunService } from "@rbxts/services";
import { AssetAnimation } from "shared/assetTags";

/**
 * Animates pet mastery vendor models so they fly up and down like pets.
 *
 * @param petMasteryVendor The pet model of the pet mastery "vendor".
 */
function animateVendor(petMasteryVendor: Model): void {
	let primary = petMasteryVendor.PrimaryPart;
	if (primary === undefined) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (petMasteryVendor.PrimaryPart !== undefined) {
				primary = petMasteryVendor.PrimaryPart;
				break;
			}
		}
	}

	const originalCFrame = primary.CFrame;

	/// Hover
	const hoverSpeed = 2;
	const hoverAmount = 2.5;

	/// Facing
	const faceSpeed = 2.2;
	const faceAmount = 15;

	RunService.RenderStepped.Connect(() => {
		debug.profilebegin("petMasteryVendor");
		if (petMasteryVendor.Parent === undefined) {
			return;
		}

		const hover = math.sin(os.clock() * hoverSpeed) * hoverAmount;
		const face = math.sin(os.clock() * faceSpeed) * faceAmount;

		petMasteryVendor.PivotTo(originalCFrame.mul(new CFrame(0, hover, 0).mul(CFrame.Angles(math.rad(face), 0, 0))));

		debug.profileend();
	});
}

const petMasteryVendors = CollectionService.GetTagged(AssetAnimation.PetMasteryVendor);
for (const petVendor of petMasteryVendors) {
	assert(petVendor.IsA("Model"), `Expected pet mastery vendor ${petVendor.Name} to be a model.`);
	animateVendor(petVendor);
}
