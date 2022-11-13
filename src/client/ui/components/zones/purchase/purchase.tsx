import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { tryPurchaseZone } from "client/modules/tryPurchaseZone";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { PurchaseZoneFailKind } from "shared/remotes/purchaseZone";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { WorldsState } from "shared/rodux/worlds";

interface PurchaseZoneButtonProps extends PurchaseZoneButtonMappedProps {
	world: WorldName;
	zone: ZoneNames;
	hideMenu: () => void;
}

interface PurchaseZoneButtonMappedProps {
	currencies: CurrenciesState;
	worlds: WorldsState;
	rank: RankState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PurchaseZoneButtonMappedProps {
	return {
		currencies: state.currencies,
		worlds: state.worlds,
		rank: state.rank,
	};
}

/**
 * Ineraction UI roact component for purchasing a zone.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PurchaseZoneButton = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseZoneButtonProps, hooks) => {
		const { useContext } = hooks;
		const { purchaseZone } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		const minimizedSize = 0.15;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.175;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.75, 0.85)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.315, value);
				})}
				Image={assetIds.images.ui.zones.purchase}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: async (): Promise<void> => {
						const checkZonePurchaseRequirements = tryPurchaseZone(
							props.currencies,
							props.worlds,
							props.rank,
							props.world,
							props.zone,
						);

						if (checkZonePurchaseRequirements.success === false) {
							switch (checkZonePurchaseRequirements.reason) {
								case PurchaseZoneFailKind.InternalError: {
									addError(`There was an error while purchasing "${props.zone}" zone (110).`);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NotEnoughCurrency: {
									addError(`You don't have enough to purchase "${props.zone}".`);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NotRequiredRank: {
									addError(`You aren't a high enough rank to purchase "${props.zone}".`);
									props.hideMenu();
									return;
								}
								case PurchaseZoneFailKind.NonlinearProgression: {
									addError(`You don't meet the requirements to purchase "${props.zone}".`);
									props.hideMenu();
									return;
								}
							}
						} else {
							const requestZonePurchase = await purchaseZone.CallServerAsync(props.world, props.zone);
							if (requestZonePurchase.success === true) {
								addError(`You have purchased the "${props.zone}" zone.`);
								props.hideMenu();
								return;
							} else {
								switch (requestZonePurchase.reason) {
									case PurchaseZoneFailKind.InternalError: {
										addError(`There was an error while purchasing "${props.zone}" zone (110).`);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NotEnoughCurrency: {
										addError(`You don't have enough to purchase "${props.zone}".`);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NotRequiredRank: {
										addError(`You aren't a high enough rank to purchase "${props.zone}".`);
										props.hideMenu();
										return;
									}
									case PurchaseZoneFailKind.NonlinearProgression: {
										addError(`You don't meet the requirements to purchase "${props.zone}".`);
										props.hideMenu();
										return;
									}
								}
							}
						}
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.85, 0.6)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Purchase"}
					Font={font}
				>
					<BaseUIStroke Thickness={2} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
