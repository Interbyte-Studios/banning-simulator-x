import Roact from "@rbxts/roact";
import { MarketplaceService, Players, RunService } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { EXCLUSIVE_PETS, LIMITED_EGG_DEVPRODUCT } from "shared/configs/game";
import { getPetData } from "shared/util/getPetData";

let lastTimerCheck = 0;

/**
 * The display an exclusive pet in the Robux Shop.
 *
 * @param props The ExclusivePet props.
 * @param props.position The position of the pet.
 * @param props.petId The pet id of the pet.
 * @param props.devProductId The developer product id of the pet.
 *  @returns A Roact element displaying an exclusive pet.
 */
const ExclusivePet = hooks(
	(props: { position: UDim2; petId: number; devProductId: number }, { useState, useEffect }) => {
		const [itemCost, setItemCost] = useState(0);

		const petData = getPetData(props.petId);
		const petDecal = getPetImage(props.petId, "regular");
		useEffect(() => {
			const productInfo = MarketplaceService.GetProductInfo(props.devProductId, Enum.InfoType.Product);

			if (productInfo.PriceInRobux !== undefined) {
				setItemCost(productInfo.PriceInRobux);
			}
		}, []);

		return (
			<BaseFrame
				Position={props.position}
				Size={UDim2.fromScale(0.25, 0.25)}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				BackgroundTransparency={0}
			>
				<uiaspectratioconstraint AspectRatio={1} />
				<uicorner CornerRadius={new UDim(0.25, 0)} />
				<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.075),
						Size: UDim2.fromScale(0.9, 0.15),
						Text: petData.name,
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
				/>

				<BaseFrame
					Size={UDim2.fromScale(0.65, 0.65)}
					BackgroundColor3={Color3.fromRGB(15, 163, 255)}
					BackgroundTransparency={0}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: petDecal,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				</BaseFrame>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.915),
						Size: UDim2.fromScale(0.425, 0.15),
						Text: `R${itemCost}`,
						TextColor3: Color3.fromRGB(134, 252, 122),
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
				/>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 1.1),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.325, maxSize: 0.375 }}
					events={{
						/**
						 * Prompt the player to purchase the pet.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, props.devProductId);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.75, 0.75),
							Text: "Buy",
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	},
);

/**
 * The display for limited time purchases in the Robux Shop.
 *
 * @returns A Roact element displaying the limiteds.
 */
export const Limiteds = hooks((_, { useState, useEffect }) => {
	const [timer, setTimer] = useState(0);

	useEffect(() => {
		const newLimiteds = DateTime.fromUniversalTime(2023, 7, 14, 12).UnixTimestamp;
		const connection = RunService.Heartbeat.Connect(() => {
			const timeCheck = time();
			if (timeCheck - lastTimerCheck < 1) {
				return;
			}
			lastTimerCheck = timeCheck;

			const now = DateTime.now().UnixTimestamp;
			setTimer(newLimiteds - now);
		});

		return (): void => connection.Disconnect();
	}, [timer]);

	return (
		<>
			<StrokeTextLabel
				native={{
					Position: UDim2.fromScale(0.5, 0.015),
					Size: UDim2.fromScale(0.9, 0.015),
					Text: `Limited time only! Available for: ${formatTime(timer)}`,
				}}
				stroke={{ native: { Thickness: 2.5, Color: uiTextStrokeColor } }}
			/>
			<BaseFrame
				Position={UDim2.fromScale(0.5, 0.065)}
				Size={UDim2.fromScale(0.95, 0.065)}
				BackgroundColor3={Color3.fromRGB(12, 134, 211)}
				BackgroundTransparency={0}
			>
				<uiaspectratioconstraint AspectRatio={4.5} />
				<uicorner CornerRadius={new UDim(0.1, 0)} />
				<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.2),
						Size: UDim2.fromScale(0.415, 0.394),
						TextColor3: Color3.fromRGB(255, 71, 74),
						Text: "Royal Egg!",
					}}
					stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(116, 32, 34) } }}
				/>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.11, 0.5),
						Size: UDim2.fromScale(1, 1),
						Image: assetIds.images.decals.eggs.Royal,
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.06, 0.005),
						Size: UDim2.fromScale(0.215, 0.265),
						TextColor3: Color3.fromRGB(255, 71, 74),
						Text: "New!",
					}}
					stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(116, 32, 34) } }}
				/>

				<BaseFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(15, 163, 255)}
					Position={UDim2.fromScale(0.33, 0.685)}
					Size={UDim2.fromScale(0.4, 0.4)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(44, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "75%",
							Position: UDim2.fromScale(0.8, 0.96),
							Size: UDim2.fromScale(0.646, 0.56),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				<BaseFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(15, 163, 255)}
					Position={UDim2.fromScale(0.485, 0.685)}
					Size={UDim2.fromScale(0.45, 0.45)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(45, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "23%",
							Position: UDim2.fromScale(0.8, 0.96),
							Size: UDim2.fromScale(0.646, 0.56),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				<BaseFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(15, 163, 255)}
					Position={UDim2.fromScale(0.65, 0.685)}
					Size={UDim2.fromScale(0.5, 0.5)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(46, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "2%",
							Position: UDim2.fromScale(0.8, 0.96),
							Size: UDim2.fromScale(0.646, 0.56),
						}}
						stroke={{ native: { Thickness: 2, Color: uiDarkStrokeColor } }}
					/>
				</BaseFrame>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.925, 0.1),
						Size: UDim2.fromScale(0.1, 0.15),
						Text: "R$199",
						TextColor3: Color3.fromRGB(134, 252, 122),
					}}
					stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(17, 150, 55) } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.925, 0.335),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.2, maxSize: 0.25 }}
					events={{
						/**
						 * When the button is activated, Buy 1 egg.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, LIMITED_EGG_DEVPRODUCT.OneEgg);
						},
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.75, 0.75),
							Text: "Buy 1",
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>

				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.925, 0.6),
						Size: UDim2.fromScale(0.1, 0.15),
						Text: "R$599",
						TextColor3: Color3.fromRGB(134, 252, 122),
					}}
					stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(17, 150, 55) } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.925, 0.8),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.2, maxSize: 0.25 }}
					events={{
						/**
						 * When the button is activated, Buy 1 egg.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, LIMITED_EGG_DEVPRODUCT.ThreeEggs);
						},
					}}
				>
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.75, 0.75),
							Text: "Buy 3",
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</BaseFrame>

			<ExclusivePet
				position={UDim2.fromScale(0.15, 0.145)}
				petId={EXCLUSIVE_PETS[0].petId}
				devProductId={EXCLUSIVE_PETS[0].devproductId}
			/>

			<ExclusivePet
				position={UDim2.fromScale(0.5, 0.145)}
				petId={EXCLUSIVE_PETS[1].petId}
				devProductId={EXCLUSIVE_PETS[1].devproductId}
			/>

			<ExclusivePet
				position={UDim2.fromScale(0.85, 0.145)}
				petId={EXCLUSIVE_PETS[2].petId}
				devProductId={EXCLUSIVE_PETS[2].devproductId}
			/>
		</>
	);
});
