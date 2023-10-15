import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { SpringImageLabel } from "client/ui/elements/baseElements/imagelabels/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { capitalizeFirstLetter } from "client/util/capitlizeFirstLetter";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { CURRENCY_PURCHASES, CurrencyPurchaseOption, CurrencyPurchaseType } from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { StoreState } from "shared/rodux";
import { WorldsState } from "shared/rodux/worlds";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface CurrencyOptionProps extends CurrencyOptionMappedProps {
	currency: CurrencyPurchaseType;
	purchaseOption: CurrencyPurchaseOption;
}

interface CurrencyOptionMappedProps {
	worlds: WorldsState;
}

/**
 * Maps the rodux store state to the component's props.
 *
 * @param state The rodux store state.
 * @returns The component's props.
 */
const mapStateToProps = (state: StoreState): CurrencyOptionMappedProps => {
	return {
		worlds: state.worlds,
	};
};

/**
 * Displays the specified currency purchase option.
 */
const CurrencyOption = RoactRodux.connect(mapStateToProps)(
	hooks((props: CurrencyOptionProps, { useState, useEffect }) => {
		const [price, setPrice] = useState(0);
		useEffect(() => {
			const threadConnection = task.spawn(() => {
				const [success, result] = pcall(() => {
					return MarketplaceService.GetProductInfo(
						CURRENCY_PURCHASES[props.currency][props.purchaseOption].devId,
						Enum.InfoType.Product,
					);
				});
				if (success && result.PriceInRobux !== undefined) {
					setPrice(result.PriceInRobux);
				}
			});
			return (): void => task.cancel(threadConnection);
		}, []);

		const position =
			props.purchaseOption === "pile"
				? UDim2.fromScale(0.125, 0.5)
				: props.purchaseOption === "bag"
				? UDim2.fromScale(0.375, 0.5)
				: props.purchaseOption === "chest"
				? UDim2.fromScale(0.625, 0.5)
				: UDim2.fromScale(0.875, 0.5);

		const image = CURRENCY_PURCHASES[props.currency][props.purchaseOption].image;

		let highestIndex = 0;
		let highestReward = 0;
		for (const [worldName, worldData] of pairs(WORLDS)) {
			const storedWorld = props.worlds.find((world) => world.name === worldName);
			if (storedWorld === undefined) {
				continue;
			}

			if (props.currency === "gems" && worldData.id > highestIndex) {
				highestIndex = worldData.id;
				highestReward = highestIndex * 3000;
			}

			if (worldData.reward !== props.currency) {
				continue;
			}

			for (const [zoneName, zoneData] of pairs(zones)) {
				if (zoneData.worldParent !== worldName) {
					continue;
				}

				const storedZone = storedWorld.zones.find((zone) => zone === zoneName);
				if (storedZone === undefined) {
					continue;
				}

				if (zoneData.id > highestIndex) {
					highestIndex = zoneData.id;
					highestReward = zoneData.npcs.filter((npc) => npc.isBoss)[0].reward.currency;
				}
			}
		}
		const amount = highestReward * CURRENCY_PURCHASES[props.currency][props.purchaseOption].highestZoneMultiplier;

		return (
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(0, 75, 122)}
				Position={position}
				Size={UDim2.fromScale(0.95, 0.95)}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<SpringImageLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.5),
						Image: image,
					}}
					size={{ minSize: 0.7, maxSize: 0.8 }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.99),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.35, maxSize: 0.45 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(
								Players.LocalPlayer,
								CURRENCY_PURCHASES[props.currency][props.purchaseOption].devId,
							);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.5),
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Buy",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.22, -0.075),
							Size: UDim2.fromScale(0.65, 0.65),
							Image: assetIds.images.vectors.Robux,
						}}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.7, -0.1),
							Size: UDim2.fromScale(0.5, 0.6),
							Text: tostring(price),
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(113, 72, 72) } }}
					/>
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0),
						Size: UDim2.fromScale(1, 0.2),
						Text: `+${twoDpAbbreviator.numberToString(amount)} ${capitalizeFirstLetter(props.currency)}`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) }, currencyGradient: props.currency }}
				/>
			</BaseFrame>
		);
	}),
);

/**
 * Displays options for the specified currency.
 */
const CurrencyOptions = hooks((props: { currency: CurrencyPurchaseType; position: UDim2 }) => {
	return (
		<>
			<BaseFrame
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				Size={UDim2.fromScale(0.95, 0.058)}
				Position={props.position}
			>
				<uicorner CornerRadius={new UDim(0.1, 0)} />
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 75, 122) }} />
				<uiaspectratioconstraint AspectRatio={4.4} />
				<CurrencyOption currency={props.currency} purchaseOption={"pile"} />
				<CurrencyOption currency={props.currency} purchaseOption={"bag"} />
				<CurrencyOption currency={props.currency} purchaseOption={"chest"} />
				<CurrencyOption currency={props.currency} purchaseOption={"vault"} />
			</BaseFrame>
		</>
	);
});

/**
 * Displays purchasable currencies.
 */
export const CurrencyShop = hooks(() => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.854),
					Size: UDim2.fromScale(0.5, 0.015),
					Text: "Currencies",
				}}
				stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
			/>
			<CurrencyOptions currency={"coins"} position={UDim2.fromScale(0.5, 0.895)} />
			<CurrencyOptions currency={"gems"} position={UDim2.fromScale(0.5, 0.966)} />
		</>
	);
});
