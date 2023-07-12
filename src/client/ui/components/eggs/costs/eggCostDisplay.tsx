import Roact from "@rbxts/roact";
import { ImageButton } from "client/ui/elements/baseElements/imagebuttons/image";
import { TextLabel } from "client/ui/elements/baseElements/textlabels/textlabel";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import assetIds from "shared/assets";
import { Currency } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface eggCostDisplayProps {
	adornee: BasePart;
	cost: number;
	currency: Currency;
	isVoid: boolean;
	isLimited?: true;
}

/**
 * A component that displays the currency type and cost amount of an egg.
 *
 * @param props Properties of the component.
 * @param props.adornee The adornee the component is set to.
 * @param props.cost The cost of the egg.
 * @param props.currency The currency type of the egg.
 * @param props.isVoid Whether or not the egg is a void egg.
 * @returns A roact element.
 */
export function EggCostDisplay(props: eggCostDisplayProps): Roact.Element {
	return (
		<surfacegui
			Adornee={props.adornee}
			Face={Enum.NormalId.Front}
			LightInfluence={0.8}
			ResetOnSpawn={false}
			SizingMode={"PixelsPerStud"}
			PixelsPerStud={50}
		>
			<TextLabel
				native={{
					Position: UDim2.fromScale(0.65, 0.5),
					Size: UDim2.fromScale(0.7, 0.7),
					Text: props.isLimited ? "LIMITED" : twoDpAbbreviator.numberToString(props.cost),
					TextColor3: props.isLimited
						? Color3.fromRGB(255, 255, 255)
						: props.isVoid
						? Color3.fromRGB(255, 255, 255)
						: Color3.fromRGB(0, 0, 0),
				}}
			>
				<ImageButton
					native={{
						AnchorPoint: new Vector2(1, 0.5),
						Position: UDim2.fromScale(-0.05, 0.5),
						Size: UDim2.fromScale(0.35, 1.1),
						Image: props.isLimited ? assetIds.images.vectors.Robux : getCurrencyIcon(props.currency),
					}}
				/>
			</TextLabel>
		</surfacegui>
	);
}
