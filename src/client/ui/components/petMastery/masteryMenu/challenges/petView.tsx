import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";

interface PetViewProps extends PetViewMappedProps {
	pet: number;
	currentVariant: Variants | undefined;
	activated: () => void;
}

interface PetViewMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): PetViewMappedProps {
	return {
		index: state.index,
	};
}

/**
 * A decal of the pet being viewed in the pet mastery component.
 */
export const PetView = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetViewProps, hooks) => {
		const petsIndex = props.index.pets.get(props.pet);

		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		return (
			<ImageButton
				native={{
					Position: UDim2.fromScale(0.1, 0.225),
					Size: UDim2.fromScale(0.1, 3),
					BackgroundColor3: Color3.fromRGB(0, 131, 213),
					Image: "",
				}}
				events={{
					/* eslint-disable jsdoc/require-jsdoc */
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
						props.activated();
					},
					MouseEnter: (): void => motor.setGoal(raisedSpring),
					MouseLeave: (): void => motor.setGoal(normalSpring),
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
						ImageColor3: petsIndex !== undefined ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0),
					}}
				/>
			</ImageButton>
		);
	}),
);
