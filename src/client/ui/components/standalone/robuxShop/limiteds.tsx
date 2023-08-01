import Roact from "@rbxts/roact";
import { MarketplaceService, Players, PolicyService, RunService } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor, uiTextStrokeColor, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
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
import { LIMITED_EGG_DEVPRODUCT } from "shared/configs/game";
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
	(props: { position: UDim2; petId: number; devProductId: number }, { useState, useEffect, useContext }) => {
		const [canBuy, setCanBuy] = useState(true);
		const [itemCost, setItemCost] = useState(0);

		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		const petData = getPetData(props.petId);
		const petDecal = getPetImage(props.petId, "regular");
		useEffect(() => {
			task.spawn(() => {
				const productInfo = MarketplaceService.GetProductInfo(props.devProductId, Enum.InfoType.Product);

				if (productInfo.PriceInRobux !== undefined) {
					setItemCost(productInfo.PriceInRobux);
				}
			});
		}, []);

		useEffect(() => {
			if (!canBuy) {
				return;
			}

			task.spawn(() => {
				const playerRestrictions = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
				if (playerRestrictions.ArePaidRandomItemsRestricted) {
					setCanBuy(false);
				}
			});
		});

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

							if (!canBuy) {
								addAnnouncement(`Your region does not allow you to purchase that!`, AnnouncementType.Error);
								return;
							}

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
export const Limiteds = hooks((_, { useState, useEffect, useContext }) => {
	const [canBuy, setCanBuy] = useState(true);
	const [timer, setTimer] = useState(0);

	const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

	useEffect(() => {
		const newLimiteds = DateTime.fromUniversalTime(2023, 8, 12, 12).UnixTimestamp;
		const connection = RunService.Heartbeat.Connect(() => {
			debug.profilebegin("limitedsShop");
			const timeCheck = time();
			if (timeCheck - lastTimerCheck < 1) {
				return;
			}
			lastTimerCheck = timeCheck;

			const now = DateTime.now().UnixTimestamp;
			setTimer(newLimiteds - now);
			debug.profileend();
		});

		return (): void => connection.Disconnect();
	}, [timer]);

	useEffect(() => {
		if (!canBuy) {
			return;
		}

		task.spawn(() => {
			const playerRestrictions = PolicyService.GetPolicyInfoForPlayerAsync(Players.LocalPlayer);
			if (playerRestrictions.ArePaidRandomItemsRestricted) {
				setCanBuy(false);
			}
		});
	});

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
				Position={UDim2.fromScale(0.5, 0.05)}
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
						Text: "Dweller!",
					}}
					stroke={{ native: { Thickness: 2.5, Color: Color3.fromRGB(116, 32, 34) } }}
				/>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.11, 0.5),
						Size: UDim2.fromScale(1, 1),
						Image: assetIds.images.decals.eggs["Dweller Egg"],
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
					Position={UDim2.fromScale(0.25, 0.685)}
					Size={UDim2.fromScale(0.4, 0.4)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(124, "regular"),
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
					Position={UDim2.fromScale(0.405, 0.685)}
					Size={UDim2.fromScale(0.45, 0.45)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(125, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "20%",
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
					Position={UDim2.fromScale(0.575, 0.685)}
					Size={UDim2.fromScale(0.5, 0.5)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(126, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "3.5%",
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
					Position={UDim2.fromScale(0.75, 0.685)}
					Size={UDim2.fromScale(0.5, 0.5)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
					<uicorner CornerRadius={new UDim(1, 0)} />
					<BaseUIStroke native={{ Thickness: 5, Color: uiDarkStrokeColor }} />

					<ImageLabel
						native={{
							Size: UDim2.fromScale(1, 1),
							Image: getPetImage(127, "regular"),
						}}
					/>

					<StrokeTextLabel
						native={{
							Text: "1.5%",
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

							if (!canBuy) {
								addAnnouncement(`Your region does not allow you to purchase that!`, AnnouncementType.Error);
								return;
							}

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

							if (!canBuy) {
								addAnnouncement(`Your region does not allow you to purchase that!`, AnnouncementType.Error);
								return;
							}

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
		</>
	);
});
