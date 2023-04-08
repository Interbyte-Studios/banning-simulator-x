import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";

export const CurrencyOffer = hooks(() => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundColor3={Color3.fromRGB(12, 134, 211)}
			Position={UDim2.fromScale(0.275, 0.915)}
			Size={UDim2.fromScale(0.5, 0.09)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(9, 96, 150) }} />
			<textbox
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.55, 0.5)}
				Size={UDim2.fromScale(0.8, 0.8)}
				Font={font}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={""}
				PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
				PlaceholderText={"Enter amount: (Ex: 500k)"}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(12, 134, 211) }} />
			</textbox>
			<CurrencyIcon
				anchorPoint={vec2Middle}
				position={UDim2.fromScale(0.065, 0)}
				size={{ minimizedSize: 0.9, maximizedSize: 1 }}
				currency={"coins"}
			/>
		</frame>
	);
});

export const LocalOffer = hooks(() => {
	return (
		<>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.095, 0)}
				Size={UDim2.fromScale(0.35, 0.1)}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={font}
				Text={"Your Offer"}
			>
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 2 }} />
			</textlabel>

			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.275, 0.45)}
				Size={UDim2.fromScale(0.485, 0.79)}
			>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 4 }} />
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.52)}
					Size={UDim2.fromScale(0.99, 0.915)}
					ScrollBarImageColor3={Color3.fromRGB(8, 82, 129)}
				></scrollingframe>
			</frame>
		</>
	);
});

export const TheirOffer = hooks(() => {
	return (
		<>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.585, 0)}
				Size={UDim2.fromScale(0.35, 0.1)}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={font}
				Text={"Their Offer"}
			>
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 2 }} />
			</textlabel>

			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.76, 0.375)}
				Size={UDim2.fromScale(0.43, 0.63)}
			>
				<uicorner CornerRadius={new UDim(0.125, 0)} />
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 4 }} />
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.52)}
					Size={UDim2.fromScale(0.99, 0.915)}
					ScrollBarImageColor3={Color3.fromRGB(8, 82, 129)}
				></scrollingframe>
			</frame>
		</>
	);
});

export const ActiveOffer = hooks(() => {
	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
		>
			<CurrencyOffer />
			<LocalOffer />
			<TheirOffer />

			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.765, 0.755)}
				Size={UDim2.fromScale(0.44, 0.1)}
				Font={font}
				Text={"All trades are final. Be careful and mindful when trading others."}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Color: Color3.fromRGB(12, 134, 211), Thickness: 2 }} />
			</textlabel>

			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.88, 0.89)}
				Size={UDim2.fromScale(0.2, 0.2)}
				Image={assetIds.images.ui.index.Claim}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Font={font}
					Text={"Confirm"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Color: Color3.fromRGB(21, 167, 61), Thickness: 2 }} />
				</textlabel>
			</imagebutton>

			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.88, 0.89)}
				Size={UDim2.fromScale(0.2, 0.2)}
				Image={assetIds.images.ui.index.Off}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint AspectRatio={2} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.9)}
					Font={font}
					Text={"Cancel"}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Color: Color3.fromRGB(147, 21, 101), Thickness: 2 }} />
				</textlabel>
			</imagebutton>
		</frame>
	);
});
