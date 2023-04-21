import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";

import { Accolades } from "./accolades";
import { Admin } from "./admin";
import { EditAccount } from "./admin/editAccount";
import { Codes } from "./codes";
import { Mastery } from "./mastery";
import { AccountPlayerSelection } from "./playerSelection/accountPlayerSelection";
import { ReturnToAccountView } from "./playerSelection/returnToAccountView";
import { SelectPlayer } from "./playerSelection/selectPlayer";
import { PlayerOptions } from "./settings";
import { PlayerStats } from "./stats";
import { TradeHistory } from "./trades";
import { AccountIconTemplate } from "./util/accountIconTemplate";
import { RightComponentHeader } from "./util/rightComponentHeader";

interface AccountHubProps extends AccountHubMappedProps {
	enabled: boolean;
	hideMenu: () => void;
}

interface AccountHubMappedProps {
	groupRank: number | undefined;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): AccountHubMappedProps {
	return {
		groupRank: state.index.groupRank,
	};
}

/**
 * An interface hub for the player's account.
 */
export const AccountHub = RoactRodux.connect(mapStateToProps)(
	hooks((props: AccountHubProps, hooks) => {
		if (!props.enabled) {
			return <></>;
		}

		const { useValue, useEffect, useState } = hooks;

		const [playerViewing, setViewedPlayer] = useState<Player>(Players.LocalPlayer);
		const [playerSelectionVisible, setPlayerSelectionVisibility] = useState(false);
		const [rightComponentDisplayed, setRightComponentDisplayed] = useState<
			"Stats" | "Accolades" | "TradeHistory" | "Options" | "Codes" | "Mastery" | "Admin" | undefined
		>(undefined);

		const viewportFrameRef = useValue(Roact.createRef<ViewportFrame>());
		const cameraRef = useValue(Roact.createRef<Camera>());
		useEffect(() => {
			if (playerSelectionVisible) {
				return;
			}

			if (
				rightComponentDisplayed === "Accolades" ||
				rightComponentDisplayed === "Mastery" ||
				rightComponentDisplayed === "Admin"
			) {
				return;
			}

			let mouseInDisplay = false;
			let holdingDisplay = false;
			let currentX: number | undefined;

			const viewportFrame = viewportFrameRef.value.getValue();
			assert(viewportFrame, `Failed to get viewport frame for account.`);

			const camera = cameraRef.value.getValue();
			assert(camera, `Failed to get camera for account.`);

			const character = playerViewing.Character;
			if (character === undefined) {
				warn("Failed to get player character for account viewport.");
				return;
			}

			viewportFrame.CurrentCamera = camera;

			character.Archivable = true;
			const viewportChar = character.Clone();

			const worldModel = viewportFrame.FindFirstChildOfClass("WorldModel") ?? new Instance("WorldModel");
			worldModel.Parent = viewportFrame;
			worldModel.ClearAllChildren();

			const humanoid = viewportChar.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				warn("Failed to get humanoid of cloned viewport character for account.");
				return;
			}

			viewportChar.Parent = worldModel;
			humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
			viewportChar.PivotTo(new CFrame(new Vector3(0, 0, -5.5), new Vector3(0, 0, 0)));

			const connections: Array<RBXScriptConnection> = [];

			const mouseInConnection = viewportFrame.MouseEnter.Connect(() => {
				mouseInDisplay = true;
			});
			connections.push(mouseInConnection);

			const mouseOutConnection = viewportFrame.MouseLeave.Connect(() => {
				mouseInDisplay = false;
			});
			connections.push(mouseOutConnection);

			const holdEnabled = UserInputService.InputBegan.Connect((input) => {
				if (
					input.UserInputType !== Enum.UserInputType.MouseButton1 &&
					input.UserInputType !== Enum.UserInputType.Touch
				) {
					return;
				}

				if (mouseInDisplay === false) {
					return;
				}

				holdingDisplay = true;
				currentX = undefined;
			});
			connections.push(holdEnabled);

			const holdReleased = UserInputService.InputEnded.Connect((input) => {
				if (
					input.UserInputType !== Enum.UserInputType.MouseButton1 &&
					input.UserInputType !== Enum.UserInputType.Touch
				) {
					return;
				}

				holdingDisplay = false;
			});
			connections.push(holdReleased);

			const mouseMoved = viewportFrame.MouseMoved.Connect((x) => {
				if (holdingDisplay === false) {
					return;
				}

				if (currentX === undefined) {
					currentX = x;
					return;
				}

				const characterPrimary = viewportChar.PrimaryPart;
				if (characterPrimary === undefined) {
					return;
				}

				viewportChar.PivotTo(characterPrimary.CFrame.mul(CFrame.fromEulerAnglesXYZ(0, (x - currentX) * 0.025, 0)));
				currentX = x;
			});
			connections.push(mouseMoved);

			return (): void => connections.forEach((conn) => conn.Disconnect());
		}, [viewportFrameRef.value, cameraRef.value, playerViewing, playerSelectionVisible, rightComponentDisplayed]);

		useEffect(() => {
			const connection = Players.PlayerRemoving.Connect((oPlayer) => {
				if (oPlayer.UserId !== playerViewing.UserId) {
					return;
				}

				setViewedPlayer(Players.LocalPlayer);
			});

			return (): void => connection.Disconnect();
		});

		const playerStore = retrieveStore(playerViewing);

		const leftDisplayedComponents: Array<Roact.Element> = [];
		if (playerSelectionVisible) {
			if (rightComponentDisplayed !== "Accolades" && rightComponentDisplayed !== "Mastery") {
				leftDisplayedComponents.push(
					<AccountPlayerSelection
						setPlayerViewed={(player): void => setViewedPlayer(player)}
						returnToSelection={(): void => setPlayerSelectionVisibility(false)}
					/>,
					<ReturnToAccountView returnToSelection={(): void => setPlayerSelectionVisibility(false)} />,
				);
			}
		} else {
			if (
				rightComponentDisplayed !== "Accolades" &&
				rightComponentDisplayed !== "Mastery" &&
				rightComponentDisplayed !== "Admin"
			) {
				leftDisplayedComponents.push(
					<BaseFrame
						BackgroundTransparency={0}
						BackgroundColor3={Color3.fromRGB(19, 81, 128)}
						Position={UDim2.fromScale(0.23, 0.565)}
						Size={UDim2.fromScale(0.425, 0.775)}
					>
						<uicorner CornerRadius={new UDim(0.075, 0)} />
						<viewportframe
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
							Ref={viewportFrameRef.value}
						>
							<camera CFrame={new CFrame(0, 0, 0)} Ref={cameraRef.value} />
						</viewportframe>
					</BaseFrame>,

					<EditAccount showAdmin={(): void => setRightComponentDisplayed("Admin")} />,
					<SelectPlayer setPlayerSelectionVisibility={(): void => setPlayerSelectionVisibility(true)} />,
				);
			}
		}

		const rightDisplayedComponents: Array<Roact.Element> = [];
		if (rightComponentDisplayed === "Stats") {
			rightDisplayedComponents.push(
				<PlayerStats
					viewedPlayer={playerViewing}
					returnToSelection={(): void => setRightComponentDisplayed(undefined)}
				/>,
			);
		} else if (rightComponentDisplayed === "Options") {
			rightDisplayedComponents.push(
				<PlayerOptions returnToSelection={(): void => setRightComponentDisplayed(undefined)} />,
			);
		} else if (rightComponentDisplayed === "Codes") {
			rightDisplayedComponents.push(<Codes returnToSelection={(): void => setRightComponentDisplayed(undefined)} />);
		} else if (rightComponentDisplayed === "Accolades") {
			rightDisplayedComponents.push(
				<Accolades
					returnToSelection={(): void => setRightComponentDisplayed(undefined)}
					playerViewing={playerViewing}
				/>,
			);
		} else if (rightComponentDisplayed === "Mastery") {
			rightDisplayedComponents.push(
				<Mastery returnToSelection={(): void => setRightComponentDisplayed(undefined)} playerViewing={playerViewing} />,
			);
		} else if (rightComponentDisplayed === "TradeHistory") {
			rightDisplayedComponents.push(
				<TradeHistory
					returnToSelection={(): void => setRightComponentDisplayed(undefined)}
					playerViewing={playerViewing}
				/>,
			);
		} else if (rightComponentDisplayed === "Admin") {
			rightDisplayedComponents.push(
				<Admin returnToSelection={(): void => setRightComponentDisplayed(undefined)} playerViewing={playerViewing} />,
			);
		} else if (rightComponentDisplayed === undefined) {
			if (playerStore === undefined && !RunService.IsStudio()) {
				rightDisplayedComponents.push(
					<RightComponentHeader
						storeFound={false}
						headerText={`Error: No data found for ${playerViewing.Name}.`}
						displayReturn={false}
						returnToSelection={(): void => {}}
					/>,
				);
			} else {
				const iconsToDisplay: Array<Roact.Element> = [
					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.statsBackground}
						text={"Stats"}
						layoutOrder={1}
						onPressed={(): void => setRightComponentDisplayed("Stats")}
					/>,
					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.Accolades}
						text={"Accolades"}
						layoutOrder={4}
						onPressed={(): void => setRightComponentDisplayed("Accolades")}
					/>,
					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.accountMastery}
						text={"Mastery"}
						layoutOrder={5}
						onPressed={(): void => setRightComponentDisplayed("Mastery")}
					/>,
					<AccountIconTemplate
						accessibleFeature={
							((props.groupRank !== undefined && props.groupRank >= 250 && !RunService.IsStudio()) ||
								playerViewing.UserId === Players.LocalPlayer.UserId ||
								(playerStore !== undefined && playerStore.getState().settings.privacy.publicTradeHistory)) ??
							false
						}
						image={assetIds.images.ui.account.tradeHistory}
						text={"Trade History"}
						layoutOrder={6}
						onPressed={(): void => setRightComponentDisplayed("TradeHistory")}
					/>,
				];

				if (playerViewing.UserId === Players.LocalPlayer.UserId) {
					iconsToDisplay.push(
						<AccountIconTemplate
							accessibleFeature={true}
							image={assetIds.images.ui.hud.icons.options}
							text={"Options"}
							layoutOrder={2}
							onPressed={(): void => setRightComponentDisplayed("Options")}
						/>,
						<AccountIconTemplate
							accessibleFeature={true}
							image={assetIds.images.ui.hud.icons.codes}
							text={"Codes"}
							layoutOrder={3}
							onPressed={(): void => setRightComponentDisplayed("Codes")}
						/>,
					);
				}

				rightDisplayedComponents.push(
					<BaseFrame Position={UDim2.fromScale(0.725, 0.565)} Size={UDim2.fromScale(0.5, 0.765)}>
						<uigridlayout
							CellPadding={UDim2.fromScale(0.09, 0.09)}
							CellSize={UDim2.fromScale(0.265, 0.265)}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>

						{iconsToDisplay}
					</BaseFrame>,
				);
			}
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.575, 0.5),
					Image: assetIds.images.ui.account.background,
				}}
			>
				<uiaspectratioconstraint AspectRatio={1.5} />
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.4, 0.135),
						Position: UDim2.fromScale(0.5, 0.08),
						Text: "Account",
					}}
					stroke={{
						native: { Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) },
					}}
				/>

				{leftDisplayedComponents}
				{rightDisplayedComponents}

				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
		);
	}),
);
