// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getCurrentWorld } from "client/util/getCurrentWorld";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TIME_TRIAL_UPGRADES, TIME_TRIALS_CURRENCIES } from "shared/configs/timeTrials";
import { WorldName } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { TimeTrialsState } from "shared/rodux/timeTrials";
import { getTimeTrialsUpgradeCost } from "shared/util/getTimeTrialsUpgradeCost";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface TimeTrialsUpgradeMappedProps {
	timeTrials: TimeTrialsState;
	currencies: CurrenciesState;
}

/**
 * Maps the rodux store state to the props of this component.
 *
 * @param state The rodux store state.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): TimeTrialsUpgradeMappedProps => {
	return {
		timeTrials: state.timeTrials,
		currencies: state.currencies,
	};
};

export const TimeTrialsUpgrades = RoactRodux.connect(mapStateToProps)(
	hooks((props: TimeTrialsUpgradeMappedProps, { useState, useEffect, useContext }) => {
		const [world, setWorld] = useState<WorldName | undefined>(undefined);
		useEffect(() => {
			const currentWorld = getCurrentWorld();
			if (currentWorld !== undefined) {
				setWorld(currentWorld);
			}
		}, []);

		if (world === undefined) {
			return <></>;
		}

		const { upgradeTimeTrial } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const storedTimeTrial = props.timeTrials[world];

		return (
			<BaseFrame Position={UDim2.fromScale(0.5, 0.575)} Size={UDim2.fromScale(0.975, 0.79)} BackgroundTransparency={1}>
				<uigridlayout
					CellPadding={UDim2.fromScale(0.08, 0.08)}
					CellSize={UDim2.fromScale(0.45, 0.45)}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
				<BaseFrame BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(12, 134, 211)}>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.272, 0.786),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.3, maxSize: 0.35 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);

								// check that they've not already maxed out the upgrades
								const storedUpgradeAmount = storedTimeTrial.health;
								if (storedUpgradeAmount >= TIME_TRIAL_UPGRADES.health.maxUpgrades) {
									addAnnouncement(`You've already gotten that to max upgrade!`, AnnouncementType.Error);
									return;
								}

								// check that they have enough currency
								const currencyToUse = TIME_TRIALS_CURRENCIES[world];
								const upgradeCost = getTimeTrialsUpgradeCost("health", storedUpgradeAmount + 1);

								if (props.currencies[currencyToUse] < upgradeCost) {
									addAnnouncement(`You don't have enough ${currencyToUse} to buy that!`, AnnouncementType.Error);
									return;
								}
								upgradeTimeTrial.SendToServer(world, "health");
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Buy",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<CurrencyIcon
						position={UDim2.fromScale(0.55, 0.78)}
						size={{ minimizedSize: 0.2, maximizedSize: 0.25 }}
						currency={"gears"}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.8, 0.8),
							Size: UDim2.fromScale(0.3, 0.2),
							Text: statsAbbreviator.numberToString(getTimeTrialsUpgradeCost("health", storedTimeTrial.health)),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.92, 0.22),
							Text: "Health",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.3),
							Size: UDim2.fromScale(1, 0.16),
							Text: "+50 Health Per Upgrade",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.45),
							Size: UDim2.fromScale(1, 0.16),
							Text: `Current Upgrade: ${storedTimeTrial.health} ${
								storedTimeTrial.health >= TIME_TRIAL_UPGRADES.health.maxUpgrades ? "(Max)" : ""
							}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>
				<BaseFrame BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(12, 134, 211)}>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.272, 0.786),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.3, maxSize: 0.35 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);

								// check that they've not already maxed out the upgrades
								const storedUpgradeAmount = storedTimeTrial.damageReduction;
								if (storedUpgradeAmount >= TIME_TRIAL_UPGRADES.damageReduction.maxUpgrades) {
									addAnnouncement(`You've already gotten that to max upgrade!`, AnnouncementType.Error);
									return;
								}

								// check that they have enough currency
								const currencyToUse = TIME_TRIALS_CURRENCIES[world];
								const upgradeCost = getTimeTrialsUpgradeCost("damageReduction", storedUpgradeAmount + 1);

								if (props.currencies[currencyToUse] < upgradeCost) {
									addAnnouncement(`You don't have enough ${currencyToUse} to buy that!`, AnnouncementType.Error);
									return;
								}
								upgradeTimeTrial.SendToServer(world, "damageReduction");
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Buy",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<CurrencyIcon
						position={UDim2.fromScale(0.55, 0.78)}
						size={{ minimizedSize: 0.2, maximizedSize: 0.25 }}
						currency={"gears"}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.8, 0.8),
							Size: UDim2.fromScale(0.3, 0.2),
							Text: statsAbbreviator.numberToString(
								getTimeTrialsUpgradeCost("damageReduction", storedTimeTrial.damageReduction),
							),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.92, 0.22),
							Text: "Damage Reduction",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.3),
							Size: UDim2.fromScale(1, 0.16),
							Text: "x0.5 Per Upgrade",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.45),
							Size: UDim2.fromScale(1, 0.16),
							Text: `Current Upgrade: ${storedTimeTrial.damageReduction} ${
								storedTimeTrial.damageReduction >= TIME_TRIAL_UPGRADES.damageReduction.maxUpgrades ? "(Max)" : ""
							}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>
				<BaseFrame BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(12, 134, 211)}>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.272, 0.786),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.3, maxSize: 0.35 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);

								// check that they've not already maxed out the upgrades
								const storedUpgradeAmount = storedTimeTrial.damage;
								if (storedUpgradeAmount >= TIME_TRIAL_UPGRADES.damage.maxUpgrades) {
									addAnnouncement(`You've already gotten that to max upgrade!`, AnnouncementType.Error);
									return;
								}

								// check that they have enough currency
								const currencyToUse = TIME_TRIALS_CURRENCIES[world];
								const upgradeCost = getTimeTrialsUpgradeCost("damage", storedUpgradeAmount + 1);

								if (props.currencies[currencyToUse] < upgradeCost) {
									addAnnouncement(`You don't have enough ${currencyToUse} to buy that!`, AnnouncementType.Error);
									return;
								}
								upgradeTimeTrial.SendToServer(world, "damage");
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Buy",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<CurrencyIcon
						position={UDim2.fromScale(0.55, 0.78)}
						size={{ minimizedSize: 0.2, maximizedSize: 0.25 }}
						currency={"gears"}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.8, 0.8),
							Size: UDim2.fromScale(0.3, 0.2),
							Text: statsAbbreviator.numberToString(getTimeTrialsUpgradeCost("damage", storedTimeTrial.damage)),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.92, 0.22),
							Text: "Damage Multiplier",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.3),
							Size: UDim2.fromScale(1, 0.16),
							Text: "x0.5 Per Upgrade",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.45),
							Size: UDim2.fromScale(1, 0.16),
							Text: `Current Upgrade: ${storedTimeTrial.damage} ${
								storedTimeTrial.damage >= TIME_TRIAL_UPGRADES.damage.maxUpgrades ? "(Max)" : ""
							}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>
				<BaseFrame BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(12, 134, 211)}>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 108, 176) }} />

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.272, 0.786),
							Image: assetIds.images.ui.index.Claim,
						}}
						size={{ minSize: 0.3, maxSize: 0.35 }}
						events={{
							/**
							 *
							 */
							Activated: (): void => {
								playSFX(UIEngagement.MajorEngagement);

								// check that they've not already maxed out the upgrades
								const storedUpgradeAmount = storedTimeTrial.criticalChance;
								if (storedUpgradeAmount >= TIME_TRIAL_UPGRADES.criticalChance.maxUpgrades) {
									addAnnouncement(`You've already gotten that to max upgrade!`, AnnouncementType.Error);
									return;
								}

								// check that they have enough currency
								const currencyToUse = TIME_TRIALS_CURRENCIES[world];
								const upgradeCost = getTimeTrialsUpgradeCost("criticalChance", storedUpgradeAmount + 1);

								if (props.currencies[currencyToUse] < upgradeCost) {
									addAnnouncement(`You don't have enough ${currencyToUse} to buy that!`, AnnouncementType.Error);
									return;
								}

								upgradeTimeTrial.SendToServer(world, "criticalChance");
							},
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<StrokeTextLabel
							native={{
								Position: UDim2.fromScale(0.5, 0.5),
								Size: UDim2.fromScale(0.9, 0.9),
								Text: "Buy",
							}}
							stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
						/>
					</SpringImageButton>

					<CurrencyIcon
						position={UDim2.fromScale(0.55, 0.78)}
						size={{ minimizedSize: 0.2, maximizedSize: 0.25 }}
						currency={"gears"}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.8, 0.8),
							Size: UDim2.fromScale(0.3, 0.2),
							Text: statsAbbreviator.numberToString(
								getTimeTrialsUpgradeCost("criticalChance", storedTimeTrial.criticalChance),
							),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.1),
							Size: UDim2.fromScale(0.92, 0.22),
							Text: "Critical Chance",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.3),
							Size: UDim2.fromScale(1, 0.16),
							Text: "1% Per Upgrade",
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.45),
							Size: UDim2.fromScale(1, 0.16),
							Text: `Current Upgrade: ${storedTimeTrial.criticalChance} ${
								storedTimeTrial.criticalChance >= TIME_TRIAL_UPGRADES.criticalChance.maxUpgrades ? "(Max)" : ""
							}`,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>
			</BaseFrame>
		);
	}),
);
