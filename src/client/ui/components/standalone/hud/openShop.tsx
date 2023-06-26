import Roact from "@rbxts/roact";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

interface OpenShopProps {
	position: UDim2;
	minimizedSize: number;
	maximizedSize: number;
}

/* eslint-disable jsdoc/require-jsdoc */
export const OpenShop = hooks((props: OpenShopProps) => {
	return (
		<SpringImageButton
			native={{
				Position: props.position,
				Image: assetIds.images.ui.hud.shop,
			}}
			size={{
				maxSize: props.maximizedSize,
				minSize: props.minimizedSize,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</SpringImageButton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
