import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { ZonePurchaseButton } from "./zonePurchase/zonePurchaseButton";

interface ZoneInfoProps {
	zoneName: ZoneNames;
	worldName: WorldName;
	currency: Currency;
	price?: number;
	rank?: number;
	adornee: BasePart;
	ownsZone: boolean;
	purchaseClicked: (zoneName: ZoneNames, worldname: WorldName) => void;
}

/**
 * The Roact element to display zone info.
 *
 * @param props Information of the zone.
 * @returns Roact Element for zone info.
 */
export function ZoneInfoDisplay(props: ZoneInfoProps): Roact.Element {
	if (props.ownsZone) {
		return (
			<surfacegui
				AlwaysOnTop={false}
				Enabled={true}
				Adornee={props.adornee}
				ResetOnSpawn={false}
				ClipsDescendants={true}
				PixelsPerStud={18}
				SizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud}
			>
				<textlabel
					Text={string.upper(props.zoneName)}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.8, 0.22)}
					Position={UDim2.fromScale(0.5, 0.38)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(0, 0, 0)} />
				</textlabel>
				<textlabel
					Text={props.worldName}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.3, 0.1)}
					TextColor3={Color3.fromRGB(52, 190, 255)}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(10, 50, 65)} />
				</textlabel>
				<textlabel
					Text={"Unlocked"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.75)}
					Size={UDim2.fromScale(0.22, 0.17)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<uistroke Color={Color3.fromRGB(112, 158, 113)} Thickness={3} />
				</textlabel>
				<imagelabel
					Image={"rbxassetid://10210423447"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.18)}
					Size={UDim2.fromScale(0.165, 0.306)}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
			</surfacegui>
		);
	} else {
		return (
			<surfacegui
				AlwaysOnTop={false}
				Enabled={true}
				Adornee={props.adornee}
				ResetOnSpawn={false}
				ClipsDescendants={true}
				PixelsPerStud={18}
				SizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud}
			>
				<textlabel
					Text={string.upper(props.zoneName)}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.8, 0.22)}
					Position={UDim2.fromScale(0.5, 0.38)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(0, 0, 0)} />
				</textlabel>
				<textlabel
					Text={props.worldName}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(0.3, 0.1)}
					TextColor3={Color3.fromRGB(52, 190, 255)}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(10, 50, 65)} />
				</textlabel>
				<textlabel
					Text={props?.price !== undefined ? twoDpAbbreviator.numberToString(props.price) : "Free"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.54, 0.71)}
					Size={UDim2.fromScale(0.22, 0.17)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
					TextXAlignment={Enum.TextXAlignment.Left}
				>
					<uistroke Color={Color3.fromRGB(0, 0, 0)} Thickness={3} />
					<imagelabel
						Image={assetIds.images.currencies[props.currency]}
						BackgroundTransparency={1}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(-0.25, 0.5)}
						Size={UDim2.fromScale(0.389, 0.99)}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagelabel>
				</textlabel>
				<imagelabel
					Image={"rbxassetid://10210423447"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.18)}
					Size={UDim2.fromScale(0.165, 0.306)}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagelabel>
				<ZonePurchaseButton onClick={(): void => props.purchaseClicked(props.zoneName, props.worldName)} />
			</surfacegui>
		);
	}
}
