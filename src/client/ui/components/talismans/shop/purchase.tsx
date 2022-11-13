import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { RankState } from "shared/rodux/rank";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

interface PurchaseTalismanProps extends PurchaseTalismanMappedProps {
	currentTalisman: number;
}

interface PurchaseTalismanMappedProps {
	talismans: TalismansState;
	rank: RankState;
	currencies: CurrenciesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PurchaseTalismanMappedProps {
	return {
		talismans: state.talismans,
		rank: state.rank,
		currencies: state.currencies,
	};
}

/**
 * A button which allows the user to purchase the talisman they're viewing.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const PurchaseTalisman = RoactRodux.connect(mapStateToProps)(
	hooks((props: PurchaseTalismanProps, hooks) => {
		if (props.talismans.get(props.currentTalisman)) {
			return <></>;
		}

		const { useContext } = hooks;
		const { purchaseTalisman } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		const maximizedSize = 0.08;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.07;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		const talismanInfo = getTalismanData(props.currentTalisman);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.925)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.15, value);
				})}
				Image={assetIds.images.ui["weapon shop"]["purchase button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						// check to be sure player has enough currency to purchase talisman
						if (props.currencies[talismanInfo.cost.currency] < talismanInfo.cost.amount) {
							addError(`You don't have enough currency to purchase "${talismanInfo.name}".`);
							return;
						}

						// check to be sure player is required rank
						if (props.rank < talismanInfo.cost.rank) {
							addError(`You're not a high enough rank to purchase "${talismanInfo.name}".`);
							return;
						}

						purchaseTalisman.SendToServer(props.currentTalisman);
						addError(`You've purchased the "${talismanInfo.name}" talisman!`);
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Text={"Purchase"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<BaseUIStroke Thickness={2} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
