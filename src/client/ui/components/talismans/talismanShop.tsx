import Flipper from "@rbxts/flipper";
import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService } from "@rbxts/services";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { TalismanViewport } from "client/ui/elements/talismanViewport";
import { hooks } from "client/ui/hooks";
import { Talisman, TALISMANS } from "shared/configs/talismans";
import { StoreState } from "shared/rodux";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface TalismanShopProps extends TalismanShopMappedProps {}

interface TalismanShopMappedProps {
	currentTalismanId: number;
	talismansState: TalismansState;
}

const maximizedSize = { x: 0.8, y: 0.13 };
const minimizedSize = { x: 0.72, y: 0.12 };

const closeMaximizedSize = { x: 0.08, y: 0.12 };
const closeMinimizedSize = { x: 0.07, y: 0.11 };

const springProps = {
	frequency: 5,
	dampingRatio: 0.5,
};

/**
 * @param state The state of the store.
 * @returns The mapped props.
 */
function mapStateToProps(state: StoreState): TalismanShopMappedProps {
	return {
		currentTalismanId: state.currentTalisman,
		talismansState: state.talismans,
	};
}

interface LocalTalismanInfo {
	isOwned: boolean;
	id: number;
	talismanInfo: {
		name: string;
		data: Talisman;
	};
}

/**
 * @param talismanState The current talisman state of the players store.
 * @param id The id of the talisman.
 * @returns Local data relatve to the talisman id given/.
 */
function getTalismanLocalInfo(talismanState: TalismansState, id: number): LocalTalismanInfo {
	const talismanData = getTalismanData(id);

	return {
		isOwned: talismanState.has(id),
		id: id,
		talismanInfo: {
			name: talismanData.name,
			data: talismanData,
		},
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const TalismanShop = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanShopProps, { useState, useEffect }) => {
		const [isVisible, setVisibility] = useState(true);
		const [viewedTalismanInfo, setViewedTalismanInfo] = useState(
			getTalismanLocalInfo(props.talismansState, props.currentTalismanId),
		);

		const actionButtonMotor = new Flipper.GroupMotor({ x: maximizedSize.x, y: maximizedSize.y });
		const [actionButtonBinding, setActionButtonBinding] = Roact.createBinding(actionButtonMotor.getValue());

		const closeButtonMotor = new Flipper.GroupMotor({ x: closeMaximizedSize.x, y: closeMaximizedSize.y });
		const [closeButtonBinding, setCloseButtonBinding] = Roact.createBinding(closeButtonMotor.getValue());

		actionButtonMotor.onStep(setActionButtonBinding);
		closeButtonMotor.onStep(setCloseButtonBinding);

		useEffect(() => {
			ContextActionService.BindAction(
				"talismanShop",
				(_, state) => {
					if (state !== Enum.UserInputState.Begin) {
						return;
					}

					setVisibility(!isVisible);
				},
				false,
				Enum.KeyCode.T,
			);

			return (): void => {
				ContextActionService.UnbindAction("talismanShop");
			};
		}, [isVisible]);

		return (
			<frame
				Visible={isVisible}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.45, 0.6)}
				BackgroundColor3={Color3.fromRGB(255, 226, 188)}
			>
				<textbutton
					TextTransparency={1}
					AutoButtonColor={false}
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(211, 141, 141)}
					Size={closeButtonBinding.map((value) => {
						return UDim2.fromScale(value.x, value.y);
					})}
					Position={UDim2.fromScale(0.98, 0.02)}
					Event={{
						Activated: (): void => setVisibility(false),
						MouseEnter: (): void => {
							closeButtonMotor.setGoal({
								x: new Flipper.Spring(closeMinimizedSize.x, springProps),
								y: new Flipper.Spring(closeMinimizedSize.y, springProps),
							});
						},
						MouseLeave: (): void => {
							closeButtonMotor.setGoal({
								x: new Flipper.Spring(closeMaximizedSize.x, springProps),
								y: new Flipper.Spring(closeMaximizedSize.y, springProps),
							});
						},
					}}
				>
					<textlabel
						Text={"X"}
						TextScaled={true}
						TextColor3={color3White}
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Position={UDim2.fromScale(0.5, 0.5)}
					/>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<uistroke Thickness={3} Color={Color3.fromRGB(138, 92, 92)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				</textbutton>
				<uiaspectratioconstraint AspectRatio={1.53} />
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<uistroke Thickness={3} Color={Color3.fromRGB(182, 161, 133)} />
				<textlabel
					Text={"Talisman Shop"}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.5, 0.12)}
					Position={UDim2.fromScale(0.3, -0.01)}
					Font={font}
					TextScaled={true}
					TextColor3={color3White}
					BackgroundTransparency={1}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
				</textlabel>
				<frame
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.694, 0.5)}
					BorderSizePixel={0}
					Size={UDim2.fromScale(0.01, 0.998)}
					BackgroundColor3={Color3.fromRGB(182, 161, 133)}
				></frame>
				<frame
					Size={UDim2.fromScale(0.3, 1)}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.85, 0.5)}
					BackgroundTransparency={1}
				>
					<textlabel
						Text={viewedTalismanInfo.talismanInfo.name}
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.2)}
						Size={UDim2.fromScale(0.95, 0.2)}
						Font={font}
						TextColor3={color3White}
						TextScaled={true}
					>
						<uistroke Thickness={2} Color={Color3.fromRGB(11, 52, 68)} />
					</textlabel>
					<textlabel
						Text={twoDpAbbreviator.numberToString(viewedTalismanInfo.talismanInfo.data.cost.amount)}
						AnchorPoint={vec2Middle}
						TextColor3={color3White}
						Position={UDim2.fromScale(0.62, 0.4)}
						TextScaled={true}
						Font={font}
						BackgroundTransparency={1}
						TextXAlignment={Enum.TextXAlignment.Left}
						Size={UDim2.fromScale(0.5, 0.1)}
					>
						<imagelabel
							Image={"rbxassetid://10498937588"}
							BackgroundTransparency={1}
							ScaleType={Enum.ScaleType.Fit}
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(-0.3, 0.5)}
							Size={UDim2.fromScale(0.5, 1.1)}
						></imagelabel>
						<uistroke Thickness={2} Color={Color3.fromRGB(11, 52, 68)} />
					</textlabel>
					<textlabel
						Text={`+ ${viewedTalismanInfo.talismanInfo.data.stats.damage}`}
						AnchorPoint={vec2Middle}
						TextColor3={color3White}
						Position={UDim2.fromScale(0.62, 0.53)}
						TextScaled={true}
						Font={font}
						BackgroundTransparency={1}
						TextXAlignment={Enum.TextXAlignment.Left}
						Size={UDim2.fromScale(0.5, 0.1)}
					>
						<imagelabel
							Image={"rbxassetid://10497685527"}
							BackgroundTransparency={1}
							ScaleType={Enum.ScaleType.Fit}
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(-0.3, 0.5)}
							Size={UDim2.fromScale(0.5, 1.1)}
						></imagelabel>
						<uistroke Thickness={2} Color={Color3.fromRGB(11, 52, 68)} />
					</textlabel>
					<textlabel
						Text={`Tier ${viewedTalismanInfo.talismanInfo.data.tier}`}
						AnchorPoint={vec2Middle}
						TextColor3={color3White}
						Position={UDim2.fromScale(0.62, 0.66)}
						TextScaled={true}
						Font={font}
						BackgroundTransparency={1}
						TextXAlignment={Enum.TextXAlignment.Left}
						Size={UDim2.fromScale(0.5, 0.1)}
					>
						<imagelabel
							Image={"rbxassetid://10498643127"}
							BackgroundTransparency={1}
							ScaleType={Enum.ScaleType.Fit}
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(-0.3, 0.5)}
							Size={UDim2.fromScale(0.5, 1.1)}
						></imagelabel>
						<uistroke Thickness={2} Color={Color3.fromRGB(11, 52, 68)} />
					</textlabel>
					<textbutton
						TextTransparency={1}
						AnchorPoint={vec2Middle}
						AutoButtonColor={false}
						Position={UDim2.fromScale(0.5, 0.84)}
						Size={actionButtonBinding.map((value) => {
							return UDim2.fromScale(value.x, value.y);
						})}
						BackgroundColor3={Color3.fromRGB(167, 240, 170)}
						Event={{
							MouseEnter: (): void => {
								actionButtonMotor.setGoal({
									x: new Flipper.Spring(minimizedSize.x, springProps),
									y: new Flipper.Spring(minimizedSize.y, springProps),
								});
							},
							MouseLeave: (): void => {
								actionButtonMotor.setGoal({
									x: new Flipper.Spring(maximizedSize.x, springProps),
									y: new Flipper.Spring(maximizedSize.y, springProps),
								});
							},
						}}
					>
						<uistroke
							Color={Color3.fromRGB(112, 158, 113)}
							Thickness={3}
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						/>
						<uicorner CornerRadius={new UDim(0.2, 0)} />
						<textlabel
							Text={"Purchase"}
							AnchorPoint={vec2Middle}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.8, 0.8)}
							Font={font}
							BackgroundTransparency={1}
							TextScaled={true}
							TextColor3={color3White}
						>
							<uistroke Thickness={2} Color={Color3.fromRGB(112, 158, 113)} />
						</textlabel>
					</textbutton>
				</frame>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BorderSizePixel={0}
					ScrollBarThickness={8}
					Position={UDim2.fromScale(0.342, 0.5)}
					SizeConstraint={Enum.SizeConstraint.RelativeXY}
					Size={UDim2.fromScale(0.69, 1)}
					BackgroundTransparency={1}
				>
					<uigridlayout
						CellSize={UDim2.fromScale(0.28, 0.15)}
						CellPadding={UDim2.fromScale(0.05, 0.023)}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
					/>
					<uipadding PaddingLeft={new UDim(0.03, 0)} PaddingTop={new UDim(0.03, 0)} />

					{Object.entries(TALISMANS).map(([, talismanData]) => {
						return (
							<textbutton
								BackgroundTransparency={1}
								TextTransparency={1}
								TextScaled={true}
								AutoButtonColor={false}
								Font={font}
								Event={{
									Activated: (): void => {
										setViewedTalismanInfo(getTalismanLocalInfo(props.talismansState, talismanData.id));
									},
								}}
							>
								<TalismanViewport
									native={{
										AnchorPoint: vec2Middle,
										Position: UDim2.fromScale(0.5, 0.5),
										Size: UDim2.fromScale(1, 1),
										BackgroundColor3: Color3.fromRGB(0, 0, 0),
										BackgroundTransparency: 1,
									}}
									talismanId={talismanData.id}
								/>
								<uistroke
									Thickness={3}
									Color={Color3.fromRGB(0, 80, 120)}
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
								/>
								<uicorner CornerRadius={new UDim(0.1, 0)} />
							</textbutton>
						);
					})}
				</scrollingframe>
			</frame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
