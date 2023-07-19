import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players } from "@rbxts/services";
import { uiClaimButtonStrokeColor, uiDarkStrokeColor } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { hooks } from "client/ui/hooks";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { GAMEPASS_DESCRIPTIONS, GAMEPASS_ORDER, GAMEPASSES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { GamepassesState } from "shared/rodux/gamepasses";

interface GamepassProps extends GamepassesMappedProps {
	giftGamepass: (gamepassName: keyof typeof GAMEPASSES) => void;
}

interface GamepassesMappedProps {
	gamepasses: GamepassesState;
}

/**
 * The Gamepasses component mapped store props.
 *
 * @param state The state of the store.
 * @returns The mapped store props.
 */
const mapStateToProps = (state: StoreState): GamepassesMappedProps => {
	return {
		gamepasses: state.gamepasses,
	};
};

/**
 * A gamepass display.
 *
 * @param props The gamepass props.
 * @param props.gamepassName The name of the gamepass.
 * @param props.devProductId The developer product id of the gamepass.
 * @param props.isOwned Whether the player owns the gamepass.
 * @returns A Roact element of the gamepass.
 */
const Gamepass = hooks(
	(
		props: { gamepassName: keyof typeof GAMEPASSES; devProductId: number; isOwned: boolean; giftGamepass: () => void },
		{ useState, useEffect },
	) => {
		const [itemPrice, setItemPrice] = useState(0);
		useEffect(() => {
			task.spawn(() => {
				const productInfo = MarketplaceService.GetProductInfo(props.devProductId, Enum.InfoType.GamePass);
				if (productInfo.PriceInRobux !== undefined) {
					setItemPrice(productInfo.PriceInRobux);
				}
			});
		}, []);

		const layoutOrder = GAMEPASS_ORDER[props.gamepassName];
		return (
			<BaseFrame LayoutOrder={layoutOrder} BackgroundTransparency={0} BackgroundColor3={Color3.fromRGB(12, 134, 211)}>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<BaseUIStroke
					native={{
						Thickness: 5,
						Color: Color3.fromRGB(2, 115, 174),
					}}
				/>

				<ImageLabel
					native={{
						Position: UDim2.fromScale(0.2, 0.5),
						Size: UDim2.fromScale(1, 1),
						Image: assetIds.images.decals.gamepasses[props.gamepassName],
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</ImageLabel>

				<StrokeTextLabel
					native={{
						Text: props.gamepassName,
						Position: UDim2.fromScale(0.67, 0.115),
						Size: UDim2.fromScale(0.59, 0.23),
						TextXAlignment: Enum.TextXAlignment.Left,
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Text: GAMEPASS_DESCRIPTIONS[props.gamepassName],
						Position: UDim2.fromScale(0.575, 0.6),
						Size: UDim2.fromScale(0.375, 0.52),
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
				/>

				<StrokeTextLabel
					native={{
						Text: `R$${itemPrice}`,
						Position: UDim2.fromScale(0.885, 0.34),
						Size: UDim2.fromScale(0.175, 0.2),
						TextColor3: Color3.fromRGB(134, 252, 122),
					}}
					stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
				/>

				<SpringImageButton
					native={{ Position: UDim2.fromScale(0.885, 0.565), Image: assetIds.images.ui.index.Claim }}
					size={{ minSize: 0.2, maxSize: 0.25 }}
					events={{
						/**
						 * Activated when the button is clicked.
						 */
						Activated: (): void => {
							if (props.isOwned) {
								return;
							}

							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, props.devProductId);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Text: props.isOwned ? "Owned" : "Buy",
							Size: UDim2.fromScale(0.735, 0.735),
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{ Position: UDim2.fromScale(0.885, 0.85), Image: assetIds.images.ui.index.Claim }}
					size={{ minSize: 0.2, maxSize: 0.25 }}
					events={{
						/**
						 * Activated when the button is clicked.
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							props.giftGamepass();
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Text: "Gift",
							Size: UDim2.fromScale(0.735, 0.735),
						}}
						stroke={{ native: { Thickness: 2.5, Color: uiClaimButtonStrokeColor } }}
					/>
				</SpringImageButton>
			</BaseFrame>
		);
	},
);

/**
 * The Gamepasses component.
 *
 * @param props The Gamepasses props.
 * @param props.gamepasses The gamepasses state.
 * @returns A Roact element of the Gamepasses.
 */
export const Gamepasses = RoactRodux.connect(mapStateToProps)((props: GamepassProps) => {
	return (
		<>
			<StrokeTextLabel
				native={{
					Text: "Gamepasses",
					Position: UDim2.fromScale(0.5, 0.165),
					Size: UDim2.fromScale(0.5, 0.015),
				}}
				stroke={{ native: { Thickness: 2.5, Color: uiDarkStrokeColor } }}
			/>
			<BaseFrame Position={UDim2.fromScale(0.5, 0.345)} Size={UDim2.fromScale(0.98, 0.4)}>
				<uigridlayout
					FillDirectionMaxCells={2}
					CellPadding={UDim2.fromScale(0.09, 0.02)}
					CellSize={UDim2.fromScale(0.45, 0.125)}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<uiaspectratioconstraint AspectRatio={0.725} />
				{Object.entries(GAMEPASSES).map(([gamepassName, devProductId]) => {
					return (
						<Gamepass
							gamepassName={gamepassName}
							devProductId={devProductId}
							isOwned={props.gamepasses[gamepassName]}
							giftGamepass={(): void => props.giftGamepass(gamepassName)}
						/>
					);
				})}
			</BaseFrame>
		</>
	);
});
