// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { hooks } from "client/ui/hooks";
import { ADMIN_RANK, MODERATOR_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";

import { ValidAdminOption } from ".";
import { AdminOption } from "./adminOption";

/* eslint-disable jsdoc/require-jsdoc */
export const DisplayAdminOptions = hooks(
	(props: { setActiveAction: (action: ValidAdminOption) => void }, { useContext }) => {
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		return (
			<scrollingframe
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.62)}
				Size={UDim2.fromScale(0.95, 0.675)}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				CanvasSize={UDim2.fromScale(0, 1)}
			>
				<uigridlayout
					CellPadding={UDim2.fromScale(0, 0)}
					CellSize={UDim2.fromScale(0.5, 0.15)}
					SortOrder={Enum.SortOrder.LayoutOrder}
					FillDirectionMaxCells={2}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < ADMIN_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}

						props.setActiveAction("SpawnPet");
					}}
					header={"Spawn Pet"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < MODERATOR_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}
						props.setActiveAction("ModifyPetLevel");
					}}
					header={"Modify Pet Level"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < MODERATOR_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}
						props.setActiveAction("ModifyWeaponLevel");
					}}
					header={"Modify Weapon Level"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < MODERATOR_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}

						props.setActiveAction("ModifyTalismanLevel");
					}}
					header={"Modify Talisman Level"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < MODERATOR_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}

						props.setActiveAction("ModifyRank");
					}}
					header={"Modify Rank"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < ADMIN_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}

						props.setActiveAction("ModifyCurrency");
					}}
					header={"Spawn Currency"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < ADMIN_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}

						props.setActiveAction("Shutdown");
					}}
					header={"Shutdown Server"}
				/>
				<AdminOption
					displayOption={(): void => {
						if (Players.LocalPlayer.GetRankInGroup(GROUP_ID) < MODERATOR_RANK) {
							addAnnouncement(`You cannot access this feature.`, AnnouncementType.Error);
							return;
						}
						props.setActiveAction("Kick");
					}}
					header={"Kick Player"}
				/>
			</scrollingframe>
		);
	},
);
