import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { TALISMAN_PHASES, talismanPhases } from "shared/configs/talismans";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { TalismansState } from "shared/rodux/talismans";

import { color3White, font, vec2Middle } from "../commonValues";
import { useBindingMotor } from "../customHooks/useBindingMotor";
import { BaseUIStroke } from "../elements/baseUIStroke";
import { hooks } from "../hooks";

interface TalismanLevelUpAnimationProps {
	currentTalisman: CurrentTalismanState;
	talismanState: TalismansState;
}

/**
 *
 * @param state The current state of the store.
 * @returns The.
 */
function mapStateToProps(state: StoreState): TalismanLevelUpAnimationProps {
	return {
		currentTalisman: state.currentTalisman,
		talismanState: state.talismans,
	};
}

export const TalismanLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanLevelUpAnimationProps, hooks) => {
		if (props.currentTalisman === undefined) {
			return <></>;
		}

		const talismanData = props.talismanState.get(props.currentTalisman);
		if (talismanData === undefined) {
			return <></>;
		}

		let talismanPhaseData: { requiredBans: number; phase: talismanPhases } | undefined;
		TALISMAN_PHASES.forEach((phaseData) => {
			if (talismanData.bans >= phaseData.requiredBans) {
				talismanPhaseData = phaseData;
			}
		});

		if (talismanPhaseData === undefined) {
			return <></>;
		}

		/// Level up frame.
		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.15;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const frameBindingMotor = useBindingMotor(hooks, minimizedSize);

		const { useEffect } = hooks;
		useEffect(() => {
			task.defer(() => {
				task.wait(0.2);
				frameBindingMotor.motor.setGoal(maximizedSpring);
				task.wait(2);
				frameBindingMotor.motor.setGoal(minimizedSpring);
			});
		});

		const talismanName =
			string.upper(string.sub(talismanPhaseData.phase, 1, 1)) + string.sub(talismanPhaseData.phase, 2);

		return (
			<frame
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.15)}
				Size={frameBindingMotor.binding.map((value) => {
					return UDim2.fromScale(0.34, value);
				})}
				Visible={frameBindingMotor.binding.map((value) => {
					return value > 0;
				})}
				BackgroundTransparency={1}
			>
				<imagelabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://11588661046"}
					BackgroundTransparency={1}
					SliceCenter={new Rect(new Vector2(163, 63), new Vector2(163, 63))}
					ScaleType={Enum.ScaleType.Slice}
				/>
				<textlabel
					Text={"Talisman Level Up!"}
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 1.2)}
					Size={UDim2.fromScale(1.3, 0.4)}
					Font={font}
					TextScaled={true}
					TextColor3={color3White}
				>
					<BaseUIStroke native={{ Thickness: 4 }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.495, 0.37)}
					Size={UDim2.fromScale(0.75, 0.6)}
					TextScaled={true}
					Font={font}
					TextColor3={Color3.fromRGB(27, 42, 53)}
					BackgroundTransparency={1}
					Text={talismanName}
				>
					<BaseUIStroke native={{ Thickness: 4 }} />
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.48)}
						Size={UDim2.fromScale(1, 1)}
						TextScaled={true}
						Font={font}
						TextColor3={color3White}
						BackgroundTransparency={1}
						Text={talismanName}
					>
						<BaseUIStroke native={{ Thickness: 4 }} />
					</textlabel>
				</textlabel>
			</frame>
		);
	}),
);
