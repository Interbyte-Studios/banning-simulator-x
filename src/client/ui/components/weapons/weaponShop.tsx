/* eslint-disable @typescript-eslint/no-magic-numbers */
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
import { purchaseWeapon } from "client/weapons/purchaseWeapon";
import { Weapon, WEAPONS } from "shared/configs/weapons";
import { Store, StoreState } from "shared/rodux";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { color3White, vec2Middle } from "../../commonValues";
import { hooks } from "../../hooks";
import { remoteContext } from "../../mocks/remoteContext";

interface WeaponShopProps extends WeaponShopMappedProps {
	store: Store;
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

interface LocalWeaponInfo {
	isOwned: boolean;
	id: number;
	weaponInfo: {
		name: string;
		data: Weapon;
	};
}

/**
 * @param weaponsState The current weapon state of the players store.
 * @param id The id of the weapon.
 * @returns Local data relative to the weapon id given.
 */
function getWeaponLocalInfo(weaponsState: WeaponsState, id: number): LocalWeaponInfo {
	const weaponInfo = getWeaponInfo(id);

	return {
		weaponInfo,
		id,
		isOwned: weaponsState.has(id),
	};
}

export const WeaponShop = RoactRodux.connect(mapStateToProps)(
	hooks((props: WeaponShopProps, { useState, useContext, useEffect }) => {
		const [isVisible, setVisibility] = useState(false);
		const [viewedWeaponInfo, setViewedWeaponInfo] = useState(
			getWeaponLocalInfo(props.weaponsState, props.currentWeaponId),
		);
		const remotes = useContext(remoteContext);

		// bind to view button
		useEffect(() => {
			ContextActionService.BindAction(
				"weaponShop",
				(_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					setVisibility(!isVisible);
				},
				false,
				Enum.KeyCode.B,
			);

			return (): void => {
				ContextActionService.UnbindAction("weaponShop");
			};
		}, [isVisible]);

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
								? "Equip"
								: "Purchase"
						}
						Event={{
							/**
							 * Equips/Purchases weapon being currently viewed.
							 */
							Activated: (): void => {
								// check that the weapon is not already equipped
								if (viewedWeaponInfo.id === props.currentWeaponId) {
									return;
								}

								if (viewedWeaponInfo.isOwned) {
									// equip weapon
									remotes.equipWeapon.SendToServer(viewedWeaponInfo.id);
								} else {
									// purchase weapon
									purchaseWeapon(props.store, viewedWeaponInfo.id, remotes.purchaseWeapon);
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
						CellPadding={UDim2.fromScale(0, 0.025)}
						CellSize={UDim2.fromScale(0.25, 0.05)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
					/>

					{Object.entries(WEAPONS).map(([weaponName, weaponInfo]) => {
						return (
							<textbutton
								LayoutOrder={weaponInfo.damage}
								Text={weaponName}
								TextScaled={true}
								Event={{
									/**
									 * Change weapon currently being viewed in shop.
									 */
									Activated: (): void => {
										setViewedWeaponInfo(getWeaponLocalInfo(props.weaponsState, weaponInfo.id));
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
