import Roact from "@rbxts/roact";
import { CollectionService, RunService } from "@rbxts/services";
import { RARITIES, Rarities } from "shared/configs/rarities";
import { TITLES } from "shared/configs/titles";

import { hooks } from "../hooks";

/**
 * A ui gradient component which has its gradient colors set depending on the specified title.
 *
 * @param props The properties of the title gradient.
 * @param props.titleId The id of the title.
 * @returns A roact component.
 */
export const TitleGradient = hooks((props: { titleId: number }, { useEffect, useValue, useBinding }) => {
	const [offsetOfAnimation, setAnimationOffset] = useBinding(new Vector2(-0.75, 0));

	const titleData = TITLES.find((title) => title.id === props.titleId);
	assert(titleData, `Failed to get title data for title with id: "${props.titleId}".`);

	if (typeIs(titleData.effect, "Color3")) {
		return <></>;
	}

	const gradientRef = useValue(Roact.createRef<UIGradient>());
	useEffect(() => {
		if (typeIs(titleData.effect, "Color3")) {
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

	return <uigradient Color={titleData.effect} Ref={gradientRef.value} Offset={offsetOfAnimation.getValue()} />;
});
