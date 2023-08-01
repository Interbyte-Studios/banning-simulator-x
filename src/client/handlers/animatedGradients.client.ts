debug.setmemorycategory("animatedGradients");
import { CollectionService, RunService } from "@rbxts/services";

RunService.RenderStepped.Connect((deltaTime) => {
	debug.profilebegin("animatedGradients");
	const offsetGradients = CollectionService.GetTagged("AnimatedGradient_Offset");
	const rotateGradients = CollectionService.GetTagged("AnimatedGradient_Rotate");

	for (const gradient of offsetGradients) {
		assert(gradient.IsA("UIGradient"), `found instance which isnt a UIGradient ${gradient.GetFullName()}`);
		const gradientOffset = gradient.Offset;

		if (gradientOffset.X < 0.75) {
			gradient.Offset = new Vector2(gradientOffset.X + 0.5 * deltaTime, 0);
		} else {
			gradient.Offset = new Vector2(-0.75, 0);
		}

		gradient.Rotation = 40;
	}

	for (const gradient of rotateGradients) {
		assert(gradient.IsA("UIGradient"), `found instance which isnt a UIGradient ${gradient.GetFullName()}`);
		gradient.Rotation += (90 * deltaTime) % 360;
	}
	debug.profileend();
});
