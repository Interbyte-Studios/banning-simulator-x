import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { ACCOLADES } from "shared/configs/accolades";
import { StoreState } from "shared/rodux";

import { FullComponentHeader } from "../util/fullComponentHeader";
import { AccoladeCard } from "./accoladeCard";

interface AccoladesProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * An accolades section displaying user achievements.
 */
export const Accolades = hooks((props: AccoladesProps, hooks) => {
	const { useValue, useEffect, useState } = hooks;

	const playerStore = retrieveStore(props.playerViewing);
	if (playerStore === undefined) {
		return (
			<FullComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Accolades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		);
	}

	const [storeState, setStoreState] = useState<StoreState>(playerStore.getState());
	useEffect(() => {
		const subscription = playerStore.changed.connect((newState) => {
			setStoreState(newState);
		});

		return (): void => subscription.disconnect();
	}, []);

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Failed to get Accolades UIListLayout.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Accolades ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Accolades to have a ScrollingFrame.`);

		scrollingFrame.GetChildren().forEach((card) => {
			if (card.IsA("Frame")) {
				card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
			}
		});
	});

	return (
		<>
			<FullComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Accolades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.62)}
				Size={UDim2.fromScale(0.95, 0.675)}
				ScrollBarThickness={10}
				BorderSizePixel={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Ref={uiListLayoutRef.value}
					Padding={new UDim(0.01, 0)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{ACCOLADES.map((accoladeData): Roact.Element => {
					if (accoladeData.id === 7) {
						return <></>;
					}

					const ownsAccolade = storeState.accolades.find((accoladeId) => accoladeId === accoladeData.id);
					const accoladeProgress = accoladeData.progress(storeState);

					return (
						<AccoladeCard
							playerViewing={props.playerViewing}
							ownsAccolade={ownsAccolade !== undefined}
							accoladeProgress={accoladeProgress}
							accoladeData={accoladeData}
						/>
					);
				})}
			</RescalingScrollingFrame>
		</>
	);
});
