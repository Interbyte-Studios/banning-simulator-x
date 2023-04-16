import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { currencies, Currency } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { FullComponentHeader } from "../util/fullComponentHeader";

const MAX_ADMIN_CURRENCY = 500000000000000;

/* eslint-disable jsdoc/require-jsdoc */
export const ModifyCurrency = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [currencySelected, setCurrencySelected] = useState<Currency | undefined>(undefined);
	const [currencyAmount, setCurrencyAmount] = useState<number | undefined>(undefined);
	const [modifiedAmount, setModifiedAmount] = useState<number | undefined>(undefined);

	const playerStore = retrieveStore(props.playerViewing);
	if (playerStore === undefined) {
		return (
			<FullComponentHeader
				storeFound={true}
				headerText={`Error Loading Admin Options (E: 1)`}
				returnToSelection={props.setActiveAction}
				displayReturn={true}
			/>
		);
	}

	const { admin_ModifyCurrency } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const maximizedSize = 0.15;

	if (currencySelected !== undefined && currencyAmount !== undefined) {
		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Modify Currency Confirmation for ${props.playerViewing.Name}`}
					returnToSelection={(): void => setCurrencyAmount(undefined)}
					displayReturn={true}
				/>

				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.2),
						Text: `Are you sure you want to change the give ${
							props.playerViewing.Name
						} ${twoDpAbbreviator.numberToString(currencyAmount)} ${currencySelected}?`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				>
					<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
				</StrokeTextLabel>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.75, 0.675),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setCurrencyAmount(undefined);
							setCurrencySelected(undefined);
							setModifiedAmount(undefined);
							props.setActiveAction();
							admin_ModifyCurrency.SendToServer(props.playerViewing.UserId, currencySelected, currencyAmount);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.2),
							Text: "Yes",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
						}}
					/>
				</SpringImageButton>

				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.25, 0.675),
						Image: assetIds.images.ui.index.footerNotice,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setCurrencyAmount(undefined);
							setCurrencySelected(undefined);
							setModifiedAmount(undefined);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.95, 0.2),
							Text: "No",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else if (currencySelected !== undefined) {
		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`How much ${currencySelected} do you want to give ${props.playerViewing.Name}?`}
					returnToSelection={(): void => {
						setCurrencySelected(undefined);
						setModifiedAmount(undefined);
					}}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.075),
						Text: `Currency Amount: ${
							modifiedAmount !== undefined ? twoDpAbbreviator.numberToString(modifiedAmount) : "(No Input)"
						}`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<BaseFrame
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.5, 0.615)}
					Size={UDim2.fromScale(0.4, 0.125)}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textbox
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 0.6)}
						PlaceholderText={"Input Level: (Ex: 30)"}
						PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
						Text={""}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
						TextScaled={true}
						Change={{
							Text: (rbx): void => {
								const text = rbx.Text;
								if (text === "") {
									return;
								}

								const number = tonumber(text);
								if (number === undefined) {
									return;
								}

								const roundedNumber = math.floor(number);
								if (roundedNumber > MAX_ADMIN_CURRENCY) {
									if (modifiedAmount === MAX_ADMIN_CURRENCY) {
										return;
									}

									setModifiedAmount(MAX_ADMIN_CURRENCY);
								} else setModifiedAmount(roundedNumber);
							},
						}}
					>
						<BaseUIStroke native={{ Thickness: 1.2 }} />
					</textbox>
				</BaseFrame>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.75),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setCurrencyAmount(modifiedAmount);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Ok!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative currency ui.");

			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		});

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Select Currency to give to ${props.playerViewing.Name}`}
					returnToSelection={(): void => props.setActiveAction()}
					displayReturn={true}
				/>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(110, 110)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={layoutRef.value}
					/>
					{currencies.map((currencyName) => {
						return (
							<BaseFrame>
								<SpringImageButton
									native={{
										BackgroundTransparency: 0,
										BackgroundColor3: Color3.fromRGB(46, 115, 179),
										Image: "",
										Size: UDim2.fromScale(0.925, 0.925),
									}}
									size={{ maxSize: maximizedSize, minSize: minimizedSize }}
									events={{
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											setCurrencySelected(currencyName);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
									<CurrencyIcon
										anchorPoint={vec2Middle}
										position={UDim2.fromScale(0.5, 0.5)}
										size={UDim2.fromScale(0.9, 0.9)}
										currency={currencyName}
									/>
									<StrokeTextLabel
										native={{
											Size: UDim2.fromScale(1, 0.2),
											Position: UDim2.fromScale(0.5, 0.1),
											Text: currencyName,
										}}
										stroke={{
											native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
										}}
									/>
								</SpringImageButton>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}
});
