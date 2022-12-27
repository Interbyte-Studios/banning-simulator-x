import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/currencyIcon";
import { RankIcon } from "client/ui/elements/rankIcon";
import { hooks } from "client/ui/hooks";
import { Zone } from "shared/configs/zones";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

/**
 * Displays the base information about a zone.
 */
export const BaseZoneInfo = hooks((props: { zoneData: Zone; adornee: BasePart }) => {
	if (props.zoneData.cost === undefined) {
		return <></>;
	}

	return (
		<surfacegui Adornee={props.adornee} LightInfluence={0} SizingMode={Enum.SurfaceGuiSizingMode.FixedSize}>
			<RankIcon
				position={UDim2.fromScale(0.5, 0.5)}
				size={{ minimizedSize: 0.4, maximizedSize: 0.5 }}
				rank={props.zoneData.cost.requiredRank}
			/>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.59, 0.85)}
				Size={UDim2.fromScale(0.3, 0.2)}
				Font={font}
				Text={twoDpAbbreviator.numberToString(props.zoneData.cost.amount)}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseUIStroke
					native={{ Thickness: 5, Color: Color3.fromRGB(255, 255, 255) }}
					currencyGradient={props.zoneData.cost.currency}
				/>
				<CurrencyIcon
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(-0.35, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					currency={props.zoneData.cost.currency}
				/>
			</textlabel>
		</surfacegui>
	);
});
