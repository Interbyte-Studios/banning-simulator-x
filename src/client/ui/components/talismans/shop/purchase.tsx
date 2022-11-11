import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
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
	displayAnnouncement: (announcementType: "errors" | "announcements", message: string) => void;
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
						// check to be sure they've bought the previous talisman
						const previousTalismanId = props.currentTalisman - 1;
						if (previousTalismanId > 0) {
							const ownsPreviousTalisman = props.talismans.has(previousTalismanId);
							if (!ownsPreviousTalisman) {
								props.displayAnnouncement("errors", `You don't own the previous talisman!`);
								return;
							}
						}

						// check to be sure player has enough currency to purchase talisman
						if (props.currencies[talismanInfo.cost.currency] < talismanInfo.cost.amount) {
							props.displayAnnouncement(
								"errors",
								`You don't have enough currency to purchase the "${talismanInfo.name}" talisman.`,
							);
							return;
						}

						// check to be sure player is required rank
						if (props.rank < talismanInfo.cost.rank) {
							props.displayAnnouncement(
								"errors",
								`You're not a high enough rank to purchase the "${talismanInfo.name}" talisman.`,
							);
							return;
						}

						purchaseTalisman.SendToServer(props.currentTalisman);
						props.displayAnnouncement("announcements", `You've purchased the "${talismanInfo.name}" talisman!`);
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
