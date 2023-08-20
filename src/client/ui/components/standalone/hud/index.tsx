import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { getAmountOfPets } from "client/modules/uiNotifications/petsModule";
import { uiTextStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { Notification } from "client/ui/elements/common/notification";
import { hooks } from "client/ui/hooks";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { getPetMasteryUnclaimedChallenges } from "client/util/getPetMasteryUnclaimedChallenges";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { ACCOLADES } from "shared/configs/accolades";
import { EGGS } from "shared/configs/eggs";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { AccoladeState } from "shared/rodux/accolade";
import { BansState } from "shared/rodux/bans";
import { DailyRewardsState } from "shared/rodux/dailyRewards";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { RankState } from "shared/rodux/rank";
import { RebirthState } from "shared/rodux/rebirths";
import { SpinWheelState } from "shared/rodux/spinWheel";
import { TalismansState } from "shared/rodux/talismans";
import { WeaponsState } from "shared/rodux/weapons";

import { CurrencyViewer } from "./currencyViewer";
import { PetQuestIcon } from "./petQuest";
import { RanksViewer } from "./rankViewer";

let lastDailyTimerCheck = 0;

interface HudProps extends HudMappedProps {
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
	displayAdmin: () => void;
}

interface HudMappedProps {
	pets: PetsState;
	accolades: AccoladeState;
	weapons: WeaponsState;
	talismans: TalismansState;
	wheelSpin: SpinWheelState;
	dailyRewards: DailyRewardsState;
	rank: RankState;
	gamepasses: GamepassesState;
	rebirths: RebirthState;
	bans: BansState;
}

/**
 * Maps the store state to the props of the component.
 *
 * @param state The current state of the store.
 * @returns The props of the component.
 */
const mapStateToProps = (state: StoreState): HudMappedProps => {
	return {
		bans: state.bans,
		pets: state.pets,
		accolades: state.accolades,
		weapons: state.weapons,
		talismans: state.talismans,
		wheelSpin: state.spinWheel,
		dailyRewards: state.dailyRewards,
		rank: state.rank,
		gamepasses: state.gamepasses,
		rebirths: state.rebirths,
	};
};

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
 * @param props.notification The notification to display.
 * @param props.notification.amount The amount of notifications.
 * @param props.notification.size The size of the notification.
 * @param props.notification.position The position of the notification.
 * @returns The element to render.
 */
const HudIcon = (props: {
	position: UDim2;
	size: { minSize: number; maxSize: number };
	icon: string;
	title: string;
	notification?: {
		amount: number;
		size: UDim2;
		position: UDim2;
	};
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

			{props.notification && (
				<Notification
					amount={props.notification.amount}
					size={props.notification.size}
					position={props.notification.position}
				/>
			)}

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

const lastWorldCheck = 0;

/**
 * @returns Time.
 */
function getTime(): number {
	return time();
}

/**
 * The main hud that is displayed on the screen.
 */
export const Hud = RoactRodux.connect(mapStateToProps)(
	hooks((props: HudProps, { useState, useEffect, useContext }) => {
		const [world, setWorld] = useState<WorldName>("Ban Land");
		const [time, setTime] = useState(0);

		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			const connection = RunService.RenderStepped.Connect(() => {
				debug.setmemorycategory("hudDailyRewardsCounter");
				debug.profilebegin("hudDailyRewardsCounter");
				const now = os.time();
				if (now - lastDailyTimerCheck < 1) {
					return;
				}
				lastDailyTimerCheck = now;
				setTime(os.time());
				debug.profileend();
			});
			return (): void => connection.Disconnect();
		}, [props.dailyRewards]);

		useEffect(() => {
			const connection = RunService.RenderStepped.Connect(() => {
				debug.setmemorycategory("hudWorldCheck");
				debug.profilebegin("hudWorldCheck");

				const now = getTime();
				if (now - lastWorldCheck < 1) {
					return;
				}

				const currentWorld = getCurrentWorld();
				if (currentWorld !== undefined && currentWorld !== world) {
					setWorld(currentWorld);
				}
				debug.profileend();
			});

			return (): void => connection.Disconnect();
		}, []);

		// for pet notifications
		const unseenPets = props.pets.size() - getAmountOfPets();

		// for index notifications
		let unseenChallenges = 0;
		for (const [eggName] of pairs(EGGS)) {
			unseenChallenges += getPetMasteryUnclaimedChallenges(eggName);
		}

		// for daily reward notifications
		const timeTillClaim = time - props.dailyRewards.lastClaimed;
		const unseenDailyRewards = timeTillClaim > 86400;

		// for spin the wheel notifications
		const unseenSpins = props.wheelSpin.spinsAvailable + props.wheelSpin.purchasedSpinsAvailable;

		// for accolades notifications
		let unseenAccolades = 0;
		const store = retrieveStore(Players.LocalPlayer);
		if (store !== undefined) {
			for (const accolade of ACCOLADES) {
				const ownsAccolade = props.accolades.find((storedAccolade) => storedAccolade === accolade.id);
				if (ownsAccolade === undefined) {
					if (accolade.progress(store.getState()) === true) {
						unseenAccolades = unseenAccolades + 1;
					}
				}
			}
		}

		const currentRebirth = props.rebirths.rebirth;
		const nextRebirth = currentRebirth + 1;
		const rebirthThreshold = nextRebirth > 1 ? nextRebirth ** 5 : 10;
		const unseenRebirths = props.bans.bans >= rebirthThreshold;

		// for currency display
		const worldData = WORLDS[world];

		return (
			<BaseFrame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
				{/* Left Side */}
				<BaseFrame Position={UDim2.fromScale(0.113, 0.574)} Size={UDim2.fromScale(0.216, 0.37)}>
					<uiaspectratioconstraint AspectRatio={1.1} />
					{!props.hiddenHud && (
						<BaseFrame
							Position={world === "Ban Land" ? UDim2.fromScale(0.445, -0.077) : UDim2.fromScale(0.445, 0.04)}
							Size={UDim2.fromScale(0.851, 0.218)}
						>
							<uilistlayout
								Padding={new UDim(0.03, 0)}
								FillDirection={Enum.FillDirection.Horizontal}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.teleport}
								title={"Teleport"}
								onClick={(): void => {
									if (!(props.gamepasses.Teleportation || props.rebirths.teleport)) {
										addAnnouncement(`Purchase Teleportation from Rebirths!`, AnnouncementType.Error);
										return;
									}

									props.displayTeleportation();
								}}
								position={UDim2.fromScale(0.032, 0.409)}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.rebirths}
								title={"Rebirth"}
								onClick={(): void => props.displayAccount()}
								position={UDim2.fromScale(0.083, 0.409)}
								size={{ minSize: 0.9, maxSize: 1 }}
								notification={
									unseenRebirths === true
										? {
												amount: 1,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.wheel}
								title={"Spin"}
								onClick={(): void => props.displaySpinWheel()}
								position={UDim2.fromScale(0.134, 0.409)}
								size={{ minSize: 0.9, maxSize: 1 }}
								notification={
									unseenSpins > 0
										? {
												amount: unseenSpins,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
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
						position={world === "Ban Land" ? UDim2.fromScale(0.02, 0.162) : UDim2.fromScale(0.02, 0.275)}
						size={UDim2.fromScale(0.891, 0.35)}
						currencyType={worldData.reward}
					/>
					<CurrencyViewer
						position={world === "Ban Land" ? UDim2.fromScale(0.02, 0.383) : UDim2.fromScale(0.02, 0.5)}
						size={UDim2.fromScale(0.891, 0.35)}
						currencyType={"gems"}
					/>
					{world === "Ban Land" && (
						<CurrencyViewer
							position={UDim2.fromScale(0.02, 0.601)}
							size={UDim2.fromScale(0.891, 0.35)}
							currencyType={"gears"}
						/>
					)}
					{!props.hiddenHud && (
						<BaseFrame
							Position={world === "Ban Land" ? UDim2.fromScale(0.454, 0.835) : UDim2.fromScale(0.454, 0.75)}
							Size={UDim2.fromScale(0.851, 0.218)}
						>
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
								notification={
									unseenAccolades > 0
										? {
												amount: unseenAccolades,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.daily}
								title={"Rewards"}
								onClick={(): void => props.displayDailyRewards()}
								position={UDim2.fromScale(0.134, 0.666)}
								size={{ minSize: 0.9, maxSize: 1 }}
								notification={
									unseenDailyRewards
										? {
												amount: 1,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.petMastery}
								title={"Index"}
								onClick={(): void => props.displayPetMastery()}
								position={UDim2.fromScale(0.185, 0.666)}
								size={{ minSize: 0.9, maxSize: 1 }}
								notification={
									unseenChallenges > 0
										? {
												amount: unseenChallenges,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
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
								notification={
									unseenPets >= 1
										? {
												amount: unseenPets,
												size: UDim2.fromScale(0.4, 0.4),
												position: UDim2.fromScale(0.1, 0.9),
										  }
										: undefined
								}
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
								position={UDim2.fromScale(0.83, -0.65)}
								size={{ minSize: 0.3, maxSize: 0.35 }}
							/>
							<HudIcon
								icon={assetIds.images.ui.hud.icons.rewards}
								title={"Stats"}
								onClick={(): void => props.displayAdmin()}
								position={UDim2.fromScale(0.15, -1.4)}
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
	}),
);
