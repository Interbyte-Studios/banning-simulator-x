import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, uiDarkStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { WorldName, WORLDS } from "shared/configs/worlds";
import { StoreState } from "shared/rodux";
import { CurrenciesState } from "shared/rodux/currencies";
import { WorldPrestigeState } from "shared/rodux/worldPrestige";
import { WorldsState } from "shared/rodux/worlds";
import { isValidWorld } from "shared/util/isValidWorld";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface PrestigeCardProps extends PrestigeCardMappedProps {
	worldName: WorldName;
	prestigeNumber: number;
	displayVerification: () => void;
}

interface PrestigeCardMappedProps {
	worlds: WorldsState;
	worldPrestige: WorldPrestigeState;
	currencies: CurrenciesState;
}

/**
 * @param state The state of the rodux store.
 * @returns The mapped props.
 */
const mapStateToProps = (state: StoreState): PrestigeCardMappedProps => {
	return {
		worlds: state.worlds,
		worldPrestige: state.worldPrestige,
		currencies: state.currencies,
	};
};

/**
 * A card displaying information about the prestige.
 */
export const PrestigeCard = RoactRodux.connect(mapStateToProps)(
	hooks((props: PrestigeCardProps, { useState, useEffect, useContext }) => {
		const [maxCurrencyProgress, setMaxProgress] = useState(1);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		useEffect(() => {
			const worldConfig = WORLDS[props.worldName];
			let lastZoneId = 0;
			for (const [, zoneData] of pairs(worldConfig.zones)) {
				if (zoneData.id > lastZoneId) {
					lastZoneId = zoneData.id;
				}
			}

			const lastZone = Object.values(worldConfig.zones).find((zoneData) => zoneData.id === lastZoneId);
			if (lastZone === undefined) {
				throw `Could not find last zone of world ${props.worldName} | Zone ID: ${lastZoneId}`;
			}

			if (lastZone.cost === undefined) {
				throw `The cost of the last zone of world ${props.worldName} was undefined!`;
			}

			setMaxProgress(lastZone.cost.amount * 5);
		}, [props.prestigeNumber]);

		let iconToDisplay: Roact.Element = <></>;
		switch (props.prestigeNumber) {
			case 10:
			case 20:
			case 30:
			case 40:
			case 50: {
				const prestigeRewardInfo = WORLD_PRESTIGE.worldRewards[props.worldName].find(
					(rewardInfo) => rewardInfo.prestigeNumber === props.prestigeNumber,
				);
				if (prestigeRewardInfo === undefined) {
					throw `Expected to find prestige reward info for prestige number ${props.prestigeNumber} from ${props.worldName}`;
				}

				iconToDisplay = (
					<BaseFrame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(15, 163, 255)}
						Position={UDim2.fromScale(0.1, 0.5)}
						Size={UDim2.fromScale(0.9, 0.9)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
						<uicorner CornerRadius={new UDim(1, 0)} />
						<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

						<ImageLabel
							native={{
								Size: UDim2.fromScale(1, 1),
								Image: getPetImage(prestigeRewardInfo.petReward, "regular"),
							}}
						/>
					</BaseFrame>
				);
				break;
			}
			default: {
				const prestigeImage = assetIds.images.ranks.prestiges.Prestige1;

				iconToDisplay = (
					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.1, 0.5),
							Image: prestigeImage,
						}}
						size={{ minSize: 0.9, maxSize: 1 }}
					/>
				);
			}
		}

		const truePrestige =
			props.prestigeNumber === 51 && props.worldPrestige[props.worldName].currentPrestige >= 51
				? props.worldPrestige[props.worldName].currentPrestige + 1
				: props.prestigeNumber;

		if (truePrestige < props.worldPrestige[props.worldName].currentPrestige) {
			return <></>;
		}

		const worldData = WORLDS[props.worldName];
		let currencyProgress = props.currencies[worldData.reward] / maxCurrencyProgress;
		currencyProgress = currencyProgress > 1 ? 1 : currencyProgress;

		let prestigeProgress = props.worldPrestige[props.worldName].currentPrestige / (props.prestigeNumber - 1);
		prestigeProgress = prestigeProgress > 1 ? 1 : prestigeProgress;
		prestigeProgress =
			truePrestige === 1 && props.worldPrestige[props.worldName].currentPrestige === 0 ? 1 : prestigeProgress;

		let accumulatedProgress = currencyProgress * 0.5 + prestigeProgress * 0.5;
		accumulatedProgress =
			props.worldPrestige[props.worldName].currentPrestige >= props.prestigeNumber ? 1 : accumulatedProgress;

		return (
			<BaseFrame Size={UDim2.fromScale(1, 0.3)} LayoutOrder={truePrestige}>
				<uiaspectratioconstraint AspectRatio={4.7} />

				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(1, 109, 177)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.99, 0.95)}
				>
					<uiaspectratioconstraint AspectRatio={5} />
					<uicorner CornerRadius={new UDim(0.07, 0)} />

					<BaseUIStroke native={{ Thickness: 2, Color: uiDarkStrokeColor }} />

					{iconToDisplay}

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.575, 0.15),
							Size: UDim2.fromScale(0.7, 0.3),
							Text: `Prestige ${truePrestige}`,
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.575, 0.4),
							Size: UDim2.fromScale(0.7, 0.2),
							Text:
								props.prestigeNumber === 10 ||
								props.prestigeNumber === 20 ||
								props.prestigeNumber === 30 ||
								props.prestigeNumber === 40 ||
								props.prestigeNumber === 50
									? "Grants a powerful reward pet!"
									: "Grants a prestige token.",
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>

					<BaseFrame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(255, 144, 144)}
						Position={UDim2.fromScale(0.475, 0.85)}
						Size={UDim2.fromScale(0.5, 0.2)}
					>
						<uicorner CornerRadius={new UDim(0.5)} />
						<BaseUIStroke native={{ Thickness: 2, Color: uiTextStrokeColor }} />

						<BaseFrame
							AnchorPoint={new Vector2(0, 0)}
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(85, 255, 127)}
							Position={UDim2.fromScale(0, 0)}
							Size={UDim2.fromScale(accumulatedProgress, 1)}
						>
							<uicorner CornerRadius={new UDim(0.5)} />
						</BaseFrame>

						<StrokeTextLabel
							native={{
								Size: UDim2.fromScale(0.95, 0.95),
								Text: `${math.floor(accumulatedProgress * 100)}%`,
							}}
							stroke={{ native: { Thickness: 2 } }}
						/>
					</BaseFrame>

					<SpringImageButton
						native={{
							Position: UDim2.fromScale(0.875, 0.7),
							Image: accumulatedProgress === 1 ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off,
						}}
						size={{ maxSize: 0.5, minSize: 0.45 }}
						events={{
							/* eslint-disable jsdoc/require-jsdoc */
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);

								// check to be sure this is the next rank
								if (truePrestige > props.worldPrestige[props.worldName].currentPrestige + 1) {
									addAnnouncement("That prestige is too high to upgrade to!", AnnouncementType.Error);
									return;
								}

								// not enough currency to unlock rank
								if (props.currencies[worldData.reward] < maxCurrencyProgress) {
									addAnnouncement("Not enough currency to prestige.", AnnouncementType.Error);
									return;
								}

								if (!isValidWorld(props.worldName)) {
									addAnnouncement("There is an issue. Please try again later.", AnnouncementType.Error);
									return;
								}

								props.displayVerification();
							},
							/* eslint-enable jsdoc/require-jsdoc */
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.95, 0.95)}
							Font={font}
							Text={
								accumulatedProgress === 1
									? props.worldPrestige[props.worldName].currentPrestige >= truePrestige
										? "Owned"
										: "Purchase"
									: "Unavailable"
							}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
						>
							<BaseUIStroke
								native={{
									Thickness: 2,
									Color: accumulatedProgress === 1 ? Color3.fromRGB(44, 126, 102) : Color3.fromRGB(152, 54, 54),
								}}
							/>
						</textlabel>
					</SpringImageButton>

					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.905, 0.225),
							Size: UDim2.fromScale(0.125, 0.3),
							Text: twoDpAbbreviator.numberToString(maxCurrencyProgress),
							TextXAlignment: Enum.TextXAlignment.Left,
						}}
						stroke={{
							native: { Thickness: 2, Color: Color3.fromRGB(255, 255, 255) },
							currencyGradient: worldData.reward,
						}}
					>
						<CurrencyIcon
							anchorPoint={new Vector2(1, 0.5)}
							position={UDim2.fromScale(-0.03, 0.5)}
							size={{ minimizedSize: 0.9, maximizedSize: 1 }}
							currency={worldData.reward}
						/>
					</StrokeTextLabel>
				</BaseFrame>
			</BaseFrame>
		);
	}),
);
