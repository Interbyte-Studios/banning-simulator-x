import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { Zone, ZoneNames } from "shared/configs/zones";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { DisplayZonePurchasePrompt } from "./displayZonePurchasePrompt";

interface ZoneSignProps {
	adornee: BasePart;
	zoneName: ZoneNames;
	zoneData: Zone;
	worldName: WorldName;
	setViewedZone: (world: WorldName, zone: number) => void;
}

/**
 * A roact component that displays a sign for a designated zone with all the relevant purchase information.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZoneSign = hooks((props: ZoneSignProps, hooks) => {
	if (props.zoneData.cost === undefined) {
		return <></>;
	}

	return (
		<surfacegui Adornee={props.adornee} LightInfluence={0}>
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
					Text={props.zoneName}
					TextColor3={props.zoneData.color}
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
					Text={`(${props.worldName})`}
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
					Text={twoDpAbbreviator.numberToString(props.zoneData.cost.amount)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<CurrencyIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						currency={props.zoneData.cost.currency}
					/>
					<BaseUIStroke Thickness={5} />
				</textlabel>
				<DisplayZonePurchasePrompt
					worldName={props.worldName}
					zoneData={props.zoneData}
					setViewedZone={props.setViewedZone}
				/>
				<RankIcon
					position={UDim2.fromScale(0.1, 0.5)}
					size={{ maximizedSize: 0.35, minimizedSize: 0.25 }}
					rank={props.zoneData.cost.requiredRank}
				/>
			</frame>
		</surfacegui>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
