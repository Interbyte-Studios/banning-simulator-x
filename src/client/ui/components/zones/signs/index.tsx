// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseTextLabel } from "client/ui/elements/baseElements/baseTextLabel";
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
				<BaseTextLabel
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
				<BaseTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.325),
						Size: UDim2.fromScale(1, 0.15),
						Text: `(${props.worldName})`,
					}}
					stroke={{
						native: { Thickness: 5 },
					}}
				/>
				<BaseTextLabel
					native={{
						Position: UDim2.fromScale(0.66, 0.575),
						Size: UDim2.fromScale(0.5, 0.2),
						Text: twoDpAbbreviator.numberToString(props.zoneData.cost.amount),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{
						native: { Thickness: 5 },
					}}
				>
					<CurrencyIcon
						anchorPoint={new Vector2(0, 0.5)}
						position={UDim2.fromScale(-0.35, 0.5)}
						size={{ maximizedSize: 1, minimizedSize: 0.9 }}
						currency={props.zoneData.cost.currency}
					/>
				</BaseTextLabel>

				<DisplayZonePurchasePrompt
					worldName={props.worldName}
					zoneName={props.zoneName}
					zoneData={props.zoneData}
					setViewedZone={props.setViewedZone}
				/>

				<RankIcon
					position={UDim2.fromScale(0.1, 0.5)}
					size={{ maximizedSize: 0.35, minimizedSize: 0.25 }}
					rank={props.zoneData.cost.requiredRank}
				/>
			</BaseFrame>
		</surfacegui>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
