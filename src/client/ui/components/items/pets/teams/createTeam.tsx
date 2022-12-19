import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { PetsState } from "shared/rodux/pets";

interface CreatePetTeamProps extends CreatePetTeamMappedProps {
	layoutId: number;
}

interface CreatePetTeamMappedProps {
	pets: PetsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): CreatePetTeamMappedProps {
	return {
		pets: state.pets,
	};
}

/**
 * A card that allows the player to create pet teams.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const CreatePetTeam = RoactRodux.connect(mapStateToProps)(
	hooks((props: CreatePetTeamProps, hooks) => {
		const { useContext } = hooks;
		const { createPetTeam } = useContext(remoteContext);

		const maximizedSize = 0.35;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const minimizedSize = 0.325;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const { motor, binding } = useBindingMotor(hooks, maximizedSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 131, 212)}
				Size={UDim2.fromScale(0.975, 0.25)}
				LayoutOrder={props.layoutId}
			>
				<uiaspectratioconstraint AspectRatio={6.95} />
				<uicorner CornerRadius={new UDim(0.1, 0)} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.3)}
					Size={UDim2.fromScale(0.5, 0.5)}
					Font={font}
					Text={"Create Pet Team"}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 93, 150) }} />
				</textlabel>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.75)}
					Size={binding.map((value) => {
						return UDim2.fromScale(0.25, value);
					})}
					Image={assetIds.images.ui["weapon shop"]["purchase button"]}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							const equippedPets = props.pets.filter((pet) => pet.equipped);

							const petsToCreateTeamWith = equippedPets.map((pet) => {
								return pet.guid;
							});

							createPetTeam.SendToServer(petsToCreateTeamWith);
						},
						MouseEnter: (): void => motor.setGoal(minimizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.45} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						Font={font}
						Text={"Create"}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) }} />
					</textlabel>
				</imagebutton>
			</frame>
		);
	}),
);
