// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
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
				position={UDim2.fromScale(0.1, 0.25)}
				size={{ minimizedSize: 0.3, maximizedSize: 0.35 }}
				rank={props.zoneData.cost.requiredRank}
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
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(-0.35, 0.5)}
					size={{ minimizedSize: 0.9, maximizedSize: 1 }}
					currency={props.zoneData.cost.currency}
				/>
			</StrokeTextLabel>
		</surfacegui>
	);
});
