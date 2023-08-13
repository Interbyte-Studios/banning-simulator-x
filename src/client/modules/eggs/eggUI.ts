import { t } from "@rbxts/t";

const petDescription = t.intersection(
	t.instanceIsA("TextLabel"),
	t.children({
		UIStroke: t.instanceIsA("UIStroke"),
	}),
);

const petDisplay = t.intersection(
	t.instanceIsA("Frame"),
	t.children({
		AutoDeleted: petDescription,
		PetName: petDescription,
		PetRarity: petDescription,
	}),
);

export const isValidEggHatchUI = t.intersection(
	t.instanceIsA("ScreenGui"),
	t.children({
		hatch1: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				Middle: petDisplay,
			}),
		),
		hatch2: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				Left: petDisplay,
				Right: petDisplay,
			}),
		),
		hatch3: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				Left: petDisplay,
				Right: petDisplay,
				Middle: petDisplay,
			}),
		),
		hatch4: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				BottomLeft: petDisplay,
				BottomRight: petDisplay,
				TopRight: petDisplay,
				TopLeft: petDisplay,
			}),
		),
		hatch5: t.intersection(
			t.instanceIsA("Frame"),
			t.children({
				BottomLeft: petDisplay,
				BottomRight: petDisplay,
				TopLeft: petDisplay,
				Middle: petDisplay,
				TopRight: petDisplay,
			}),
		),
		Stop: t.intersection(
			t.instanceIsA("ImageButton"),
			t.children({
				UIAspectRatioConstraint: t.instanceIsA("UIAspectRatioConstraint"),
				TextLabel: t.intersection(
					t.instanceIsA("TextLabel"),
					t.children({
						UIStroke: t.instanceIsA("UIStroke"),
					}),
				),
			}),
		),
	}),
);
