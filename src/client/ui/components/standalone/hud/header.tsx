import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { hooks } from "client/ui/hooks";

import { AccountIcon } from "./accountIcon";
import { AutoFightIcon } from "./autoFightIcon";
import { ItemsIcon } from "./itemsIcon";
import { TeleportIcon } from "./teleportIcon";

interface HUDHeaderProps {
	displayItems: () => void;
	displayAccount: () => void;
	displayAutoFight: () => void;
	displayTeleportation: () => void;
}

export const HUDHeader = hooks((props: HUDHeaderProps) => {
	return (
		<BaseFrame
			AnchorPoint={new Vector2(0, 0.5)}
			Size={UDim2.fromScale(0.9, 0.15)}
			Position={UDim2.fromScale(0.03, 0.15)}
		>
			<uilistlayout
				Padding={new UDim(0.05, 0)}
				FillDirection={Enum.FillDirection.Horizontal}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<ItemsIcon displayItems={props.displayItems} />
			<AccountIcon dispayAccount={props.displayAccount} />
			<AutoFightIcon displayAutoFightIcon={props.displayAutoFight} />
			<TeleportIcon displayTeleportationMenu={props.displayTeleportation} />
		</BaseFrame>
	);
});
