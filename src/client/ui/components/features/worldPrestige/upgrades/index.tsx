import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { uiDarkStrokeColor, uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { WorldName } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { WorldPrestigeState } from "shared/rodux/worldPrestige";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { WorldPrestigeBoostPurchase } from "./boostPurchase";

interface WorldPrestigeUpgradesProps extends WorldPrestigeUpgradesMappedProps {
	worldName: WorldName;
	setVisibility: (value: boolean) => void;
}

interface WorldPrestigeUpgradesMappedProps {
	worldPrestige: WorldPrestigeState;
}

/**
 * @param state The state of the store.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): WorldPrestigeUpgradesMappedProps => {
	return {
		worldPrestige: state.worldPrestige,
	};
};

/**
 * A component to display the possible upgrades for a world prestige.
 */
export const WorldPrestigeUpgrades = RoactRodux.connect(mapStateToProps)(
	hooks((props: WorldPrestigeUpgradesProps, { useContext }) => {
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;
		const {
			purchaseWorldPrestigeCurrencyUpgrade,
			purchaseWorldPrestigeFusionUpgrade,
			purchaseWorldPrestigePetsUpgrade,
			purchaseWorldPrestigeVoidEggUpgrade,
		} = useContext(remoteContext);

		const storedWorldPrestige = props.worldPrestige[props.worldName];

		const currencyUpgradeProgress = storedWorldPrestige.currencyUpgrades / WORLD_PRESTIGE.currency.maxUpgrades;
		const additionalPetsEquippedProgress =
			storedWorldPrestige.additionalPetsUpgrades / WORLD_PRESTIGE.additionalPets.maxUpgrades;
		const reducedFusionProgress =
			storedWorldPrestige.reducedFusionCostUpgrades / WORLD_PRESTIGE.reducedFusionCost.maxUpgrades;
		const reducedVoidCostProgress =
			storedWorldPrestige.reducedVoidEggCostUpgrades / WORLD_PRESTIGE.reducedVoidEggCost.maxUpgrades;

		const totalProgress =
			(storedWorldPrestige.currencyUpgrades +
				storedWorldPrestige.additionalPetsUpgrades +
				storedWorldPrestige.reducedFusionCostUpgrades +
				storedWorldPrestige.reducedVoidEggCostUpgrades) /
			(WORLD_PRESTIGE.additionalPets.maxUpgrades +
				WORLD_PRESTIGE.currency.maxUpgrades +
				WORLD_PRESTIGE.reducedFusionCost.maxUpgrades +
				WORLD_PRESTIGE.reducedVoidEggCost.maxUpgrades);

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.5, 0.75),
					Image: assetIds.images.ui["rank upgrade"].background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.058),
						Size: UDim2.fromScale(0.4, 0.1),
						Text: "Upgrades",
					}}
					stroke={{ native: { Thickness: 2, Color: uiHeaderStrokeColor } }}
				/>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.97, 0.845)}
					ScrollBarImageColor3={Color3.fromRGB(0, 109, 176)}
					ScrollBarThickness={15}
					BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					{/* World Prestige Upgrades [ Needs to be refactored obviously to reduce copy pasta ] */}
					<BaseFrame Position={UDim2.fromScale(0.485, 0.05)} Size={UDim2.fromScale(0.97, 0.1)}>
						<uiaspectratioconstraint AspectRatio={4.75} />
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.99, 0.95)}
							Position={UDim2.fromScale(0.5, 0.5)}
						>
							<uicorner CornerRadius={new UDim(0.2, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.1, 0.5),
									Image: assetIds.images.ranks.prestiges.Prestige5,
								}}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.575, 0.15),
									Size: UDim2.fromScale(0.8, 0.3),
									Text: `${props.worldName} Prestige Progress`,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.425, 0.56),
									Size: UDim2.fromScale(0.4, 0.25),
									Text: `Current Prestige: ${twoDpAbbreviator.numberToString(storedWorldPrestige.currentPrestige)}`,
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.825, 0.56),
									Size: UDim2.fromScale(0.185, 0.25),
									Text: `Tokens: ${storedWorldPrestige.prestigeTokens}`,
									TextXAlignment: Enum.TextXAlignment.Right,
								}}
								stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
							/>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(255, 144, 144)}
								Position={UDim2.fromScale(0.575, 0.85)}
								Size={UDim2.fromScale(0.7, 0.2)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

								<BaseFrame
									AnchorPoint={new Vector2(0, 0)}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(85, 255, 127)}
									Position={UDim2.fromScale(0, 0)}
									Size={UDim2.fromScale(totalProgress, 1)}
								>
									<uicorner CornerRadius={new UDim(0.5)} />
								</BaseFrame>

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.95, 0.95),
										Text: `${math.floor(totalProgress * 100)}%`,
									}}
									stroke={{ native: { Thickness: 2 } }}
								/>
							</BaseFrame>
						</BaseFrame>
					</BaseFrame>
					<BaseFrame Position={UDim2.fromScale(0.485, 0.145)} Size={UDim2.fromScale(0.97, 0.085)}>
						<uiaspectratioconstraint AspectRatio={5.7} />
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.99, 0.95)}
							Position={UDim2.fromScale(0.5, 0.5)}
						>
							<uicorner CornerRadius={new UDim(0.2, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.1, 0.5),
									Image: assetIds.images.vectors.Coin,
								}}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.575, 0.16),
									Size: UDim2.fromScale(0.65, 0.325),
									Text: `Currency Multiplier: +${twoDpAbbreviator.numberToString(
										storedWorldPrestige.currencyUpgrades * WORLD_PRESTIGE.currency.multiplierIncrement,
									)}x`,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.425, 0.56),
									Size: UDim2.fromScale(0.4, 0.25),
									Text: `Current Upgrades: ${storedWorldPrestige.currencyUpgrades}`,
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.785, 0.56),
									Size: UDim2.fromScale(0.14, 0.25),
									Text: `Upgrade`,
									TextXAlignment: Enum.TextXAlignment.Right,
								}}
								stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.9, 0.5),
									Image: assetIds.images.vectors.trading.Upgrade,
									ImageColor3:
										storedWorldPrestige.prestigeTokens < 1
											? Color3.fromRGB(127, 127, 127)
											: Color3.fromRGB(255, 255, 255),
								}}
								size={{ minSize: 0.35, maxSize: 0.45 }}
								events={{
									/**
									 *
									 */
									Activated: (): void => {
										if (storedWorldPrestige.currencyUpgrades >= WORLD_PRESTIGE.currency.maxUpgrades) {
											addAnnouncement(`You've already fully upgraded that!`, AnnouncementType.Error);
											return;
										}

										if (storedWorldPrestige.prestigeTokens < 1) {
											addAnnouncement(`You dont have enough prestige tokens to upgrade!`, AnnouncementType.Error);
											return;
										}

										purchaseWorldPrestigeCurrencyUpgrade.SendToServer(props.worldName);
									},
								}}
							/>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(255, 144, 144)}
								Position={UDim2.fromScale(0.575, 0.85)}
								Size={UDim2.fromScale(0.7, 0.2)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

								<BaseFrame
									AnchorPoint={new Vector2(0, 0)}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(85, 255, 127)}
									Position={UDim2.fromScale(0, 0)}
									Size={UDim2.fromScale(currencyUpgradeProgress, 1)}
								>
									<uicorner CornerRadius={new UDim(0.5)} />
								</BaseFrame>

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.95, 0.95),
										Text: `${math.floor(currencyUpgradeProgress * 100)}%`,
									}}
									stroke={{ native: { Thickness: 2 } }}
								/>
							</BaseFrame>
						</BaseFrame>
					</BaseFrame>
					<BaseFrame Position={UDim2.fromScale(0.485, 0.233)} Size={UDim2.fromScale(0.97, 0.085)}>
						<uiaspectratioconstraint AspectRatio={5.7} />
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.99, 0.95)}
							Position={UDim2.fromScale(0.5, 0.5)}
						>
							<uicorner CornerRadius={new UDim(0.2, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.1, 0.5),
									Image: assetIds.images.vectors.PetPaw,
								}}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.575, 0.16),
									Size: UDim2.fromScale(0.65, 0.325),
									Text: `Additional Pets Equipped: +${storedWorldPrestige.additionalPetsUpgrades}`,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.425, 0.56),
									Size: UDim2.fromScale(0.4, 0.25),
									Text: `Current Upgrades: ${storedWorldPrestige.additionalPetsUpgrades}`,
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.785, 0.56),
									Size: UDim2.fromScale(0.14, 0.25),
									Text: `Upgrade`,
									TextXAlignment: Enum.TextXAlignment.Right,
								}}
								stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.9, 0.5),
									Image: assetIds.images.vectors.trading.Upgrade,
									ImageColor3:
										storedWorldPrestige.prestigeTokens < 1
											? Color3.fromRGB(127, 127, 127)
											: Color3.fromRGB(255, 255, 255),
								}}
								size={{ minSize: 0.35, maxSize: 0.45 }}
								events={{
									/**
									 *
									 */
									Activated: (): void => {
										if (storedWorldPrestige.additionalPetsUpgrades >= WORLD_PRESTIGE.additionalPets.maxUpgrades) {
											addAnnouncement(`You've already fully upgraded that!`, AnnouncementType.Error);
											return;
										}

										if (storedWorldPrestige.prestigeTokens < 1) {
											addAnnouncement(`You dont have enough prestige tokens to upgrade!`, AnnouncementType.Error);
											return;
										}

										purchaseWorldPrestigePetsUpgrade.SendToServer(props.worldName);
									},
								}}
							/>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(255, 144, 144)}
								Position={UDim2.fromScale(0.575, 0.85)}
								Size={UDim2.fromScale(0.7, 0.2)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

								<BaseFrame
									AnchorPoint={new Vector2(0, 0)}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(85, 255, 127)}
									Position={UDim2.fromScale(0, 0)}
									Size={UDim2.fromScale(additionalPetsEquippedProgress, 1)}
								>
									<uicorner CornerRadius={new UDim(0.5)} />
								</BaseFrame>

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.95, 0.95),
										Text: `${math.floor(additionalPetsEquippedProgress * 100)}%`,
									}}
									stroke={{ native: { Thickness: 2 } }}
								/>
							</BaseFrame>
						</BaseFrame>
					</BaseFrame>
					<BaseFrame Position={UDim2.fromScale(0.485, 0.321)} Size={UDim2.fromScale(0.97, 0.085)}>
						<uiaspectratioconstraint AspectRatio={5.7} />
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.99, 0.95)}
							Position={UDim2.fromScale(0.5, 0.5)}
						>
							<uicorner CornerRadius={new UDim(0.2, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.1, 0.5),
									Image: assetIds.images.vectors.trading.Offer,
								}}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.575, 0.16),
									Size: UDim2.fromScale(0.65, 0.325),
									Text: `Reduced Fusion Multiplier: ${twoDpAbbreviator.numberToString(
										storedWorldPrestige.reducedFusionCostUpgrades *
											WORLD_PRESTIGE.reducedFusionCost.reducedCostMultiplier,
									)}x`,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.425, 0.56),
									Size: UDim2.fromScale(0.4, 0.25),
									Text: `Current Upgrades: ${storedWorldPrestige.reducedFusionCostUpgrades}`,
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.785, 0.56),
									Size: UDim2.fromScale(0.14, 0.25),
									Text: `Upgrade`,
									TextXAlignment: Enum.TextXAlignment.Right,
								}}
								stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.9, 0.5),
									Image: assetIds.images.vectors.trading.Upgrade,
									ImageColor3:
										storedWorldPrestige.prestigeTokens < 1
											? Color3.fromRGB(127, 127, 127)
											: Color3.fromRGB(255, 255, 255),
								}}
								size={{ minSize: 0.35, maxSize: 0.45 }}
								events={{
									/**
									 *
									 */
									Activated: (): void => {
										if (storedWorldPrestige.reducedFusionCostUpgrades >= WORLD_PRESTIGE.reducedFusionCost.maxUpgrades) {
											addAnnouncement(`You've already fully upgraded that!`, AnnouncementType.Error);
											return;
										}

										if (storedWorldPrestige.prestigeTokens < 1) {
											addAnnouncement(`You dont have enough prestige tokens to upgrade!`, AnnouncementType.Error);
											return;
										}

										purchaseWorldPrestigeFusionUpgrade.SendToServer(props.worldName);
									},
								}}
							/>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(255, 144, 144)}
								Position={UDim2.fromScale(0.575, 0.85)}
								Size={UDim2.fromScale(0.7, 0.2)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

								<BaseFrame
									AnchorPoint={new Vector2(0, 0)}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(85, 255, 127)}
									Position={UDim2.fromScale(0, 0)}
									Size={UDim2.fromScale(reducedFusionProgress, 1)}
								>
									<uicorner CornerRadius={new UDim(0.5)} />
								</BaseFrame>

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.95, 0.95),
										Text: `${math.floor(reducedFusionProgress * 100)}%`,
									}}
									stroke={{ native: { Thickness: 2 } }}
								/>
							</BaseFrame>
						</BaseFrame>
					</BaseFrame>
					<BaseFrame Position={UDim2.fromScale(0.485, 0.409)} Size={UDim2.fromScale(0.97, 0.085)}>
						<uiaspectratioconstraint AspectRatio={5.7} />
						<BaseFrame
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							BackgroundTransparency={0}
							Size={UDim2.fromScale(0.99, 0.95)}
							Position={UDim2.fromScale(0.5, 0.5)}
						>
							<uicorner CornerRadius={new UDim(0.2, 0)} />
							<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.1, 0.5),
									Image: assetIds.images.vectors.Egg,
								}}
								size={{ minSize: 0.9, maxSize: 1 }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.575, 0.16),
									Size: UDim2.fromScale(0.65, 0.325),
									Text: `Reduced Void Egg Cost: ${twoDpAbbreviator.numberToString(
										storedWorldPrestige.reducedVoidEggCostUpgrades *
											WORLD_PRESTIGE.reducedVoidEggCost.reducedCostMultiplier,
									)}x`,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.425, 0.56),
									Size: UDim2.fromScale(0.4, 0.25),
									Text: `Current Upgrades: ${storedWorldPrestige.reducedVoidEggCostUpgrades}`,
									TextXAlignment: Enum.TextXAlignment.Left,
								}}
								stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
							/>

							<StrokeTextLabel
								native={{
									Position: UDim2.fromScale(0.785, 0.56),
									Size: UDim2.fromScale(0.14, 0.25),
									Text: `Upgrade`,
									TextXAlignment: Enum.TextXAlignment.Right,
								}}
								stroke={{ native: { Thickness: 3, Color: Color3.fromRGB(12, 129, 6) } }}
							/>

							<SpringImageButton
								native={{
									Position: UDim2.fromScale(0.9, 0.5),
									Image: assetIds.images.vectors.trading.Upgrade,
									ImageColor3:
										storedWorldPrestige.prestigeTokens < 1
											? Color3.fromRGB(127, 127, 127)
											: Color3.fromRGB(255, 255, 255),
								}}
								size={{ minSize: 0.35, maxSize: 0.45 }}
								events={{
									/**
									 *
									 */
									Activated: (): void => {
										if (
											storedWorldPrestige.reducedVoidEggCostUpgrades >= WORLD_PRESTIGE.reducedVoidEggCost.maxUpgrades
										) {
											addAnnouncement(`You've already fully upgraded that!`, AnnouncementType.Error);
											return;
										}

										if (storedWorldPrestige.prestigeTokens < 1) {
											addAnnouncement(`You dont have enough prestige tokens to upgrade!`, AnnouncementType.Error);
											return;
										}

										purchaseWorldPrestigeVoidEggUpgrade.SendToServer(props.worldName);
									},
								}}
							/>

							<BaseFrame
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(255, 144, 144)}
								Position={UDim2.fromScale(0.575, 0.85)}
								Size={UDim2.fromScale(0.7, 0.2)}
							>
								<uicorner CornerRadius={new UDim(0.5)} />
								<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

								<BaseFrame
									AnchorPoint={new Vector2(0, 0)}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(85, 255, 127)}
									Position={UDim2.fromScale(0, 0)}
									Size={UDim2.fromScale(reducedVoidCostProgress, 1)}
								>
									<uicorner CornerRadius={new UDim(0.5)} />
								</BaseFrame>

								<StrokeTextLabel
									native={{
										Size: UDim2.fromScale(0.95, 0.95),
										Text: `${math.floor(reducedVoidCostProgress * 100)}%`,
									}}
									stroke={{ native: { Thickness: 2 } }}
								/>
							</BaseFrame>
						</BaseFrame>
					</BaseFrame>

					{/* Boost Purchases [ Needs to be refactored obviously to reduce copy pasta ] */}
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.485),
							Size: UDim2.fromScale(0.545, 0.04),
							Text: "Boost Upgrades",
						}}
						stroke={{ native: { Thickness: 3, Color: uiDarkStrokeColor } }}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Currency"}
						boostTime={30}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={2}
						position={UDim2.fromScale(0.145, 0.581)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Currency"}
						boostTime={60}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={4}
						position={UDim2.fromScale(0.485, 0.581)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Currency"}
						boostTime={120}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={6}
						position={UDim2.fromScale(0.824, 0.581)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Hatching Luck"}
						boostTime={30}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={2}
						position={UDim2.fromScale(0.145, 0.747)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Hatching Luck"}
						boostTime={60}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={4}
						position={UDim2.fromScale(0.485, 0.747)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Hatching Luck"}
						boostTime={120}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={6}
						position={UDim2.fromScale(0.824, 0.747)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Rank Experience"}
						boostTime={30}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={2}
						position={UDim2.fromScale(0.145, 0.913)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Rank Experience"}
						boostTime={60}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={4}
						position={UDim2.fromScale(0.485, 0.913)}
					/>
					<WorldPrestigeBoostPurchase
						worldName={props.worldName}
						boostName={"x2 Rank Experience"}
						boostTime={120}
						prestigeTokens={storedWorldPrestige.prestigeTokens}
						cost={6}
						position={UDim2.fromScale(0.824, 0.913)}
					/>
				</scrollingframe>
				<ExitButton
					Position={UDim2.fromScale(0.985, 0.09)}
					minimizedSize={0.06}
					maximizedSize={0.075}
					onClosed={(): void => {
						playSFX(UIEngagement.MinorEngagement);

						props.setVisibility(false);
					}}
				/>
			</ImageLabel>
		);
	}),
);
