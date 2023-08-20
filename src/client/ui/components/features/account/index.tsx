import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, UserInputService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { StoreState } from "shared/rodux";
import { CurrentWeaponState } from "shared/rodux/currentWeapon";

import { Admin } from "./admin";
import { EditAccount } from "./admin/editAccount";
import { AccountPlayerSelection } from "./playerSelection/accountPlayerSelection";
import { ReturnToAccountView } from "./playerSelection/returnToAccountView";
import { SelectPlayer } from "./playerSelection/selectPlayer";
import { PlayerStats } from "./stats";
import { TradeHistory } from "./trades";
import { RightComponentHeader } from "./util/rightComponentHeader";

interface AccountHubProps extends AccountHubMappedProps {
	hideMenu: () => void;
}

interface AccountHubMappedProps {
	groupRank: number | undefined;
	currentWeapon: CurrentWeaponState;
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
		currentWeapon: state.currentWeapon,
	};
}

enum RightComponent {
	Admin = "Admin",
	Stats = "Stats",
	TradeHistory = "TradeHistory",
}

/**
 * An interface hub for the player's account.
 */
export const AccountHub = RoactRodux.connect(mapStateToProps)(
	hooks((props: AccountHubProps, hooks) => {
		const { useValue, useEffect, useState } = hooks;

		// the player being viewed
		const [playerViewing, setViewedPlayer] = useState<Player>(Players.LocalPlayer);

		// whether or not the player selection dropdown is being viewed
		const [playerSelectionVisible, setPlayerSelectionVisibility] = useState(false);

		// logs what component is being displayed on the right side of the screen
		const [rightComponentDisplayed, setRightComponentDisplayed] = useState<RightComponent | undefined>(undefined);

		// this is where we'll get the player store
		const playerStore = retrieveStore(playerViewing);

		// when the player selection and certain components aren't being displayed, we will display a viewport of the player
		const viewportFrameRef = useValue(Roact.createRef<ViewportFrame>());
		const cameraRef = useValue(Roact.createRef<Camera>());
		useEffect(() => {
			// make sure they aren't viewing the player selection drop down
			if (playerSelectionVisible) {
				return;
			}

			// there are certain components that take up the whole screen. we don't want to display the viewport when those are being displayed
			const priorityComponents = [RightComponent.Admin, RightComponent.TradeHistory];
			const hasHigherPriorityComponent = Object.entries(priorityComponents).some(
				([, enumerator]) => enumerator === rightComponentDisplayed,
			);

			if (hasHigherPriorityComponent) {
				return;
			}

			// make sure the roact refs exist
			const viewportFrame = viewportFrameRef.value.getValue();
			assert(viewportFrame, `Failed to get viewport frame for account.`);

			const camera = cameraRef.value.getValue();
			assert(camera, `Failed to get camera for account.`);

			// assign upvalues and get the character of the player being viewed
			let mouseInDisplay = false;
			let holdingDisplay = false;
			let currentX: number | undefined;

			const character = playerViewing.Character;
			if (character === undefined) {
				return;
			}

			viewportFrame.CurrentCamera = camera;

			// gotta be sure character is archivable so we can clone it
			character.Archivable = true;
			const viewportChar = character.Clone();
			const humanoid = viewportChar.FindFirstChildOfClass("Humanoid");
			if (humanoid === undefined) {
				return;
			}

			// use a world model so we get animations
			const worldModel = viewportFrame.FindFirstChildOfClass("WorldModel") ?? new Instance("WorldModel");
			worldModel.Parent = viewportFrame;
			worldModel.ClearAllChildren();

			humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
			viewportChar.PivotTo(new CFrame(new Vector3(0, 0, -5.5), new Vector3(0, 0, 0)));
			viewportChar.Parent = worldModel;

			const mouseInConnection = viewportFrame.MouseEnter.Connect(() => (mouseInDisplay = true));
			const mouseOutConnection = viewportFrame.MouseLeave.Connect(() => (mouseInDisplay = false));

			// for when they hold their mouse button down or press their finger down, and move it around, we want to move the character model around (radians)
			const holdingEnabledConnection = UserInputService.InputBegan.Connect((input) => {
				const acceptableInputTypes = [Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch];
				if (!acceptableInputTypes.some((inputType) => inputType === input.UserInputType)) {
					return;
				}

				if (mouseInDisplay === false) {
					return;
				}

				holdingDisplay = true;
				currentX = undefined;
			});

			const holdingDisabledConnection = UserInputService.InputEnded.Connect((input) => {
				const acceptableInputTypes = [Enum.UserInputType.MouseButton1, Enum.UserInputType.Touch];
				if (!acceptableInputTypes.some((inputType) => inputType === input.UserInputType)) {
					return;
				}

				holdingDisplay = false;
			});

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

			// for cleanup, we want to disconnect all of these connections
			return (): void =>
				[
					mouseInConnection,
					mouseOutConnection,
					holdingEnabledConnection,
					holdingDisabledConnection,
					mouseMoved,
				].forEach((connection) => connection.Disconnect());
		}, [
			props.currentWeapon.equipped,
			props.currentWeapon.id,
			viewportFrameRef.value,
			cameraRef.value,
			playerViewing,
			playerSelectionVisible,
			rightComponentDisplayed,
		]);

		// in chase the player who is being viewed leaves the game, we want to return to the local player to avoid unintentional behavior
		useEffect(() => {
			const connection = Players.PlayerRemoving.Connect((oPlayer) => {
				if (oPlayer.UserId !== playerViewing.UserId) {
					return;
				}

				setViewedPlayer(Players.LocalPlayer);
			});

			return (): void => connection.Disconnect();
		});

		// be sure that the component the player is viewing isn't taking up the whole screen (known as an override component)
		const overrideComponents = [RightComponent.Admin, RightComponent.TradeHistory];
		const overideComponentVisible = Object.entries(overrideComponents).some(
			([, enumerator]) => enumerator === rightComponentDisplayed,
		);

		// determine if the left component is to be displayed, and if so, what to display
		let leftComponent: Roact.Element | undefined;
		if (playerSelectionVisible && !overideComponentVisible) {
			leftComponent = (
				<>
					<AccountPlayerSelection
						setPlayerViewed={(player): void => setViewedPlayer(player)}
						returnToSelection={(): void => setPlayerSelectionVisibility(false)}
					/>
					<ReturnToAccountView returnToSelection={(): void => setPlayerSelectionVisibility(false)} />
				</>
			);
		} else if (!overideComponentVisible) {
			leftComponent = (
				<>
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
					</BaseFrame>
					<EditAccount showAdmin={(): void => setRightComponentDisplayed(RightComponent.Admin)} />
					<SelectPlayer setPlayerSelectionVisibility={(): void => setPlayerSelectionVisibility(true)} />
				</>
			);
		}

		// determine right side of component (or full screen, given that some components take the full screen)
		const componentMap = {
			Admin: (
				<Admin returnToSelection={(): void => setRightComponentDisplayed(undefined)} playerViewing={playerViewing} />
			),
			Stats: (
				<PlayerStats
					viewedPlayer={playerViewing}
					returnToSelection={(): void => setRightComponentDisplayed(undefined)}
				/>
			),
			TradeHistory: (
				<TradeHistory
					returnToSelection={(): void => setRightComponentDisplayed(undefined)}
					playerViewing={playerViewing}
				/>
			),
		};

		let rightComponent: Roact.Element | undefined;
		if (rightComponentDisplayed !== undefined && componentMap[rightComponentDisplayed] !== undefined) {
			rightComponent = componentMap[rightComponentDisplayed];
		} else {
			if (playerStore === undefined) {
				rightComponent = (
					<RightComponentHeader
						storeFound={false}
						headerText={`Error: No data found for ${playerViewing.Name}.`}
						displayReturn={false}
						returnToSelection={(): void => {
							warn("No data found for player, but return to selection callback is not implemented.");
						}}
					/>
				);
			} else {
				{
					/*const adminAccessToTradeLogs =
					playerViewing.UserId === Players.LocalPlayer.UserId ||
					(props.groupRank !== undefined && props.groupRank >= ADMIN_RANK);
				const publicAccessToTradeLogs = playerStore.getState().settings.privacy.publicTradeHistory;

				const featureIcons: Array<Roact.Element> = [
					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.statsBackground}
						displayBackground={true}
						text={"Stats"}
						layoutOrder={1}
						onPressed={(): void => setRightComponentDisplayed(RightComponent.Stats)}
					/>,
					<AccountIconTemplate
						accessibleFeature={adminAccessToTradeLogs || publicAccessToTradeLogs}
						image={assetIds.images.ui.account.tradeHistory}
						displayBackground={true}
						text={"Trade History"}
						layoutOrder={4}
						onPressed={(): void => setRightComponentDisplayed(RightComponent.TradeHistory)}
					/>,
				]; rightComponent = (
					<BaseFrame Position={UDim2.fromScale(0.725, 0.565)} Size={UDim2.fromScale(0.5, 0.765)}>
						<uigridlayout
							CellPadding={UDim2.fromScale(0.09, 0.09)}
							CellSize={UDim2.fromScale(0.265, 0.265)}
							SortOrder={Enum.SortOrder.LayoutOrder}
						/>

						{featureIcons}
					</BaseFrame>*/
				}

				rightComponent = (
					<PlayerStats
						viewedPlayer={playerViewing}
						returnToSelection={(): void => setRightComponentDisplayed(undefined)}
					/>
				);
			}
		}

		return (
			<ImageLabel
				native={{
					Size: UDim2.fromScale(0.65, 0.65),
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

				{leftComponent}
				{rightComponent}

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
