import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RarityGradient } from "client/ui/elements/rarityGradient";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
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
/* eslint-disable jsdoc/require-jsdoc */
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
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.4, 0.15)}
				Position={UDim2.fromScale(0.5, 0.5)}
				LayoutOrder={props.pet}
			>
				<uiaspectratioconstraint AspectRatio={3.3} />
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Image={""}
					Event={{
						Activated: (): void => {
							if (props.currentPet !== undefined && props.currentPet === props.pet) {
								props.displayPet(undefined);
								return;
							}

							props.displayPet(props.pet);
						},
						MouseEnter: (): void => motor.setGoal(raisedSpring),
						MouseLeave: (): void => motor.setGoal(normalSpring),
					}}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />
					<uiaspectratioconstraint AspectRatio={4} />

					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.575, 0.5)}
						Size={UDim2.fromScale(0.7, 0.9)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={isDiscovered ? petData.name : `???`}
						Font={font}
					>
						<RarityGradient Rarity={petData.rarity} />
						<BaseUIStroke native={{ Thickness: 3 }} />
					</textlabel>
				</imagebutton>
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					Position={UDim2.fromScale(0.05, 0.5)}
					Size={UDim2.fromScale(0.3, 1.2)}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 100, 163) }} />

					<imagelabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.9, 0.9)}
						Position={binding.map((value) => {
							return UDim2.fromScale(0.5, value);
						})}
						Image={getPetImage(props.pet, props.currentVariant ?? "regular")}
						ImageColor3={isDiscovered ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(0, 0, 0)}
						ScaleType={Enum.ScaleType.Fit}
					/>
				</frame>
			</frame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
