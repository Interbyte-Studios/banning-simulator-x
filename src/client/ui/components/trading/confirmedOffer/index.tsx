import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor, uiOffButtonStrokeColor, uiTextStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import assetIds from "shared/assets";

import { Offer } from "./confirmedOfferUtil/offer";

/**
 * This component is the confirmed offer section of the trade window.
 *
 * @returns A Roact element that represents the confirmed offer component.
 */
export const ConfirmedOffer = (): Roact.Element => {
	return (
		<>
			<BaseFrame Position={UDim2.fromScale(0.26, 0.34)} Size={UDim2.fromScale(0.46, 0.57)}>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Thickness: 4, Color: uiTextStrokeColor }} />

				<Offer offerType={"Local"} />
				<Offer offerType={"Foreign"} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.785),
						Size: UDim2.fromScale(0.96, 0.048),
						Text: "Once you click Confirm, the trade is final! You cannot undo a trade. Careful!",
					}}
					stroke={{ native: { Thickness: 2, Color: uiTextStrokeColor } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.615, 0.89),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.175, maxSize: 0.2 }}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Confirm",
						}}
						stroke={{ native: { Thickness: 2, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.384, 0.89),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ minSize: 0.175, maxSize: 0.2 }}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Text: "Cancel",
						}}
						stroke={{ native: { Thickness: 2, Color: uiOffButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		</>
	);
};
