import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CollectionService } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";
import { RankState } from "shared/rodux/rank";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { WeaponItemFrame } from "./weaponFrame";
import { WeaponInfoDisplay } from "./weaponInfoDisplay";

interface WeaponItemsMappedProps {
	weapons: WeaponsState;
	currentWeapon: CurrentWeaponState;
	rank: RankState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): WeaponItemsMappedProps {
	return {
		weapons: state.weapons,
		currentWeapon: state.currentWeapon,
		rank: state.rank,
	};
}

let weaponInfoDisplayOldState: number | undefined;

/**
 * An item inventory for weapons.
 */
export const WeaponItems = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponItemsMappedProps, { useState, useValue, useEffect }) => {
		const [displayingInfo, displayWeaponInfo] = useState<number | undefined>(undefined);

		const uiGridLayoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = uiGridLayoutRef.value.getValue();
			assert(uiGridLayout, `Failed to get ui grid layout from roact ref.`);

			CollectionService.AddTag(uiGridLayout, "UnscaledInventoryGridLayout");
		});

		const weaponInfoDisplay: Array<Roact.Element> = [];
		if (displayingInfo !== undefined) {
			weaponInfoDisplay.push(
				<WeaponInfoDisplay
					id={displayingInfo}
					shouldAnimate={weaponInfoDisplayOldState === undefined && displayingInfo !== undefined}
					hideDisplay={(): void => {
						displayWeaponInfo(undefined);
					}}
				/>,
			);
		}

		if (weaponInfoDisplayOldState !== displayingInfo) {
			weaponInfoDisplayOldState = displayingInfo;
		}

		return (
			<BaseFrame Size={UDim2.fromScale(0.975, 0.785)} Position={UDim2.fromScale(0.5, 0.565)}>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Position={UDim2.fromScale(0.5, 0.5)}
					ScrollBarThickness={12}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(125, 125)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={uiGridLayoutRef.value}
					/>
					{props.weapons.map((weapon) => {
						const weaponData = getWeaponInfo(weapon.id);

						return (
							<WeaponItemFrame
								storedWeapon={weapon}
								isEquipped={props.currentWeapon.id === weapon.id}
								displayWeaponInfo={(weaponId: number): void => displayWeaponInfo(weaponId)}
								requiredRank={
									props.rank >= weaponData.data.cost.requiredRank ? undefined : weaponData.data.cost.requiredRank
								}
							/>
						);
					})}
				</RescalingScrollingFrame>
				{weaponInfoDisplay}
			</BaseFrame>
		);
	}),
);
