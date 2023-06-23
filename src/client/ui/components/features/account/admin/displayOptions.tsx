// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";

import { ValidAdminOption } from ".";
import { AdminOption } from "./adminOption";

/* eslint-disable jsdoc/require-jsdoc */
export const DisplayAdminOptions = hooks((props: { setActiveAction: (action: ValidAdminOption) => void }) => {
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
					props.setActiveAction("SpawnPet");
				}}
				header={"Spawn Pet"}
			/>
			<AdminOption displayOption={(): void => props.setActiveAction("ModifyPetLevel")} header={"Modify Pet Level"} />
			<AdminOption
				displayOption={(): void => props.setActiveAction("ModifyWeaponLevel")}
				header={"Modify Weapon Level"}
			/>
			<AdminOption
				displayOption={(): void => props.setActiveAction("ModifyTalismanLevel")}
				header={"Modify Talisman Level"}
			/>
			<AdminOption displayOption={(): void => props.setActiveAction("ModifyRank")} header={"Modify Rank"} />
			<AdminOption displayOption={(): void => props.setActiveAction("ModifyCurrency")} header={"Spawn Currency"} />
			<AdminOption displayOption={(): void => props.setActiveAction("Shutdown")} header={"Shutdown Server"} />
			<AdminOption displayOption={(): void => props.setActiveAction("Kick")} header={"Kick Player"} />
		</scrollingframe>
	);
});
