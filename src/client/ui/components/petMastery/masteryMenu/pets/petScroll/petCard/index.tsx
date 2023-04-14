import Flipper from "@rbxts/flipper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RarityGradient } from "client/ui/elements/gradients/rarityGradient";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import { Variants } from "shared/configs/pets";
import { StoreState } from "shared/rodux";
import { PlayerIndexState } from "shared/rodux/playerIndex";
import { getPetData } from "shared/util/getPetData";

interface IndexPetCardProps extends IndexPetCardMappedProps {
	pet: number;
	currentPet: number | undefined;
	currentVariant: Variants | undefined;
	displayPet: (pet: number | undefined) => void;
}

interface IndexPetCardMappedProps {
	index: PlayerIndexState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current store state.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): IndexPetCardMappedProps {
	return {
		index: state.index,
	};
}

/**
 * A button allowing the player to view information about a specific pet.
 */
export const IndexPetCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: IndexPetCardProps, hooks) => {
		const petData = getPetData(props.pet);
		const isDiscovered = props.index.pets.get(props.pet) !== undefined;

		const raisedPosition = 0.4;
		const raisedSpring = new Flipper.Spring(raisedPosition, { frequency: 5 });

		const normalPosition = 0.5;
		const normalSpring = new Flipper.Spring(normalPosition, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, normalPosition);

		return (
			<BaseFrame Size={UDim2.fromScale(0.4, 0.15)} Position={UDim2.fromScale(0.5, 0.5)} LayoutOrder={props.pet}>
				<uiaspectratioconstraint AspectRatio={3.3} />
				<ImageButton
					native={{
						BackgroundTransparency: 0,
						Size: UDim2.fromScale(1, 1),
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						Image: "",
					}}
					events={{
						/* eslint-disable jsdoc/require-jsdoc */
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.currentPet !== undefined && props.currentPet === props.pet) {
								props.displayPet(undefined);
								return;
							}

							props.displayPet(props.pet);
						},
						MouseEnter: (): void => motor.setGoal(raisedSpring),
						MouseLeave: (): void => motor.setGoal(normalSpring),
						/* eslint-enable jsdoc/require-jsdoc */
					}}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
					<uiaspectratioconstraint AspectRatio={4} />

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.575, 0.5),
							Size: UDim2.fromScale(0.7, 0.9),
							Text: isDiscovered ? petData.name : `???`,
						}}
						stroke={{ native: { Thickness: 3 } }}
					>
						<RarityGradient Rarity={petData.rarity} />
					</StrokeTextLabel>
				</ImageButton>
				<BaseFrame
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.05, 0.5)}
					Size={UDim2.fromScale(0.3, 1.2)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Position: binding.map((value) => UDim2.fromScale(0.5, value)),
							Image: getPetImage(props.pet, props.currentVariant ?? "regular"),
							ImageColor3: isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0),
						}}
					/>
				</BaseFrame>
			</BaseFrame>
		);
	}),
);
