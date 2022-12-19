import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { TalismansState } from "shared/rodux/talismans";

import { TalismanItemFrame } from "./talismanFrame";
import { TalismanInfoDisplay } from "./talismanInfoDisplay";

interface TalismanItemsMappedProps {
	talismans: TalismansState;
	currentTalisman: CurrentTalismanState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TalismanItemsMappedProps {
	return {
		talismans: state.talismans,
		currentTalisman: state.currentTalisman,
	};
}

let talismanInfoDisplayOldState: number | undefined;

/**
 * An item inventory for talismans.
 */
export const TalismanItems = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanItemsMappedProps, { useState, useValue, useEffect }) => {
		const [displayingInfo, displayTalismanInfo] = useState<number | undefined>(undefined);

		const uiGridLayoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = uiGridLayoutRef.value.getValue();
			assert(uiGridLayout, `Failed to get ui grid layout from roact ref.`);

			CollectionService.AddTag(uiGridLayout, "UnscaledInventoryGridLayout");
		});

		const talismanInfoDisplay: Array<Roact.Element> = [];
		if (displayingInfo !== undefined) {
			talismanInfoDisplay.push(
				<TalismanInfoDisplay
					id={displayingInfo}
					shouldAnimate={talismanInfoDisplayOldState === undefined && displayingInfo !== undefined}
					hideDisplay={(): void => {
						displayTalismanInfo(undefined);
					}}
				/>,
			);
		}

		if (talismanInfoDisplayOldState !== displayingInfo) {
			talismanInfoDisplayOldState = displayingInfo;
		}

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.975, 0.785)}
				Position={UDim2.fromScale(0.5, 0.565)}
			>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					ScrollBarThickness={0}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(125, 125)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={uiGridLayoutRef.value}
					/>
					{props.talismans.map((talisman) => {
						return (
							<TalismanItemFrame
								storedTalisman={talisman}
								isEquipped={props.currentTalisman === talisman.id}
								displayTalismanInfo={(talismanId: number): void => displayTalismanInfo(talismanId)}
							/>
						);
					})}
				</RescalingScrollingFrame>
				{talismanInfoDisplay}
			</frame>
		);
	}),
);
