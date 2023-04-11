// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { hooks } from "client/ui/hooks";
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
export const ZoneSign = hooks((props: ZoneSignProps) => {
	if (props.zoneData.cost === undefined) {
		return <></>;
	}

	return (
		<surfacegui Adornee={props.adornee} LightInfluence={0}>
			<BaseFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
			>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.15),
						Size: UDim2.fromScale(1, 0.25),
						Text: props.zoneName,
						TextColor3: props.zoneData.color,
					}}
					stroke={{
						native: { Thickness: 5 },
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.325),
						Size: UDim2.fromScale(1, 0.15),
						Text: `(${props.worldName})`,
					}}
					stroke={{
						native: { Thickness: 5 },
					}}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.75, 0.575),
						Size: UDim2.fromScale(0.5, 0.2),
						Text: twoDpAbbreviator.numberToString(props.zoneData.cost.amount),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{
						native: { Thickness: 5, Color: Color3.fromRGB(255, 255, 255) },
						currencyGradient: props.zoneData.cost.currency,
					}}
				>
					<CurrencyIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ minimizedSize: 0.9, maximizedSize: 1 }}
						currency={props.zoneData.cost.currency}
					/>
				</StrokeTextLabel>

				<DisplayZonePurchasePrompt
					worldName={props.worldName}
					zoneName={props.zoneName}
					zoneData={props.zoneData}
					setViewedZone={props.setViewedZone}
				/>

				<RankIcon
					position={UDim2.fromScale(0.1, 0.25)}
					size={{ minimizedSize: 0.3, maximizedSize: 0.35 }}
					rank={props.zoneData.cost.requiredRank}
				/>
			</BaseFrame>
		</surfacegui>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
