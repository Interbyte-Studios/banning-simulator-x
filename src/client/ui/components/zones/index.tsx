import Roact from "@rbxts/roact";
import { Workspace } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WORLDS } from "shared/configs/worlds";
import { isStarterZone } from "shared/configs/zones";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

export const ZonesUI = hooks(() => {
	const elements: Array<Roact.Element> = [];

	for (const [worldName, worldData] of pairs(WORLDS)) {
		const worldFolder = Workspace.decoration[worldName];

		for (const [zoneName, zoneData] of pairs(worldData.zones)) {
			if (isStarterZone(zoneName)) {
				continue;
			}

			if (zoneData.cost === undefined) {
				continue;
			}

			const zoneFolder = worldFolder[zoneName];
			const sign = zoneFolder.sign;
			const adorneePart = sign.description.infoPart;

			const elementToDisplay = (
				<surfacegui Adornee={adorneePart} LightInfluence={0}>
					<frame
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
					>
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.15)}
							Size={UDim2.fromScale(1, 0.25)}
							Text={zoneName}
							TextColor3={zoneData.color}
							TextScaled={true}
							Font={font}
						>
							<BaseUIStroke Thickness={5} />
						</textlabel>
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.325)}
							Size={UDim2.fromScale(1, 0.15)}
							Text={`(${worldName})`}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
							Font={font}
						>
							<BaseUIStroke Thickness={5} />
						</textlabel>
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.66, 0.575)}
							Size={UDim2.fromScale(0.5, 0.2)}
							Text={twoDpAbbreviator.numberToString(zoneData.cost.amount)}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							TextScaled={true}
							TextXAlignment={Enum.TextXAlignment.Left}
							Font={font}
						>
							<CurrencyIcon
								anchorPoint={new Vector2(0, 0.5)}
								position={UDim2.fromScale(-0.35, 0.5)}
								size={{ maximizedSize: 1, minimizedSize: 0.9 }}
								currency={zoneData.cost.currency}
							/>
							<BaseUIStroke Thickness={5} />
						</textlabel>
						<imagebutton
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.85)}
							Size={UDim2.fromScale(0.4, 0.25)}
							Image={assetIds.images.buttons["green toggle button"]}
							ScaleType={Enum.ScaleType.Fit}
						>
							<textlabel
								AnchorPoint={vec2Middle}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.8, 0.7)}
								Text={"Purchase"}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextScaled={true}
								TextXAlignment={Enum.TextXAlignment.Left}
								Font={font}
							>
								<BaseUIStroke Thickness={4} />
							</textlabel>
						</imagebutton>
						<RankIcon
							position={UDim2.fromScale(0.1, 0.5)}
							size={{ maximizedSize: 0.35, minimizedSize: 0.25 }}
							rank={zoneData.cost.requiredRank}
						/>
					</frame>
				</surfacegui>
			);

			elements.push(elementToDisplay);
		}
	}

	return <>{elements}</>;
});
