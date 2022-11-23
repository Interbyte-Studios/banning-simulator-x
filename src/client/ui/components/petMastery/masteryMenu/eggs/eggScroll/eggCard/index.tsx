import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { getEggImage } from "client/util/getEggImage";
import { EggName } from "shared/configs/eggs";

/**
 * A button allowing the player to view information about a specific egg.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const IndexEggCard = hooks(
	(
		props: {
			egg: EggName;
			layoutOrder: number;
			currentEgg: EggName | undefined;
			displayEgg: (eggName: EggName | undefined) => void;
		},
		hooks,
	) => {
		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				Size={UDim2.fromScale(0.9, 0.125)}
				BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				LayoutOrder={props.layoutOrder}
				Image={""}
				Event={{
					Activated: (): void => {
						if (props.currentEgg !== undefined && props.currentEgg === props.egg) {
							props.displayEgg(undefined);
							return;
						}

						props.displayEgg(props.egg);
					},
					MouseEnter: (): void => motor.setGoal(raisedSpring),
					MouseLeave: (): void => motor.setGoal(normalSpring),
				}}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke Thickness={2} Color={Color3.fromRGB(0, 100, 163)} />

				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.55, 0.5)}
					Size={UDim2.fromScale(0.8, 0.9)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={props.egg}
					Font={font}
				>
					<BaseUIStroke Thickness={3} />
				</textlabel>

				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromScale(0.4, 1.2)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke Thickness={2} Color={Color3.fromRGB(0, 100, 163)} />

					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.9, 0.9)}
						Position={binding.map((value) => {
							return UDim2.fromScale(0.5, value);
						})}
						Image={getEggImage(props.egg)}
						ScaleType={Enum.ScaleType.Fit}
					/>
				</frame>
			</imagebutton>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */
