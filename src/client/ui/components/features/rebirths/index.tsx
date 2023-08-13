import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiClaimButtonStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { BansState } from "shared/rodux/bans";
import { CurrenciesState } from "shared/rodux/currencies";
import { RebirthState } from "shared/rodux/rebirths";
import { statsAbbreviator, twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface RebirthsProps extends RebirthMappedProps {
	hideMenu: () => void;
}

interface RebirthMappedProps {
	rebirths: RebirthState;
	bans: BansState;
	currencies: CurrenciesState;
}

/**
 * @param state The store state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): RebirthMappedProps => {
	return {
		rebirths: state.rebirths,
		bans: state.bans,
		currencies: state.currencies,
	};
};

export const RebirthCard = hooks(
	(props: {
		icon: string;
		name: string;
		upgradeProgress: string;
		cost: string;
		onPurchased: () => void;
		layoutOrder: number;
	}) => {
		return (
			<BaseFrame
				BackgroundColor3={Color3.fromRGB(14, 134, 209)}
				BackgroundTransparency={0}
				Size={UDim2.fromScale(0.9, 0.9)}
				LayoutOrder={props.layoutOrder}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.15, 0)} />

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.7, 0.9),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.35, maxSize: 0.4 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.onPurchased();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Buy",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>

				<ImageLabel
					native={{
						Size: UDim2.fromScale(0.6, 0.6),
						Image: props.icon,
					}}
				/>

				<CurrencyIcon
					anchorPoint={vec2Middle}
					position={UDim2.fromScale(0.145, 0.9)}
					size={UDim2.fromScale(0.175, 0.175)}
					currency={"gems"}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.345, 0.9),
						Size: UDim2.fromScale(0.225, 0.115),
						Text: props.cost,
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: "gems" }}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.07),
						Size: UDim2.fromScale(0.95, 0.125),
						Text: `${props.name} ${props.upgradeProgress}`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: "gems" }}
				/>
			</BaseFrame>
		);
	},
);

/**
 * Rebirths component.
 */
export const Rebirths = RoactRodux.connect(mapStateToProps)(
	hooks((props: RebirthsProps, { useContext }) => {
		const {
			rebirth,
			purchaseAdditionalEggs,
			purchaseAdditionalPets,
			purchaseCurrencyUpgrade,
			purchaseExtraLuck,
			purchaseFastHatch,
			purchaseMagicEggs,
			purchaseTeleport,
		} = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		const currentRebirth = props.rebirths.rebirth;
		const nextRebirth = currentRebirth + 1;
		const nextRebirthCost = nextRebirth > 1 ? nextRebirth ** 5 : 10;

		const reward = 500 * nextRebirth;
		const gemMultiplier = reward * props.rebirths.currencyMultipliers.gems * 0.3;

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.65, 0.65),
					Image: assetIds.images.ui.account.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.5} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.4, 0.135),
						Position: UDim2.fromScale(0.5, 0.08),
						Text: "Rebirths",
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) },
					}}
				/>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.15, 0.35),
						Size: UDim2.fromScale(0.375, 0.375),
						Image: assetIds.images.vectors.Rebirth,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.9),
							Size: UDim2.fromScale(1, 0.2),
							Text: `Rebirth: ${props.rebirths.rebirth}`,
							TextColor3: Color3.fromRGB(230, 191, 244),
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(65, 3, 90) } }}
					/>
				</ImageLabel>

				<CurrencyIcon
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.45, 0.25)}
					size={{
						minimizedSize: 0.07,
						maximizedSize: 0.09,
					}}
					currency={"gems"}
				/>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.635, 0.25),
						Size: UDim2.fromScale(0.3, 0.075),
						Text: `Reward: ${statsAbbreviator.numberToString(reward + gemMultiplier)}`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: "gems" }}
				/>

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(255, 112, 114)}
					Position={UDim2.fromScale(0.635, 0.35)}
					Size={UDim2.fromScale(0.65, 0.06)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(158, 69, 71) }} />

					<BaseFrame
						AnchorPoint={new Vector2(0, 0)}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(85, 255, 127)}
						Position={UDim2.fromScale(0, 0)}
						Size={UDim2.fromScale(props.bans.bans / nextRebirthCost > 1 ? 1 : props.bans.bans / nextRebirthCost, 1)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(45, 134, 66) }} />
					</BaseFrame>

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 1),
							Text: `${twoDpAbbreviator.numberToString(props.bans.bans)} Bans / ${twoDpAbbreviator.numberToString(
								nextRebirthCost,
							)} Bans (${twoDpAbbreviator.numberToString((props.bans.bans / nextRebirthCost) * 100)}%)`,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(58, 58, 58) } }}
					/>
				</BaseFrame>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.41, 0.48),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.125, maxSize: 0.15 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							if (props.bans.bans >= nextRebirthCost) {
								rebirth.SendToServer();
								addAnnouncement(`Nice! You rebirthed. :)`, AnnouncementType.Announcement);
							} else addAnnouncement(`You don't have enough bans to rebirth!`, AnnouncementType.Error);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Rebirth",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.726, 0.479),
						Size: UDim2.fromScale(0.417, 0.075),
						Text: `Current Ban Multiplier: ${props.rebirths.rebirth >= 1 ? 5 * props.rebirths.rebirth : 1}x`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: "gems" }}
				/>

				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.775)}
					Size={UDim2.fromScale(0.925, 0.375)}
					CanvasSize={UDim2.fromScale(2.365, 0)}
					ScrollBarImageColor3={Color3.fromRGB(0, 108, 176)}
					ScrollBarThickness={12}
					ScrollingDirection={Enum.ScrollingDirection.X}
					BorderSizePixel={0}
				>
					<uilistlayout
						Padding={new UDim(0.005, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.MagicEgg}
						name={"Magic Egg"}
						upgradeProgress={`(${props.rebirths.magicEggUpgrades}/5)`}
						cost={statsAbbreviator.numberToString(5_000)}
						onPurchased={(): void => {
							if (props.rebirths.magicEggUpgrades >= 5) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 5_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseMagicEggs.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={1}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.Egg}
						name={"Additional Eggs"}
						upgradeProgress={`(${props.rebirths.additionalEggs}/2)`}
						cost={statsAbbreviator.numberToString(15_000)}
						onPurchased={(): void => {
							if (props.rebirths.additionalEggs >= 2) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 15_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseAdditionalEggs.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={2}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.PetPaw}
						name={"Additional Pets"}
						upgradeProgress={`(${props.rebirths.additionalPets}/4)`}
						cost={statsAbbreviator.numberToString(15_000)}
						onPurchased={(): void => {
							if (props.rebirths.additionalPets >= 4) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 15_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseAdditionalPets.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={3}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.Coin}
						name={"Coin Multiplier"}
						upgradeProgress={`(${props.rebirths.currencyMultipliers.coins}/10)`}
						cost={statsAbbreviator.numberToString(1_500)}
						onPurchased={(): void => {
							if (props.rebirths.currencyMultipliers.coins >= 10) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 1_500) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseCurrencyUpgrade.SendToServer("coins");
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={4}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.Gem}
						name={"Gem Multiplier"}
						upgradeProgress={`(${props.rebirths.currencyMultipliers.gems}/10)`}
						cost={statsAbbreviator.numberToString(1_500)}
						onPurchased={(): void => {
							if (props.rebirths.currencyMultipliers.gems >= 10) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 1_500) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseCurrencyUpgrade.SendToServer("gems");
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={5}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.Gear}
						name={"Gear Multiplier"}
						upgradeProgress={`(${props.rebirths.currencyMultipliers.gears}/10)`}
						cost={statsAbbreviator.numberToString(1_500)}
						onPurchased={(): void => {
							if (props.rebirths.currencyMultipliers.gears >= 10) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 1_500) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseCurrencyUpgrade.SendToServer("gears");
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={6}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.CyberToken}
						name={"Cyber Multiplier"}
						upgradeProgress={`(${props.rebirths.currencyMultipliers["cyber tokens"]}/10)`}
						cost={statsAbbreviator.numberToString(1_500)}
						onPurchased={(): void => {
							if (props.rebirths.currencyMultipliers["cyber tokens"] >= 10) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 1_500) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseCurrencyUpgrade.SendToServer("cyber tokens");
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={7}
					/>
					<RebirthCard
						icon={assetIds.images.decals.gamepasses.Teleportation}
						name={"Teleport"}
						upgradeProgress={`(${props.rebirths.teleport === true ? 1 : 0}/1)`}
						cost={statsAbbreviator.numberToString(5_000)}
						onPurchased={(): void => {
							if (props.rebirths.teleport) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 5_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseTeleport.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={8}
					/>
					<RebirthCard
						icon={assetIds.images.decals.gamepasses["Fast Hatch"]}
						name={"Fast Hatch"}
						upgradeProgress={`(${props.rebirths.fastHatch === true ? 1 : 0}/1)`}
						cost={statsAbbreviator.numberToString(5_000)}
						onPurchased={(): void => {
							if (props.rebirths.fastHatch) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 5_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseFastHatch.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={9}
					/>
					<RebirthCard
						icon={assetIds.images.vectors.Clover}
						name={"Extra Luck"}
						upgradeProgress={`(${props.rebirths.extraLuck === true ? 1 : 0}/1)`}
						cost={statsAbbreviator.numberToString(5_000)}
						onPurchased={(): void => {
							if (props.rebirths.extraLuck) {
								addAnnouncement(`You already have max upgrades!`, AnnouncementType.Error);
								return;
							}

							if (props.currencies.gems < 5_000) {
								addAnnouncement(`You don't have enough gems!`, AnnouncementType.Error);
								return;
							}

							purchaseExtraLuck.SendToServer();
							addAnnouncement(`Upgrade complete!!`, AnnouncementType.Announcement);
						}}
						layoutOrder={10}
					/>
				</scrollingframe>

				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	}),
);
