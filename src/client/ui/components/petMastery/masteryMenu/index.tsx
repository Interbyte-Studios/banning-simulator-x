import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { EGGS } from "shared/configs/eggs";
import { WorldName } from "shared/configs/worlds";

import { PetMasteryEggCard } from "./eggCard";

interface PetMasteryMenuProps {
	world: WorldName;
	hideMenu: () => void;
}

/**
 * Displays all the pets of a given world, and accolades for each one that give rewards.
 */
export const PetMasteryMenu = hooks((props: PetMasteryMenuProps, { useValue, useEffect }) => {
	const eggs = Object.entries(EGGS).filter((egg) => egg[1].world === props.world);

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Did not find UIListLayout Roact Ref from PetMastery Component.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get scrolling frame for Pet Mastery Component.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Pet Mastery Component Parent to be a ScrollingFrame.`);

		const amountOfEggIndexs = scrollingFrame.GetChildren().filter((x) => x.IsA("ImageLabel"));
		for (const eggIndex of scrollingFrame.GetChildren()) {
			if (!eggIndex.IsA("ImageLabel")) {
				continue;
			}

			eggIndex.Size = UDim2.fromOffset(
				scrollingFrame.AbsoluteSize.X,
				(scrollingFrame.AbsoluteSize.Y * 1.5) / amountOfEggIndexs.size(),
			);
		}
	});

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.5, 0.61)}
			Image={assetIds.images.ui.index.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.075} />
			<textlabel
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.06)}
				Size={UDim2.fromScale(0.375, 0.1)}
				BackgroundTransparency={1}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={"Pet Mastery"}
				Font={font}
			>
				<BaseUIStroke Thickness={3} />
			</textlabel>
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.55)}
				Size={UDim2.fromScale(0.95, 0.85)}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout Padding={new UDim(0.01, 0)} Ref={uiListLayoutRef.value} SortOrder={Enum.SortOrder.LayoutOrder} />
				{eggs.map((egg) => {
					return <PetMasteryEggCard eggName={egg[0]} eggData={egg[1]} />;
				})}
			</RescalingScrollingFrame>
			<ExitButton
				Position={UDim2.fromScale(0.975, 0.075)}
				minimizedSize={0.075}
				maximizedSize={0.1}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
