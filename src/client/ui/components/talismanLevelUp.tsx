import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { TalismanPhases } from "shared/configs/talismans";
import { StoreState } from "shared/rodux";
import { CurrentTalismanState } from "shared/rodux/currentTalisman";
import { TalismansState } from "shared/rodux/talismans";

import { TalismanGradient } from "../elements/talismanGradient";
import { TalismanViewport } from "../elements/talismanViewport";

interface TalismanLevelUpAnimationProps extends TalismanLevelUpAnimationMappedProps {
	enabled: boolean;
}

interface TalismanLevelUpAnimationMappedProps {
	currentTalisman: CurrentTalismanState;
	talismans: TalismansState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): TalismanLevelUpAnimationMappedProps {
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
 * An animation that plays when a player levels up their talisman.
 */
export const TalismanLevelUpAnimation = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanLevelUpAnimationProps, hooks) => {
		if (!props.enabled) {
			return <></>;
		}

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

		warn(`Displaying animation for ${talismanPhase}`);

		/// Level up frame.
		const minimizedSize = 0;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.2;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const frameBindingMotor = useBindingMotor(hooks, minimizedSize);

		const { useEffect } = hooks;
		useEffect(() => {
			task.defer(() => {
				task.wait(0.2);
				frameBindingMotor.motor.setGoal(maximizedSpring);
				task.wait(5);
				frameBindingMotor.motor.setGoal(minimizedSpring);
			});
		});

		return (
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.125)}
				Size={UDim2.fromScale(0.4, 0.2)}
				Image={assetIds.images.ui.levelup.LevelUp}
				ScaleType={Enum.ScaleType.Fit}
				Visible={true}
			>
				<uiaspectratioconstraint AspectRatio={2.2} />

				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.15, 0.675)}
					Size={UDim2.fromScale(0.25, 0.6)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(0.175, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

					<TalismanViewport
						native={{
							AnchorPoint: vec2Middle,
							BackgroundTransparency: 1,
							Size: UDim2.fromScale(0.9, 0.9),
							Position: UDim2.fromScale(0.5, 0.5),
						}}
						talismanId={props.currentTalisman}
						phase={storedTalisman.phase}
					/>
				</frame>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.185)}
					Size={UDim2.fromScale(0.6, 0.3)}
					Font={font}
					Text={"Congratulations"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(185, 81, 1) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.635, 0.55)}
					Size={UDim2.fromScale(0.685, 0.25)}
					Font={font}
					Text={"Talisman Upgrade!"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(0, 100, 163) }} />
				</textlabel>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.635, 0.775)}
					Size={UDim2.fromScale(0.685, 0.2)}
					Font={font}
					Text={`${
						storedTalisman.phase === "artifact" ? "Artifact" : storedTalisman.phase === "awakend" ? "Awakend" : "Normal"
					} Phase`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<TalismanGradient phase={storedTalisman.phase} />
					<BaseUIStroke native={{ Thickness: 3, Color: Color3.fromRGB(0, 100, 163) }} />
				</textlabel>
			</imagelabel>
		);
	}),
);
