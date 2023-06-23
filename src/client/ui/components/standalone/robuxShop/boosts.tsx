import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor } from "client/ui/commonValues";
import { AnnouncementContext, AnnouncementType } from "client/ui/context/AnnouncementsAPI";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { BOOST_IMAGES, BOOST_PRODUCTS } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { BoostsState } from "shared/rodux/boosts";

interface BoostsMappedProps {
	boosts: BoostsState;
}

/**
 * The Boosts component mapped store props.
 *
 * @param state The state of the store.
 * @returns The mapped store props.
 */
const mapStateToProps = (state: StoreState): BoostsMappedProps => {
	return {
		boosts: state.boosts,
	};
};

/**
 * The Boosts component.
 *
 * @param props The Boosts props.
 * @param props.boosts The boosts state.
 * @returns A Roact element of the Boosts.
 */
export const Boosts = RoactRodux.connect(mapStateToProps)(
	hooks((props: BoostsMappedProps, { useContext }) => {
		const { useBoost } = useContext(remoteContext);
		const addAnnouncement = useContext(AnnouncementContext).addAnnouncement;

		return (
			<>
				<StrokeTextLabel
					native={{
						Text: "Boosts",
						Position: UDim2.fromScale(0.5, 0.632),
						Size: UDim2.fromScale(0.5, 0.015),
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
				/>
				{Object.entries(BOOST_PRODUCTS).map(([key]) => {
					let boostName: string;
					let boostColor: Color3;
					let colorStroke: Color3;
					let position: UDim2;
					switch (key) {
						case "x2 Currency": {
							boostName = "💰x2 Currency💰";
							boostColor = Color3.fromRGB(27, 68, 255);
							colorStroke = Color3.fromRGB(15, 38, 139);
							position = UDim2.fromScale(0.5, 0.685);
							break;
						}
						case "x2 Hatching Luck": {
							boostName = "🍀x2 Luck🍀";
							boostColor = Color3.fromRGB(85, 255, 127);
							colorStroke = Color3.fromRGB(32, 95, 46);
							position = UDim2.fromScale(0.5, 0.775);
							break;
						}
						case "x2 Pet Experience": {
							boostName = "⭐x2 Pet Experience⭐";
							boostColor = Color3.fromRGB(255, 130, 28);
							colorStroke = Color3.fromRGB(103, 74, 32);
							position = UDim2.fromScale(0.5, 0.865);
							break;
						}
						case "x2 Rank Experience": {
							boostName = "⭐x2 Rank Experience⭐";
							boostColor = Color3.fromRGB(170, 0, 255);
							colorStroke = Color3.fromRGB(85, 0, 127);
							position = UDim2.fromScale(0.5, 0.955);
							break;
						}
					}

					return (
						<BaseFrame
							BackgroundTransparency={0}
							BackgroundColor3={Color3.fromRGB(12, 134, 211)}
							Position={position}
							Size={UDim2.fromScale(0.95, 0.085)}
						>
							<uicorner CornerRadius={new UDim(0.1, 0)} />
							<BaseUIStroke
								native={{
									Thickness: 5,
									Color: uiDarkStrokeColor,
								}}
							/>

							<ImageLabel
								native={{
									Position: UDim2.fromScale(0.115, 0.5),
									Size: UDim2.fromScale(1, 1),
									Image: BOOST_IMAGES[key][120],
								}}
							>
								<uiaspectratioconstraint AspectRatio={1} />
							</ImageLabel>

							<StrokeTextLabel
								native={{
									Text: boostName,
									TextColor3: boostColor,
									Position: UDim2.fromScale(0.604, 0.156),
									Size: UDim2.fromScale(0.54, 0.312),
								}}
								stroke={{ native: { Thickness: 2.5, Color: colorStroke } }}
							/>

							<BaseFrame
								AnchorPoint={new Vector2(0, 0)}
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(15, 163, 255)}
								Position={UDim2.fromScale(0.25, 0.375)}
								Size={UDim2.fromScale(0.56, 0.56)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(0.12)} />
								<BaseUIStroke
									native={{
										Thickness: 5,
										Color: uiDarkStrokeColor,
									}}
								/>

								<StrokeTextLabel
									native={{
										Text: "15 Minutes",
										Position: UDim2.fromScale(0.5, 0),
										Size: UDim2.fromScale(1, 0.2),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][15],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<StrokeTextLabel
									native={{
										Text: `${props.boosts.storage[key]["15"]} Owned`,
										Position: UDim2.fromScale(0.5, 0.75),
										Size: UDim2.fromScale(0.95, 0.175),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][15],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.205, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											MarketplaceService.PromptProductPurchase(Players.LocalPlayer, BOOST_PRODUCTS[key][15]);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "R$59",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.795, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											if (props.boosts.storage[key]["15"] < 1) {
												addAnnouncement(`You don't have any of that boost!`, AnnouncementType.Error);
												return;
											}

											useBoost.SendToServer(key, 15);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "Use",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>
							</BaseFrame>

							<BaseFrame
								AnchorPoint={new Vector2(0, 0)}
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(15, 163, 255)}
								Position={UDim2.fromScale(0.44, 0.375)}
								Size={UDim2.fromScale(0.56, 0.56)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(0.12)} />
								<BaseUIStroke
									native={{
										Thickness: 5,
										Color: uiDarkStrokeColor,
									}}
								/>

								<StrokeTextLabel
									native={{
										Text: "30 Minutes",
										Position: UDim2.fromScale(0.5, 0),
										Size: UDim2.fromScale(1, 0.2),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][30],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<StrokeTextLabel
									native={{
										Text: `${props.boosts.storage[key]["30"]} Owned`,
										Position: UDim2.fromScale(0.5, 0.75),
										Size: UDim2.fromScale(0.95, 0.175),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][30],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.205, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											MarketplaceService.PromptProductPurchase(Players.LocalPlayer, BOOST_PRODUCTS[key][30]);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "R$99",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.795, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											if (props.boosts.storage[key][30] < 1) {
												addAnnouncement(`You don't have any of that boost!`, AnnouncementType.Error);
												return;
											}

											useBoost.SendToServer(key, 30);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "Use",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>
							</BaseFrame>

							<BaseFrame
								AnchorPoint={new Vector2(0, 0)}
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(15, 163, 255)}
								Position={UDim2.fromScale(0.63, 0.375)}
								Size={UDim2.fromScale(0.56, 0.56)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(0.12)} />
								<BaseUIStroke
									native={{
										Thickness: 5,
										Color: uiDarkStrokeColor,
									}}
								/>

								<StrokeTextLabel
									native={{
										Text: "1 Hour",
										Position: UDim2.fromScale(0.5, 0),
										Size: UDim2.fromScale(1, 0.2),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][60],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<StrokeTextLabel
									native={{
										Text: `${props.boosts.storage[key]["60"]} Owned`,
										Position: UDim2.fromScale(0.5, 0.75),
										Size: UDim2.fromScale(0.95, 0.175),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][60],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.205, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											MarketplaceService.PromptProductPurchase(Players.LocalPlayer, BOOST_PRODUCTS[key][60]);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "R$199",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.795, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											if (props.boosts.storage[key][60] < 1) {
												addAnnouncement(`You don't have any of that boost!`, AnnouncementType.Error);
												return;
											}

											useBoost.SendToServer(key, 60);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "Use",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>
							</BaseFrame>

							<BaseFrame
								AnchorPoint={new Vector2(0, 0)}
								BackgroundTransparency={0}
								BackgroundColor3={Color3.fromRGB(15, 163, 255)}
								Position={UDim2.fromScale(0.82, 0.375)}
								Size={UDim2.fromScale(0.56, 0.56)}
							>
								<uiaspectratioconstraint AspectRatio={1} />
								<uicorner CornerRadius={new UDim(0.12)} />
								<BaseUIStroke
									native={{
										Thickness: 5,
										Color: uiDarkStrokeColor,
									}}
								/>

								<StrokeTextLabel
									native={{
										Text: "2 Hours",
										Position: UDim2.fromScale(0.5, 0),
										Size: UDim2.fromScale(1, 0.2),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][120],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<StrokeTextLabel
									native={{
										Text: `${props.boosts.storage[key]["120"]} Owned`,
										Position: UDim2.fromScale(0.5, 0.75),
										Size: UDim2.fromScale(0.95, 0.175),
									}}
									stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
								/>

								<ImageLabel
									native={{
										AnchorPoint: new Vector2(0, 0),
										Position: UDim2.fromScale(0.165, 0.1),
										Size: UDim2.fromScale(0.6, 0.6),
										Image: BOOST_IMAGES[key][120],
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
								</ImageLabel>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.205, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											MarketplaceService.PromptProductPurchase(Players.LocalPlayer, BOOST_PRODUCTS[key][120]);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "R$349",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>

								<SpringImageButton
									native={{
										Position: UDim2.fromScale(0.795, 0.95),
										Image: assetIds.images.ui.index.Claim,
									}}
									size={{ minSize: 0.35, maxSize: 0.45 }}
									events={{
										/**
										 * Prompt the user to purchase the boost.
										 */
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											if (props.boosts.storage[key][120] < 1) {
												addAnnouncement(`You don't have any of that boost!`, AnnouncementType.Error);
												return;
											}

											useBoost.SendToServer(key, 120);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<StrokeTextLabel
										native={{
											Text: "Use",
											Size: UDim2.fromScale(0.8, 0.8),
										}}
										stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
									/>
								</SpringImageButton>
							</BaseFrame>
						</BaseFrame>
					);
				})}
			</>
		);
	}),
);
