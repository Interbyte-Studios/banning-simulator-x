import Roact from "@rbxts/roact";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { playSFX, UIEngagement } from "client/util/playSound";

/**
 * A template for the account icons.
 *
 * @param props The props for the template.
 * @param props.image The image for the icon.
 * @param props.text The text for the icon.
 * @param props.layoutOrder The layout order for the icon.
 * @param props.accessibleFeature Whether the icon is accessible.
 * @param props.onPressed The function to call when the icon is pressed.
 * @returns The template.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const AccountIconTemplate = (props: {
	image: string;
	imageSize?: UDim2;
	imagePosition?: UDim2;
	displayBackground: boolean;
	text: string;
	layoutOrder: number;
	accessibleFeature: boolean;
	onPressed: () => void;
}): Roact.Element => {
	return (
		<BaseFrame LayoutOrder={props.layoutOrder}>
			<SpringImageButton
				native={{
					BackgroundTransparency: props.displayBackground ? 1 : 0,
					BackgroundColor3: Color3.fromRGB(0, 131, 213),
					Image: props.displayBackground ? props.image : "",
				}}
				size={{ minSize: 0.9, maxSize: 1 }}
				events={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);

						if (props.accessibleFeature) {
							props.onPressed();
						}
					},
				}}
			>
				<uiaspectratioconstraint AspectRatio={1} />

				{props.displayBackground ? undefined : <uicorner CornerRadius={new UDim(1, 0)} />}
				{props.displayBackground ? undefined : <BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />}
				{props.displayBackground ? undefined : (
					<ImageLabel
						native={{
							Image: props.image,
							Size: props.imageSize ?? UDim2.fromScale(0.9, 0.9),
							Position: props.imagePosition ?? UDim2.fromScale(0.5, 0.5),
						}}
					/>
				)}

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(1, 0.25),
						Position: UDim2.fromScale(0.5, 0),
						Text: props.text,
					}}
					stroke={{
						native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
					}}
				/>
			</SpringImageButton>
		</BaseFrame>
	);
};
/* eslint-enable jsdoc/require-jsdoc */
