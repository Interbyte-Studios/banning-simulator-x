import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { StoreState } from "shared/rodux";
import { PetTeamsState } from "shared/rodux/petTeams";

import { CreatePetTeam } from "./createTeam";
import { PurchasePetTeam } from "./purchaseTeam";
import { ViewPetTeam } from "./viewTeam";

interface PetTeamsMappedProps {
	petTeams: PetTeamsState;
}

/**
 * @param state The current state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): PetTeamsMappedProps {
	return {
		petTeams: state.petTeams,
	};
}

/**
 * Displays all the player's pet teams.
 */
export const PetTeams = RoactRodux.connect(mapStateToProps)(
	hooks((props: PetTeamsMappedProps, { useEffect, useValue }) => {
		const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
		useEffect(() => {
			const uiListLayout = uiListLayoutRef.value.getValue();
			assert(uiListLayout, `Failed to get Teleportation's UIListLayout.`);

			const scrollingFrame = uiListLayout.Parent;
			assert(scrollingFrame, `Failed to get Teleportation ScrollingFrame.`);
			assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Teleportation to have a ScrollingFrame.`);

			scrollingFrame.GetChildren().forEach((teleportationCard) => {
				if (teleportationCard.IsA("ImageLabel")) {
					teleportationCard.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});

		const teamsToDisplay: Array<Roact.Element> = [];
		for (const team of props.petTeams.teams) {
			teamsToDisplay.push(<ViewPetTeam pets={team.pets} name={team.name} id={team.id} />);
		}

		if (props.petTeams.teams.size() < props.petTeams.maxTeams) {
			teamsToDisplay.push(<CreatePetTeam layoutId={teamsToDisplay.size() + 1} />);
		}

		if (props.petTeams.maxTeams < 10) {
			teamsToDisplay.push(<PurchasePetTeam layoutId={teamsToDisplay.size() + 1} />);
		}

		return (
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.61)}
				Size={UDim2.fromScale(0.975, 0.75)}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					SortOrder={Enum.SortOrder.LayoutOrder}
					Ref={uiListLayoutRef.value}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 10)}
				/>
				{teamsToDisplay}
			</RescalingScrollingFrame>
		);
	}),
);
