import Roact from "@rbxts/roact";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";

import { CurrencyViewer } from "./currencyViewer";
import { PetQuestIcon } from "./petQuest";
import { RanksViewer } from "./rankViewer";

interface HudProps {
	displayTeleportation: () => void;
	displayItems: () => void;
	displayAutoFight: () => void;
	displayAccount: () => void;
	displayTradingMenu: () => void;
	displayCodes: () => void;
	displaySettings: () => void;
	displayShop: () => void;
	displaySpinWheel: () => void;
}

/**
 * A single icon on the hud.
 *
 * @param props The properties of the components.
 * @param props.icon The icon to display.
 * @param props.title The title of the icon.
 * @param props.onClick The function to call when the icon is clicked.
 * @param props.position The position of the icon.
 * @param props.size The size of the icon.
 * @returns The element to render.
 */
const HudIcon = (props: {
	position: UDim2;
	size: number;
	icon: string;
	title: string;
	onClick: () => void;
}): Roact.Element => {
	return (
		<SpringImageButton
			native={{
				Position: props.position,
				Image: props.icon,
			}}
			size={{ minSize: props.size - 0.005, maxSize: props.size + 0.005 }}
			events={{
				/**
				 * When the icon is clicked call props.onClick.
				 */
				Activated: (): void => {
					playSFX(UIEngagement.MajorEngagement);
					props.onClick();
				},
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />

			<StrokeTextLabel
				native={{
					Size: UDim2.fromScale(1, 0.35),
					Position: UDim2.fromScale(0.5, 0.1),
					Text: props.title,
				}}
				stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
			/>
		</SpringImageButton>
	);
};

/**
 * The main hud that is displayed on the screen.
 */
export const Hud = hooks((props: HudProps) => {
	return (
		<BaseFrame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
			{/* Icons */}
			<HudIcon
				icon={assetIds.images.ui.hud.icons.teleport}
				title={"Teleport"}
				onClick={(): void => props.displayTeleportation()}
				position={UDim2.fromScale(0.032, 0.409)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.rewards}
				title={"Stats"}
				onClick={(): void => props.displayAccount()}
				position={UDim2.fromScale(0.083, 0.409)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.wheel}
				title={"Spin"}
				onClick={(): void => props.displaySpinWheel()}
				position={UDim2.fromScale(0.134, 0.409)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.codes}
				title={"Codes"}
				onClick={(): void => props.displayCodes()}
				position={UDim2.fromScale(0.185, 0.409)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.account.accountMastery}
				title={"Mastery"}
				onClick={(): void => {}}
				position={UDim2.fromScale(0.032, 0.666)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.shop.accolades}
				title={"Accolades"}
				onClick={(): void => {}}
				position={UDim2.fromScale(0.083, 0.666)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.shop["playtime rewards"]}
				title={"Rewards"}
				onClick={(): void => {}}
				position={UDim2.fromScale(0.134, 0.666)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.shop["biweekly pet"]}
				title={"Index"}
				onClick={(): void => {}}
				position={UDim2.fromScale(0.185, 0.666)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.items}
				title={"Items"}
				onClick={(): void => props.displayItems()}
				position={UDim2.fromScale(0.895, 0.742)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.trading}
				title={"Trading"}
				onClick={(): void => props.displayTradingMenu()}
				position={UDim2.fromScale(0.895, 0.84)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.options}
				title={"Settings"}
				onClick={(): void => props.displaySettings()}
				position={UDim2.fromScale(0.895, 0.938)}
				size={0.075}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons["auto fight"]}
				title={"Auto"}
				onClick={(): void => props.displayAutoFight()}
				position={UDim2.fromScale(0.958, 0.767)}
				size={0.125}
			/>
			<HudIcon
				icon={assetIds.images.ui.hud.icons.shop}
				title={"Shop"}
				onClick={(): void => props.displayShop()}
				position={UDim2.fromScale(0.958, 0.914)}
				size={0.125}
			/>
			<CurrencyViewer position={UDim2.fromScale(0.012, 0.5)} currencyType={"coins"} />
			<CurrencyViewer position={UDim2.fromScale(0.012, 0.585)} currencyType={"gems"} />
			<CurrencyViewer position={UDim2.fromScale(0.79, 0.585)} currencyType={"gears"} />
			<RanksViewer />
			<PetQuestIcon />
		</BaseFrame>
	);
});
