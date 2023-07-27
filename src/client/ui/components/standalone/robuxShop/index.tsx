// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Roact from "@rbxts/roact";
import { uiClaimButtonStrokeColor, uiHeaderStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { GAMEPASSES } from "shared/configs/game";

import { Boosts } from "./boosts";
import { CurrencyShop } from "./currencies";
import { Gamepasses } from "./gamepasses";
import { GiftGamepass } from "./giftGamepass";
import { Limiteds } from "./limiteds";

interface RobuxShopProps {
	hideMenu: () => void;
}

/**
 * The RobuxShop component.
 *
 * @param props The RobuxShop props.
 * @param props.hideMenu A function to hide the menu.
 * @returns A Roact element of the RobuxShop.
 */
export const RobuxShop = hooks((props: RobuxShopProps, { useState }) => {
	const [purchaseSuccessful, setPurchaseSuccess] = useState(false);
	const [giftGamepass, setGiftGamepass] = useState<keyof typeof GAMEPASSES | undefined>(undefined);
	const [canvasPosition, setCanvasPosition] = useState(UDim2.fromScale(0, 0));

	if (giftGamepass !== undefined) {
		return <GiftGamepass gamepassName={giftGamepass} returnToShop={(): void => setGiftGamepass(undefined)} />;
	}

	let elementToDisplay: Roact.Element = <></>;
	if (purchaseSuccessful) {
		elementToDisplay = (
			<>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.225),
						Size: UDim2.fromScale(0.8, 0.1),
						Text: "Your purchase was successful!",
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.4),
						Size: UDim2.fromScale(0.8, 0.1),
						Text: "Thank you for your purchase. It should either appear in your inventory soon, or when you rejoin the game.",
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiTextStrokeColor } }}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.65),
						Size: UDim2.fromScale(0.8, 0.1),
						Text: "We appreciate your support, and will continue to give our best effort in putting out content worth playing! :)",
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiTextStrokeColor } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.875),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.125, maxSize: 0.15 }}
					events={{
						/**
						 * When the button is activated, display the shop again.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setPurchaseSuccess(false);
						},
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Okay!",
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</>
		);
	} else {
		elementToDisplay = (
			<>
				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.56)}
					Size={UDim2.fromScale(0.99, 0.815)}
					CanvasSize={UDim2.fromScale(0, 6)}
					ScrollBarImageColor3={Color3.fromRGB(22, 0, 190)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<Limiteds />
					<Gamepasses giftGamepass={(gamepassName: keyof typeof GAMEPASSES): void => setGiftGamepass(gamepassName)} />
					<Boosts />
					<CurrencyShop />
				</scrollingframe>
			</>
		);
	}

	return (
		<ImageLabel
			native={{
				Size: UDim2.fromScale(0.8, 0.8),
				Image: assetIds.images.ui.shop.background,
			}}
		>
			<uiaspectratioconstraint AspectRatio={1.5} />
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.08),
					Size: UDim2.fromScale(0.3, 0.15),
					Text: "Shop",
				}}
				stroke={{ native: { Thickness: 2.5, Color: uiHeaderStrokeColor } }}
			/>

			{elementToDisplay}
		</ImageLabel>
	);
});
