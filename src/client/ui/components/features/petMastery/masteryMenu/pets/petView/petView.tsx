import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Variants } from "shared/configs/pets";

/**
 * A decal of the pet being viewed in the pet mastery component.
 *
 * @param props The props for the component.
 * @param props.pet The pet being viewed.
 * @param props.currentVariant The current variant of the pet being viewed.
 * @param props.isDiscovered Whether the pet has been discovered.
 * @param props.hideInfo The function to call when the button is pressed.
 * @returns The element to render.
 */
export const PetView = hooks(
	(
		props: { pet: number; currentVariant: Variants | undefined; isDiscovered: boolean; hideInfo: () => void },
		hooks,
	) => {
		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		return (
			<ImageButton
				native={{
					BackgroundTransparency: 0,
					Position: UDim2.fromScale(0.225, 0.185),
					Size: UDim2.fromScale(0.4, 1.2),
					BackgroundColor3: Color3.fromRGB(0, 131, 213),
					Image: "",
				}}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.hideInfo();
					},
					MouseLeave: (): void => motor.setGoal(normalSpring),
					MouseEnter: (): void => motor.setGoal(raisedSpring),
					/* eslint-enable jsdoc/require-jsdoc */
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(1, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.9, 0.9),
						Position: binding.map((value) => UDim2.fromScale(0.5, value)),
						Image: getPetImage(props.pet, props.currentVariant ?? "regular"),
						ImageColor3: props.isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0),
					}}
				/>
			</ImageButton>
		);
	},
);
