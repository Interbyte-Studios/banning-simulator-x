/* eslint-disable @typescript-eslint/no-magic-numbers */
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { getWeaponLocalInfo } from "client/weapons/getWeaponInfo";
import { purchaseWeapon } from "client/weapons/purchaseWeapon";
import { toggleWeaponEquipped } from "client/weapons/weaponState";
import { WEAPONS } from "shared/configs/weapons";
import { StoreState } from "shared/rodux";
import { WeaponsState } from "shared/rodux/weapons";

import { color3White, vec2Middle } from "../commonValues";
import { hooks } from "../hooks";

interface WeaponShopProps extends WeaponShopMappedProps {
	player: Player;
}

interface WeaponShopMappedProps {
	currentWeaponId: number;
	weaponsState: WeaponsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): WeaponShopMappedProps {
	return {
		currentWeaponId: state.currentWeapon,
		weaponsState: state.weapons,
	};
}

export const WeaponShop = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponShopProps, { useState, useEffect }) => {
		const [isVisible, setVisibility] = useState(false);
		const [viewedWeaponInfo, setViewedWeaponInfo] = useState(
			getWeaponLocalInfo(props.weaponsState, props.currentWeaponId),
		);

		return (
			<frame
				Size={UDim2.fromScale(0.4, 0.6)}
				SizeConstraint={Enum.SizeConstraint.RelativeXY}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={vec2Middle}
				BackgroundColor3={color3White}
				BorderSizePixel={0}
				Visible={isVisible}
			>
				<frame Size={UDim2.fromScale(0.3, 1)} Position={UDim2.fromScale(0.7, 0)}>
					<textlabel
						Position={UDim2.fromScale(0.05, 0.1)}
						BackgroundColor3={color3White}
						Size={UDim2.fromScale(0.9, 0.1)}
						Text={viewedWeaponInfo.weaponInfo.name}
					/>

					<textbutton
						Position={UDim2.fromScale(0.05, 0.3)}
						Size={UDim2.fromScale(0.9, 0.1)}
						Text={
							viewedWeaponInfo.id === props.currentWeaponId
								? "Equipped"
								: viewedWeaponInfo.isOwned === true
								? "Owned"
								: "Purchase"
						}
						Event={{
							/**
							 * Equips/Purchases weapon being currently viewed.
							 */
							Activated: (): void => {
								if (viewedWeaponInfo.id === props.currentWeaponId) {
									return;
								}

								if (viewedWeaponInfo.isOwned) {
									toggleWeaponEquipped(props.player, props.currentWeaponId, true);
								} else {
									purchaseWeapon(props.player, viewedWeaponInfo.id);
								}
							},
						}}
					/>
				</frame>
				<scrollingframe
					Size={UDim2.fromScale(0.6, 1)}
					SizeConstraint={Enum.SizeConstraint.RelativeXY}
					BackgroundColor3={Color3.fromRGB(210, 210, 210)}
					BorderSizePixel={0}
				>
					<uigridlayout
						CellPadding={UDim2.fromScale(0.05, 0.025)}
						CellSize={UDim2.fromScale(0.275, 0.05)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>

					{Object.entries(WEAPONS).map((weaponData, weaponIndex) => {
						return (
							<textbutton
								LayoutOrder={weaponData[1].damage}
								Text={weaponData[0]}
								Event={{
									/**
									 * Change weapon currently being viewed in shop.
									 */
									Activated: (): void => {
										setViewedWeaponInfo(getWeaponLocalInfo(props.weaponsState, weaponIndex));
									},
								}}
							/>
						);
					})}
				</scrollingframe>
			</frame>
		);
	}),
);
