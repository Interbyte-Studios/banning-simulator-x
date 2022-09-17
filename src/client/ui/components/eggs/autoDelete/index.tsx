import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

import { BasicRarityAutoDeleteButton } from "./basicRarity";
import { EasyLegendariesAutoDeleteButton } from "./easyLegendaries";
import { EpicRarityAutoDeleteButton } from "./epicRarity";
import { OrdinaryRarityAutoDeleteButton } from "./ordinaryRarity";
import { RareRarityAutoDeleteButton } from "./rareRarity";

interface AutoDeleteMenuProps {
	visible: boolean;
	hideMenu: () => void;
}

export const AutoDelete = hooks((props: AutoDeleteMenuProps) => {
	if (!props.visible) {
		return <></>;
	}

	return (
		<imagelabel
			BackgroundTransparency={1}
			AnchorPoint={vec2Middle}
			Size={UDim2.fromScale(0.325, 0.4)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.autoDelete.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.4, 0.15)}
				Position={UDim2.fromScale(0.5, 0.085)}
				Text={"Auto Delete"}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={font}
			>
				<BaseUIStroke Thickness={2.5} />
			</textlabel>
			<BasicRarityAutoDeleteButton />
			<OrdinaryRarityAutoDeleteButton />
			<RareRarityAutoDeleteButton />
			<EpicRarityAutoDeleteButton />
			<EasyLegendariesAutoDeleteButton />
			<ExitButton
				Position={UDim2.fromScale(0.935, 0.115)}
				minimizedSize={0.125}
				maximizedSize={0.15}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
