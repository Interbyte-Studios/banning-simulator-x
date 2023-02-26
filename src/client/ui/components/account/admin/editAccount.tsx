import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";

interface EditAccountProps {
	groupRank: number | undefined;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function editAccountMapProps(state: StoreState): EditAccountProps {
	return {
		groupRank: state.index.groupRank,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EditAccount = RoactRodux.connect(editAccountMapProps)(
	hooks((props: EditAccountProps, { useEffect }) => {
		if (props.groupRank === undefined || props.groupRank < 250) {
			return <></>;
		}

		const minimizedSize = 0.085;
		const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = new Flipper.SingleMotor(maximizedSize);
		const [binding, setBinding] = Roact.createBinding(motor.getValue());

		motor.onStep(setBinding);

		useEffect(() => {
			return (): void => {
				motor.destroy();
			};
		}, []);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.225, 0.95)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.2, value);
				})}
				Image={assetIds.images.ui.inventory.pets["function button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
					},
					MouseEnter: (): void => motor.setGoal(minizmizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.9, 0.9)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"Edit"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(176, 94, 0) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
