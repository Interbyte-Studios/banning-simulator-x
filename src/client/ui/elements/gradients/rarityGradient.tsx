import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { RARITIES, Rarities } from "shared/configs/rarities";

import { hooks } from "../../hooks";

/**
 * A ui gradient component which has its gradient colors set depending on the specified rarity.
 *
 * @param props The properties of the rarity gradient.
 * @param props.Rarity The rarity gradient to be displayed.
 * @returns A roact component.
 */
export const RarityGradient = hooks((props: { Rarity: Rarities }, { useEffect, useValue, useBinding }) => {
	const [offsetOfAnimation, setAnimationOffset] = useBinding(new Vector2(-0.75, 0));

	const rarityData = RARITIES[props.Rarity];
	const gradientRef = useValue(Roact.createRef<UIGradient>());

	useEffect(() => {
		if (rarityData.SpecialColor === undefined) {
			return;
		}

		const gradient = gradientRef.value.getValue();
		assert(gradient);

		const connection = RunService.RenderStepped.Connect((deltaTime) => {
			if (offsetOfAnimation.getValue().X < 0.75) {
				gradient.Offset = new Vector2(offsetOfAnimation.getValue().X + 0.5 * deltaTime, 0);
			} else {
				gradient.Offset = new Vector2(-0.75, 0);
			}

			gradient.Rotation = 40;
			setAnimationOffset(gradient.Offset);
		});

		return (): void => connection.Disconnect();
	});

	return (
		<uigradient
			Color={
				rarityData.SpecialColor ??
				new ColorSequence([
					new ColorSequenceKeypoint(0, rarityData.BeginningColor),
					new ColorSequenceKeypoint(1, rarityData.EndingColor),
				])
			}
			Ref={gradientRef.value}
			Rotation={rarityData.SpecialColor ? 90 : -90}
			Offset={offsetOfAnimation.getValue()}
		/>
	);
});
