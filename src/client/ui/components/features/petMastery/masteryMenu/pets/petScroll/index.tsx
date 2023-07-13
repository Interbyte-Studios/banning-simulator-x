import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";
import { getEggData } from "shared/util/getEggData";

import { IndexPetCard } from "./petCard";

/**
 * A scroll menu displaying the pets of the egg the player is viewing in the pet mastery component.
 *
 * @param props The properties of the Roact component.
 * @param props.displayPet A function to display the pets info in the view area of the component.
 * @param props.currentPet The pet currently being displayed, if any.
 * @param props.egg The egg the player is currently viewing.
 * @param props.currentVariant The variant the player is currently viewing.
 * @returns A Roact component.
 */
export const IndexPetScroll = hooks(
	(
		props: {
			egg: EggName;
			currentPet: number | undefined;
			currentVariant: Variants | undefined;
			displayPet: (petName: number | undefined) => void;
		},
		hooks,
	) => {
		const eggData = getEggData(props.egg);
		const pets = Object.values(eggData.pets).map((pet) => pet);

		const { useValue, useEffect } = hooks;
		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get pet mastery UIGridLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get pet mastery ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected pet mastery to have a ScrollingFrame.`);

			uiListLayout.Padding = new UDim(0, scrollingFrame.AbsoluteSize.X / 14.3);

			scrollingFrame.GetChildren().forEach((petCard) => {
				if (petCard.IsA("Frame")) {
					petCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});

		return (
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.225, 0.55)}
				Size={UDim2.fromScale(0.4, 0.775)}
				ScrollBarThickness={12}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					Ref={uiListLayoutRef.value}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 15)}
				/>
				{pets.map((petData) => {
					return (
						<IndexPetCard
							pet={petData.id}
							displayPet={props.displayPet}
							currentVariant={props.currentVariant}
							currentPet={props.currentPet}
						/>
					);
				})}
			</RescalingScrollingFrame>
		);
	},
);
