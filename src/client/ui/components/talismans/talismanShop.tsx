import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { ContextActionService, Lighting, TweenService, Workspace } from "@rbxts/services";
import { purchaseTalisman } from "client/modules/talismans/purchaseTalisman";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { BSX_UIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { Talisman } from "shared/configs/talismans";
import { Store, StoreState } from "shared/rodux";
import { SettingsState } from "shared/rodux/settings";
import { TalismansState } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface TalismanShopProps extends TalismanShopMappedProps {
	store: Store;
}

interface TalismanShopMappedProps {
	currentTalismanId: number | undefined;
	talismansState: TalismansState;
	settingsState: SettingsState;
}

const maximizedSize = { x: 0.25, y: 0.1 };
const minimizedSize = { x: 0.23, y: 0.09 };

const arrowButtonMaximizdSize = { x: 0.08, y: 0.15 };
const arrowButtonMinimizedSize = { x: 0.07, y: 0.14 };

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
		settingsState: state.settings,
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
/**
 * The talisman shop Roact component to view and purchase talismans.
 */
export const TalismanShop = RoactRodux.connect(mapStateToProps)(
	hooks((props: TalismanShopProps, { useState, useEffect, useContext }) => {
		const [isVisible, setVisibility] = useState(false);
		const [viewedTalismanInfo, setViewedTalismanInfo] = useState(
			getTalismanLocalInfo(props.talismansState, props.currentTalismanId ?? 1),
		);
		const remotes = useContext(remoteContext);

		const actionButtonMotor = new Flipper.GroupMotor({ x: maximizedSize.x, y: maximizedSize.y });
		const [actionButtonBinding, setActionButtonBinding] = Roact.createBinding(actionButtonMotor.getValue());

		const arrowButtonUpMotor = new Flipper.GroupMotor({ x: arrowButtonMaximizdSize.x, y: arrowButtonMaximizdSize.y });
		const [arrowButtonUpBinding, setArrowButtonUpBinding] = Roact.createBinding(arrowButtonUpMotor.getValue());

		const arrowButtonDownMotor = new Flipper.GroupMotor({ x: arrowButtonMaximizdSize.x, y: arrowButtonMaximizdSize.y });
		const [arrowButtonDownBinding, setArrowButtonDownBinding] = Roact.createBinding(arrowButtonDownMotor.getValue());

		actionButtonMotor.onStep(setActionButtonBinding);
		arrowButtonUpMotor.onStep(setArrowButtonUpBinding);
		arrowButtonDownMotor.onStep(setArrowButtonDownBinding);

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

		useEffect(() => {
			const camera = Workspace.CurrentCamera;
			assert(camera, `Expected to find camera`);

			if (!isVisible) {
				camera.CameraType = Enum.CameraType.Custom;
				Lighting.ClockTime = props.settingsState.visual.timeOfDay;
			} else {
				const camPart = Workspace.interactions["talisman tower"]
					?.FindFirstChild(viewedTalismanInfo.talismanInfo.data.id)
					?.FindFirstChild("CamPart");

				assert(camPart, `Expected to find Camera Part for ${viewedTalismanInfo.talismanInfo.name}`);
				assert(camPart?.IsA("BasePart"), `Expected campart to be a base part`);

				camera.CameraType = Enum.CameraType.Scriptable;
				Lighting.ClockTime = viewedTalismanInfo.talismanInfo.data.id > 4 ? 5 : 11;

				const tween = TweenService.Create(
					camera,
					new TweenInfo(0.1, Enum.EasingStyle.Linear, Enum.EasingDirection.In),
					{
						CFrame: camPart.CFrame,
					},
				);
				tween.Play();
			}
		}, [viewedTalismanInfo, isVisible]);

		if (!isVisible) {
			return <></>;
		}

		return (
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.5)}
			>
				<uiaspectratioconstraint AspectRatio={1.95} />
				<textlabel
					Text={viewedTalismanInfo.talismanInfo.name}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.15)}
					Size={UDim2.fromScale(0.4, 0.1)}
					TextScaled={true}
					Font={font}
					TextColor3={color3White}
					BackgroundTransparency={1}
				>
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 3, Color: Color3.fromRGB(11, 52, 68) }} />
				</textlabel>
				<textlabel
					Text={twoDpAbbreviator.numberToString(viewedTalismanInfo.talismanInfo.data.cost.amount)}
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
					TextXAlignment={Enum.TextXAlignment.Left}
					Size={UDim2.fromScale(0.12, 0.1)}
					Position={UDim2.fromScale(0.53, 0.78)}
					TextColor3={color3White}
				>
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(11, 52, 68) }} />
					<imagelabel
						Image={"rbxassetid://10498937588"}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(-0.23, 0.5)}
						Size={UDim2.fromScale(0.4, 1)}
					/>
				</textlabel>
				<textlabel
					Text={`+ ${viewedTalismanInfo.talismanInfo.data.stats.amount}`}
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
					TextXAlignment={Enum.TextXAlignment.Left}
					Size={UDim2.fromScale(0.12, 0.1)}
					Position={UDim2.fromScale(0.74, 0.76)}
					TextColor3={color3White}
				>
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(11, 52, 68) }} />
					<imagelabel
						Image={assetIds.images.statIcons[viewedTalismanInfo.talismanInfo.data.stats.name]}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(-0.21, 0.5)}
						Size={UDim2.fromScale(0.4, 1)}
					/>
				</textlabel>
				<textlabel
					Text={`Tier ${viewedTalismanInfo.talismanInfo.data.tier}`}
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
					TextXAlignment={Enum.TextXAlignment.Left}
					Size={UDim2.fromScale(0.12, 0.1)}
					Position={UDim2.fromScale(0.3, 0.76)}
					TextColor3={color3White}
				>
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 2, Color: Color3.fromRGB(11, 52, 68) }} />
					<imagelabel
						Image={"rbxassetid://10189531403"}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(-0.23, 0.5)}
						Size={UDim2.fromScale(0.4, 1)}
					/>
				</textlabel>
				<textbutton
					AnchorPoint={vec2Middle}
					TextTransparency={1}
					BackgroundColor3={Color3.fromRGB(167, 240, 170)}
					Position={UDim2.fromScale(0.5, 0.9)}
					Size={actionButtonBinding.map((value) => {
						return UDim2.fromScale(value.x, value.y);
					})}
					AutoButtonColor={false}
					Event={{
						Activated: (): void => {
							if (props.currentTalismanId === viewedTalismanInfo.id) {
								return;
							}

							if (props.talismansState.has(viewedTalismanInfo.id)) {
								remotes.equipTalisman.SendToServer(viewedTalismanInfo.id);
							} else {
								purchaseTalisman(props.store, viewedTalismanInfo.id, remotes.purchaseTalisman);
							}
						},
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
					<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 3, Color: Color3.fromRGB(112, 158, 113) }} />
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<textlabel
						Text={
							viewedTalismanInfo.id === props.currentTalismanId
								? "Equipped"
								: props.talismansState.has(viewedTalismanInfo.id)
								? "Equip"
								: "Purchase"
						}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.7)}
						TextColor3={color3White}
						BackgroundTransparency={1}
						TextScaled={true}
						Font={font}
					>
						<BSX_UIStroke defaultBlackColor={false} native={{ Thickness: 3, Color: Color3.fromRGB(112, 158, 113) }} />
					</textlabel>
				</textbutton>
				<ExitButton
					minimizedSize={0.1}
					maximizedSize={0.12}
					onClosed={(): void => setVisibility(false)}
					Position={UDim2.fromScale(0.9, 0.1)}
				/>
				<imagebutton
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.9, 0.4)}
					Size={arrowButtonUpBinding.map((value) => {
						return UDim2.fromScale(value.x, value.y);
					})}
					Image={"rbxassetid://10521456604"}
					ScaleType={Enum.ScaleType.Fit}
					BackgroundTransparency={1}
					Visible={
						Workspace.interactions["talisman tower"].FindFirstChild(viewedTalismanInfo.talismanInfo.data.id + 1) !==
						undefined
					}
					Event={{
						Activated: (): void => {
							const talismanFolder = Workspace.interactions["talisman tower"].FindFirstChild(
								viewedTalismanInfo.talismanInfo.data.id,
							);

							if (talismanFolder === undefined) {
								return;
							}

							setViewedTalismanInfo(getTalismanLocalInfo(props.talismansState, viewedTalismanInfo.id + 1));
						},
						MouseEnter: (): void => {
							arrowButtonUpMotor.setGoal({
								x: new Flipper.Spring(arrowButtonMinimizedSize.x, springProps),
								y: new Flipper.Spring(arrowButtonMinimizedSize.y, springProps),
							});
						},
						MouseLeave: (): void => {
							arrowButtonUpMotor.setGoal({
								x: new Flipper.Spring(arrowButtonMaximizdSize.x, springProps),
								y: new Flipper.Spring(arrowButtonMaximizdSize.y, springProps),
							});
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.9, 0.55)}
					Size={arrowButtonDownBinding.map((value) => {
						return UDim2.fromScale(value.x, value.y);
					})}
					Visible={viewedTalismanInfo.id - 1 > 0}
					Image={"rbxassetid://10521457453"}
					ScaleType={Enum.ScaleType.Fit}
					BackgroundTransparency={1}
					Event={{
						Activated: (): void => {
							if (viewedTalismanInfo.id - 1 <= 0) {
								return;
							}
							setViewedTalismanInfo(getTalismanLocalInfo(props.talismansState, viewedTalismanInfo.id - 1));
						},
						MouseEnter: (): void => {
							arrowButtonDownMotor.setGoal({
								x: new Flipper.Spring(arrowButtonMinimizedSize.x, springProps),
								y: new Flipper.Spring(arrowButtonMinimizedSize.y, springProps),
							});
						},
						MouseLeave: (): void => {
							arrowButtonDownMotor.setGoal({
								x: new Flipper.Spring(arrowButtonMaximizdSize.x, springProps),
								y: new Flipper.Spring(arrowButtonMaximizdSize.y, springProps),
							});
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
			</frame>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */
