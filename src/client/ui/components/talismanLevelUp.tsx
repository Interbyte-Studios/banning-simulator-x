import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { TalismanPhases } from "shared/configs/talismans";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

import { TalismanGradient } from "../elements/talismanGradient";

interface TalismanLevelUpAnimationProps {
	currentTalisman: CurrentTalismanState;
	talismans: TalismansState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TalismanLevelUpAnimationProps {
	return {
		currentTalisman: state.currentTalisman,
		talismans: state.talismans,
	};
}

const cachedTalisman: { id: number; phase: TalismanPhases } = {
	id: 0,
	phase: "normal",
};

/**
 * @param props The properties of the roact component.
 * @param props.talismanName The name of the talisman.
 * @param props.phase The new phase of the talisman.
 * @returns A Roact component.
 */
function TalismanName(props: { talismanName: string; phase: TalismanPhases }): Roact.Element {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.25)}
			Size={UDim2.fromScale(0.9, 0.4)}
			Font={font}
			Text={props.talismanName}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
		>
			<TalismanGradient phase={props.phase} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(20, 46, 47) }} />
		</textlabel>
	);
}

/**
 * @param props The properties of the Roact component.
 * @param props.phase The phase of the talisman.
 * @returns A Roact component.
 */
function PhaseDisplay(props: { phase: TalismanPhases }): Roact.Element {
	const properPhaseName = props.phase === "artifact" ? "Artifact" : props.phase === "awakend" ? "Awakened" : "Normal";

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(75, 75, 75)}
			Position={UDim2.fromScale(0.5, 0.75)}
			Size={UDim2.fromScale(0.9, 0.35)}
		>
			<uicorner CornerRadius={new UDim(0.15, 0)} />
			<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(85, 255, 255) }} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.9)}
				Font={font}
				Text={`Upgrade: ${properPhaseName}`}
				TextScaled={true}
				TextColor3={Color3.fromRGB(85, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(20, 46, 47) }} />
			</textlabel>
		</frame>
	);
}

/**
 * An animation that plays when a player levels up their talisman.
 */
export const TalismanLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanLevelUpAnimationProps, hooks) => {
		if (props.currentTalisman === undefined) {
			return <></>;
		}

		const storedTalisman = props.talismans.get(props.currentTalisman);
		assert(
			storedTalisman,
			`Expected player to own talisman of id: "${props.currentTalisman}" since they have it equipped.`,
		);

		const talismanPhase = storedTalisman.phase;
		if (cachedTalisman.id !== props.currentTalisman) {
			cachedTalisman.id = props.currentTalisman;
			cachedTalisman.phase = talismanPhase;

			return <></>;
		}

		if (cachedTalisman.phase === talismanPhase) {
			return <></>;
		} else {
			cachedTalisman.phase = talismanPhase;
		}

		/// Level up frame.
		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.1;
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

		const talismanData = getTalismanData(props.currentTalisman);

		return (
			<frame
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.075)}
				Size={frameBindingMotor.binding.map((value) => {
					return UDim2.fromScale(0.2, value);
				})}
				Visible={frameBindingMotor.binding.map((value) => {
					return value > 0;
				})}
				BackgroundColor3={Color3.fromRGB(75, 75, 75)}
			>
				<uiaspectratioconstraint AspectRatio={3.5} />
				<uicorner CornerRadius={new UDim(0.12, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(20, 46, 47) }} />

				<PhaseDisplay phase={talismanPhase} />
				<TalismanName talismanName={talismanData.name} phase={talismanPhase} />
			</frame>
		);
	}),
);
