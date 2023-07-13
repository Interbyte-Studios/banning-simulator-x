import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { uiDarkStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { RankState } from "shared/rodux/rank";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

import { TalismanItemFrame } from "./talismanFrame";
import { TalismanInfoDisplay } from "./talismanInfoDisplay";

interface TalismanItemsMappedProps {
	talismans: TalismansState;
	currentTalisman: CurrentTalismanState;
	rank: RankState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TalismanItemsMappedProps {
	return {
		talismans: state.talismans,
		currentTalisman: state.currentTalisman,
		rank: state.rank,
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
			if (uiGridLayout !== undefined) {
				CollectionService.AddTag(uiGridLayout, "UnscaledInventoryGridLayout");
			}
		});

		const talismanInfoDisplay: Array<Roact.Element> = [];
		if (displayingInfo !== undefined) {
			const talismanElement = (
				<TalismanInfoDisplay
					id={displayingInfo}
					shouldAnimate={talismanInfoDisplayOldState === undefined && displayingInfo !== undefined}
					hideDisplay={(): void => {
						displayTalismanInfo(undefined);
					}}
				/>
			);

			talismanInfoDisplay.push(talismanElement);
		}

		if (talismanInfoDisplayOldState !== displayingInfo) {
			talismanInfoDisplayOldState = displayingInfo;
		}

		if (props.talismans.isEmpty()) {
			return (
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.55),
						Size: UDim2.fromScale(0.9, 0.2),
						Text: "You don't own any talismans.",
					}}
					stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
				/>
			);
		} else {
			return (
				<BaseFrame Size={UDim2.fromScale(0.975, 0.785)} Position={UDim2.fromScale(0.5, 0.565)}>
					<RescalingScrollingFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(1, 1)}
						Position={UDim2.fromScale(0.5, 0.5)}
						ScrollBarThickness={12}
					>
						<uigridlayout
							CellPadding={UDim2.fromOffset(6, 6)}
							CellSize={UDim2.fromOffset(125, 125)}
							SortOrder={Enum.SortOrder.LayoutOrder}
							FillDirectionMaxCells={5}
							Ref={uiGridLayoutRef.value}
						/>
						{props.talismans.map((talisman) => {
							const talismanData = getTalismanData(talisman.id);

							return (
								<TalismanItemFrame
									storedTalisman={talisman}
									isEquipped={props.currentTalisman === talisman.id}
									displayTalismanInfo={(talismanId: number): void => displayTalismanInfo(talismanId)}
									requiredRank={props.rank >= talismanData.cost.rank ? undefined : talismanData.cost.rank}
								/>
							);
						})}
					</RescalingScrollingFrame>
					{talismanInfoDisplay}
				</BaseFrame>
			);
		}
	}),
);
