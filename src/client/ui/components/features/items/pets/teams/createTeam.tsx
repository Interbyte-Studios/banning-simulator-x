import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
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
export const CreatePetTeam = RoactRodux.connect(mapStateToProps)(
	hooks((props: CreatePetTeamProps, hooks) => {
		const { useContext } = hooks;
		const { createPetTeam } = useContext(remoteContext);

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 131, 212)}
				Size={UDim2.fromScale(0.975, 0.25)}
				LayoutOrder={props.layoutId}
			>
				<uiaspectratioconstraint AspectRatio={6.95} />
				<uicorner CornerRadius={new UDim(0.1, 0)} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.3),
						Text: "Create Pet Team",
					}}
					stroke={{ native: { Thickness: 1.5, Color: uiTextStrokeColor } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.75),
						Image: assetIds.images.ui["weapon shop"]["purchase button"],
					}}
					size={{ minSize: 0.325, maxSize: 0.35 }}
					events={{
						// eslint-disable-next-line jsdoc/require-jsdoc
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							const equippedPets = props.pets.filter((pet) => pet.equipped);

							const petsToCreateTeamWith = equippedPets.map((pet) => {
								return pet.guid;
							});

							createPetTeam.SendToServer(petsToCreateTeamWith);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={3.45} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.95),
							Text: "Create",
						}}
						stroke={{ native: { Thickness: 1.5, Color: Color3.fromRGB(18, 176, 13) } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	}),
);
