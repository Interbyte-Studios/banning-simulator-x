import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";

interface UpgradeRankProps extends UpgradeRankMappedProps {
	rank: number;
	experience: number;
}

interface UpgradeRankMappedProps {
	currencies: CurrenciesState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): UpgradeRankMappedProps {
	return {
		currencies: state.currencies,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const UpgradeRank = RoactRodux.connect(mapStateToProps)(
	hooks((props: UpgradeRankProps, hooks) => {
		const currentRank = props.rank - 1;
		const nextRank = currentRank + 1;

		const nextRankData = RANKS[nextRank];
		if (nextRankData === undefined) {
			throw `Expected rank data for rank ${nextRank}`;
		}

		const { useContext } = hooks;
		const { unlockRank } = useContext(remoteContext);
		const { addError } = useContext(AnnouncementContext);

		const maximizedSize = 0.15;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.1;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.65, 0.85)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.275, value);
				})}
				Image={assetIds.images.ui["rank upgrade"].upgrade}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						if (props.experience < nextRankData.requiredExperience) {
							addError(`You don't have enough experience to upgrade your rank.`);
							return;
						}

						if (props.currencies[nextRankData.currency] < nextRankData.amount) {
							addError(`You don't have enough "${nextRankData.currency}" to upgrade your rank.`);
							return;
						}

						unlockRank.SendToServer();
						addError(`You've upgraded to the rank "${nextRankData.name}".`);
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.85, 0.6)}
					Text={"Upgrade"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={2.5} Color={Color3.fromRGB(5, 115, 28)} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
