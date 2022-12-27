import Roact from "@rbxts/roact";
import { hooks } from "client/ui/hooks";

import { CodesIcon } from "./codesIcon";
import { ItemsIcon } from "./itemsIcon";
import { OptionsIcon } from "./optionsIcon";
import { RewardsIcon } from "./rewardsIcon";

interface HUDHeaderProps {
	displayCodesMenu: () => void;
	displaySettingsMenu: () => void;
	displayItemsMenu: () => void;
}

export const HUDHeader = hooks((props: HUDHeaderProps) => {
	return (
		<frame
			BackgroundTransparency={1}
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
			<OptionsIcon displaySettingsMenu={props.displaySettingsMenu} />
			<CodesIcon displayCodesMenu={props.displayCodesMenu} />
			<ItemsIcon displayItemsMenu={props.displayItemsMenu} />
			<RewardsIcon />
		</frame>
	);
});
