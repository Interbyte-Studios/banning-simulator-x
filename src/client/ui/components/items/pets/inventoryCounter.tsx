import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

/**
 * Displays the counters of equipped pets and inventory size.
 */
export const PetInventoryCounterTopBar = hooks(() => {
	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.4, 0.115)}
			Position={UDim2.fromScale(0.525, 0.055)}
			Image={assetIds.images.ui.inventory.pets.topbar}
			ScaleType={Enum.ScaleType.Fit}
		>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.5, 0.7)}
				Position={UDim2.fromScale(0.075, 0.5)}
				Image={assetIds.images.ui.inventory.pets["pet counter icon"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.3, 0.7)}
				Position={UDim2.fromScale(0.3, 0.5)}
				Text={"0/12"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.25, Color: Color3.fromRGB(0, 41, 128) }} />
			</textlabel>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.5, 0.7)}
				Position={UDim2.fromScale(0.55, 0.5)}
				Image={assetIds.images.ui.inventory.pets["inventory size counter icon"]}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.35, 0.7)}
				Position={UDim2.fromScale(0.8, 0.5)}
				Text={"1500/1500"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 1.25, Color: Color3.fromRGB(0, 41, 128) }} />
			</textlabel>
		</imagelabel>
	);
});
