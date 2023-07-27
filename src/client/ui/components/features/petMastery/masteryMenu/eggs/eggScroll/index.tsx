import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { EggName, EGGS, isValidMasteryEgg } from "shared/configs/eggs";
import { WorldName } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";

import { IndexEggCard } from "./eggCard";

interface IndexEggScrollProps extends IndexEggScrollMappedProps {
	world: WorldName;
	currentEgg: EggName | undefined;
	displayEgg: (eggName: EggName | undefined) => void;
}

interface IndexEggScrollMappedProps {
	index: PlayerIndexState;
}

/**
 * @param state The rodux state.
 * @returns The mapped props to render with.
 */
const mapStateToProps = (state: StoreState): IndexEggScrollMappedProps => {
	return {
		index: state.index,
	};
};

/**
 * A scroll menu displaying all hatchable eggs in the world the player is viewing in the pet mastery component.
 *
 * @param props The properties of the Roact component.
 * @param props.world The world that pet mastery is being viewed in.
 * @param props.displayEgg A function to display the egg's info in the view area of the component.
 * @param props.currentEgg The egg currently being displayed.
 * @returns A Roact component.
 */
export const IndexEggScroll = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexEggScrollProps, { useEffect, useValue }) => {
		const eggs = Object.entries(EGGS)
			.filter((egg) => isValidMasteryEgg(egg[0]))
			.filter((egg) => egg[1].world === props.world || egg[1].world === "Limited");

		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Pet Mastery's UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Pet Mastery ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Pet Mastery to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((card) => {
				if (card.IsA("Frame")) {
					card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});

			const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
				scrollingFrame.GetChildren().forEach((card) => {
					if (card.IsA("Frame")) {
						card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
					}
				});
			});

			const conn = scrollingFrame.ChildAdded.Connect((child) => {
				if (child.IsA("Frame")) {
					child.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
			return (): void => {
				connection.Disconnect();
				conn.Disconnect();
			};
		}, [uiListLayoutRef]);

		return (
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.225, 0.55)}
				Size={UDim2.fromScale(0.4, 0.775)}
				ScrollBarThickness={10}
				BorderSizePixel={0}
				ScrollBarImageColor3={Color3.fromRGB(22, 0, 190)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					Padding={new UDim(0.01, 0)}
					Ref={uiListLayoutRef.value}
				/>
				{eggs.map((eggData) => {
					return (
						<IndexEggCard
							egg={eggData[0]}
							layoutOrder={eggData[1].id}
							displayEgg={props.displayEgg}
							currentEgg={props.currentEgg}
						/>
					);
				})}
			</RescalingScrollingFrame>
		);
	}),
);
