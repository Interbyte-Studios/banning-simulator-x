import Roact from "@rbxts/roact";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
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
	displayAccolades: () => void;
	displayMastery: () => void;
	displayPetMastery: () => void;
	displayDailyRewards: () => void;
	displayPetQuest: () => void;
	hiddenHud: boolean;
	autoFightActive: boolean;
	disableAutoFight: () => void;
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
 * @param props.size.minSize The minimum size of the icon.
 * @param props.size.maxSize The maximum size of the icon.
 * @returns The element to render.
 */
const HudIcon = (props: {
	position: UDim2;
	size: { minSize: number; maxSize: number };
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
			size={{ minSize: props.size.minSize, maxSize: props.size.maxSize }}
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
			{/* Left Side */}
			<BaseFrame Position={UDim2.fromScale(0.113, 0.574)} Size={UDim2.fromScale(0.216, 0.37)}>
				<uiaspectratioconstraint AspectRatio={1.1} />
				{!props.hiddenHud && (
					<BaseFrame Position={UDim2.fromScale(0.445, -0.077)} Size={UDim2.fromScale(0.851, 0.218)}>
						<uilistlayout
							Padding={new UDim(0.03, 0)}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.teleport}
							title={"Teleport"}
							onClick={(): void => props.displayTeleportation()}
							position={UDim2.fromScale(0.032, 0.409)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.rewards}
							title={"Stats"}
							onClick={(): void => props.displayAccount()}
							position={UDim2.fromScale(0.083, 0.409)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.wheel}
							title={"Spin"}
							onClick={(): void => props.displaySpinWheel()}
							position={UDim2.fromScale(0.134, 0.409)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.codes}
							title={"Codes"}
							onClick={(): void => props.displayCodes()}
							position={UDim2.fromScale(0.185, 0.409)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
					</BaseFrame>
				)}

				<CurrencyViewer
					position={UDim2.fromScale(0.02, 0.162)}
					size={UDim2.fromScale(0.891, 0.35)}
					currencyType={"coins"}
				/>
				<CurrencyViewer
					position={UDim2.fromScale(0.02, 0.383)}
					size={UDim2.fromScale(0.891, 0.35)}
					currencyType={"gems"}
				/>
				<CurrencyViewer
					position={UDim2.fromScale(0.02, 0.601)}
					size={UDim2.fromScale(0.891, 0.35)}
					currencyType={"gears"}
				/>
				{!props.hiddenHud && (
					<BaseFrame Position={UDim2.fromScale(0.454, 0.841)} Size={UDim2.fromScale(0.851, 0.218)}>
						<uilistlayout
							Padding={new UDim(0.03, 0)}
							FillDirection={Enum.FillDirection.Horizontal}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>
						<HudIcon
							icon={assetIds.images.ui.account.accountMastery}
							title={"Mastery"}
							onClick={(): void => props.displayMastery()}
							position={UDim2.fromScale(0.032, 0.666)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.accolades}
							title={"Accolades"}
							onClick={(): void => props.displayAccolades()}
							position={UDim2.fromScale(0.083, 0.666)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.daily}
							title={"Rewards"}
							onClick={(): void => props.displayDailyRewards()}
							position={UDim2.fromScale(0.134, 0.666)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.petMastery}
							title={"Index"}
							onClick={(): void => props.displayPetMastery()}
							position={UDim2.fromScale(0.185, 0.666)}
							size={{ minSize: 0.9, maxSize: 1 }}
						/>
					</BaseFrame>
				)}
			</BaseFrame>

			{/* Right Side */}
			<BaseFrame Position={UDim2.fromScale(0.886, 0.5)} Size={UDim2.fromScale(0.239, 0.998)}>
				<uiaspectratioconstraint AspectRatio={0.4} />
				{!props.hiddenHud && (
					<BaseFrame Position={UDim2.fromScale(0.585, 0.831)} Size={UDim2.fromScale(0.828, 0.214)}>
						<HudIcon
							icon={assetIds.images.ui.shop["biweekly pet"]}
							title={"Pets"}
							onClick={(): void => props.displayItems()}
							position={UDim2.fromScale(0.045, -0.65)}
							size={{ minSize: 0.3, maxSize: 0.35 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.trading}
							title={"Trading"}
							onClick={(): void => props.displayTradingMenu()}
							position={UDim2.fromScale(0.31, -0.65)}
							size={{ minSize: 0.3, maxSize: 0.35 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.shop}
							title={"Shop"}
							onClick={(): void => props.displayShop()}
							position={UDim2.fromScale(0.565, -0.65)}
							size={{ minSize: 0.3, maxSize: 0.35 }}
						/>
						<HudIcon
							icon={assetIds.images.ui.hud.icons.options}
							title={"Settings"}
							onClick={(): void => props.displaySettings()}
							position={UDim2.fromScale(0.83, 0 - 0.65)}
							size={{ minSize: 0.3, maxSize: 0.35 }}
						/>
						<SpringImageButton
							native={{
								Position: UDim2.fromScale(0.6, -0.275),
								Image: "",
								BackgroundColor3: Color3.fromRGB(255, 11, 56),
								BackgroundTransparency: 0,
							}}
							size={{ minSize: 0.7, maxSize: 0.75 }}
							events={{
								/**
								 *
								 */
								Activated: (): void => {
									playSFX(UIEngagement.MajorEngagement);
									props.displayAutoFight();
								},
							}}
						>
							<uiaspectratioconstraint AspectRatio={4} />
							<uicorner CornerRadius={new UDim(0.3, 0)} />
							<BaseUIStroke
								native={{
									Thickness: 3,
									Color: Color3.fromRGB(139, 6, 33),
								}}
							/>
							<BaseFrame
								BackgroundColor3={Color3.fromRGB(208, 9, 49)}
								BackgroundTransparency={0}
								Size={UDim2.fromScale(0.925, 0.775)}
							>
								<uicorner CornerRadius={new UDim(0.3, 0)} />
								<SpringImageLabel
									native={{
										Image: assetIds.images.vectors.SwordWithStroke,
										Position: UDim2.fromScale(0.1, 0.5),
									}}
									size={{ minSize: 1, maxSize: 1.1 }}
								/>
								<StrokeTextLabel
									native={{
										Text: "Auto Fight",
										Position: UDim2.fromScale(0.55, 0.5),
										Size: UDim2.fromScale(0.7, 0.7),
										TextXAlignment: Enum.TextXAlignment.Left,
									}}
									stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(77, 74, 75) } }}
								/>
								<StrokeTextLabel
									native={{
										Text: "FREE!",
										Position: UDim2.fromScale(0.9, -0.1),
										Size: UDim2.fromScale(0.3, 0.5),
									}}
									stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(77, 74, 75) } }}
								/>
							</BaseFrame>
						</SpringImageButton>
					</BaseFrame>
				)}

				{props.autoFightActive && props.hiddenHud && (
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.65, 0.575),
							Image: "",
							BackgroundColor3: Color3.fromRGB(92, 255, 74),
							BackgroundTransparency: 0,
						}}
						size={{ minSize: 0.6, maxSize: 0.65 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);
								props.disableAutoFight();
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={4} />
						<uicorner CornerRadius={new UDim(0.3, 0)} />
						<BaseUIStroke
							native={{
								Thickness: 3,
								Color: Color3.fromRGB(56, 154, 45),
							}}
						/>
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(70, 186, 55)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.925, 0.775)}
						>
							<uicorner CornerRadius={new UDim(0.3, 0)} />
							<SpringImageLabel
								native={{
									Image: assetIds.images.vectors.SwordWithStroke,
									Position: UDim2.fromScale(0.1, 0.5),
								}}
								size={{ minSize: 1, maxSize: 1.1 }}
							/>
							<StrokeTextLabel
								native={{
									Text: "Auto Fight",
									Position: UDim2.fromScale(0.55, 0.5),
									Size: UDim2.fromScale(0.7, 0.7),
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(77, 74, 75) } }}
							/>
							<StrokeTextLabel
								native={{
									Text: "FREE!",
									Position: UDim2.fromScale(0.9, -0.1),
									Size: UDim2.fromScale(0.3, 0.5),
								}}
								stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(77, 74, 75) } }}
							/>
						</BaseFrame>
					</SpringImageButton>
				)}
				<RanksViewer />
				{!props.hiddenHud && <PetQuestIcon displayPetQuest={props.displayPetQuest} />}
			</BaseFrame>
		</BaseFrame>
	);
});
