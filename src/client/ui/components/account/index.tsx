import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { ExitButton } from "client/ui/elements/exitButton";
import { RankIcon } from "client/ui/elements/rankIcon";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { formatTime } from "client/util/formatTime";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { GROUP_ROLES } from "shared/configs/game";
import { StoreState } from "shared/rodux";
import { ValidRank } from "shared/rodux/rank";
import { SettingsState } from "shared/rodux/settings";
import { getTalismanData } from "shared/util/getTalismanData";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

interface AccountHubProps {
	enabled: boolean;
	hideMenu: () => void;
}

/* eslint-disable jsdoc/require-jsdoc */
export const AccountIconTemplate = hooks(
	(
		props: { image: string; text: string; layoutOrder: number; accessibleFeature: boolean; onPressed: () => void },
		hooks,
	) => {
		const { useEffect } = hooks;

		const minimizedSize = 0.9;
		const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = new Flipper.SingleMotor(maximizedSize);
		const [binding, setBinding] = Roact.createBinding(motor.getValue());

		motor.onStep(setBinding);

		useEffect(() => {
			return (): void => {
				motor.destroy();
			};
		}, []);

		return (
			<frame BackgroundTransparency={1} LayoutOrder={props.layoutOrder}>
				<imagebutton
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					Image={props.image}
					LayoutOrder={2}
					ImageColor3={props.accessibleFeature ? Color3.fromRGB(255, 255, 255) : Color3.fromRGB(59, 62, 60)}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MinorEngagement);

							if (props.accessibleFeature) {
								props.onPressed();
							}
						},
						MouseEnter: (): void => motor.setGoal(minizmizedSpring),
						MouseLeave: (): void => motor.setGoal(maximizedSpring),
					}}
				>
					<textlabel
						BackgroundTransparency={1}
						AnchorPoint={vec2Middle}
						Size={UDim2.fromScale(0.9, 0.35)}
						Position={UDim2.fromScale(0.5, 1)}
						Text={props.text}
						Font={font}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(0, 108, 176) }} />
					</textlabel>
					<uiaspectratioconstraint AspectRatio={1} />
				</imagebutton>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

interface EditAccountProps {
	groupRank: number | undefined;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function editAccountMapProps(state: StoreState): EditAccountProps {
	return {
		groupRank: state.index.groupRank,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const EditAccount = RoactRodux.connect(editAccountMapProps)(
	hooks((props: EditAccountProps, { useEffect }) => {
		if (props.groupRank === undefined || props.groupRank < 250) {
			return <></>;
		}

		const minimizedSize = 0.085;
		const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.1;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = new Flipper.SingleMotor(maximizedSize);
		const [binding, setBinding] = Roact.createBinding(motor.getValue());

		motor.onStep(setBinding);

		useEffect(() => {
			return (): void => {
				motor.destroy();
			};
		}, []);

		return (
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.225, 0.95)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.2, value);
				})}
				Image={assetIds.images.ui.inventory.pets["function button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: (): void => {
						playSFX(UIEngagement.MinorEngagement);
					},
					MouseEnter: (): void => motor.setGoal(minizmizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					BackgroundTransparency={1}
					AnchorPoint={vec2Middle}
					Size={UDim2.fromScale(0.9, 0.9)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Text={"Edit"}
					Font={font}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(176, 94, 0) }} />
				</textlabel>
			</imagebutton>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const SelectPlayer = hooks((props: { setPlayerSelectionVisibility: () => void }, { useEffect }) => {
	const minimizedSize = 0.07;
	const minizmizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.09;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const motor = new Flipper.SingleMotor(maximizedSize);
	const [binding, setBinding] = Roact.createBinding(motor.getValue());

	motor.onStep(setBinding);

	useEffect(() => {
		return (): void => {
			motor.destroy();
		};
	}, []);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.225, 0.2)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.24, value);
			})}
			Image={assetIds.images.ui.equip.toolTp}
			ScaleType={Enum.ScaleType.Fit}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.setPlayerSelectionVisibility();
				},
				MouseEnter: (): void => motor.setGoal(minizmizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={3.5} />
			<textlabel
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Text={"Select Player"}
				Font={font}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
			>
				<BaseUIStroke native={{ Thickness: 1, Color: Color3.fromRGB(0, 84, 176) }} />
			</textlabel>
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const AccountPlayerSelection = hooks(
	(props: { setPlayerViewed: (player: Player) => void; returnToSelection: () => void }, hooks) => {
		const { useState, useEffect } = hooks;

		const [playersInGame, setPlayersInGame] = useState<Array<Player>>(Players.GetPlayers());

		useEffect(() => {
			const addedConnection = Players.PlayerAdded.Connect(() => {
				setPlayersInGame(Players.GetPlayers());
			});

			const removedConnection = Players.PlayerRemoving.Connect(() => {
				setPlayersInGame(Players.GetPlayers());
			});

			return (): void => {
				addedConnection.Disconnect();
				removedConnection.Disconnect();
			};
		});

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromRGB(19, 81, 128)}
				Position={UDim2.fromScale(0.23, 0.565)}
				Size={UDim2.fromScale(0.425, 0.775)}
			>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout Padding={new UDim(0.02, 0)} HorizontalAlignment={Enum.HorizontalAlignment.Center} />

					{playersInGame.map((oPlayer) => {
						const minimizedSize = 0.8;
						const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

						const maximizedSize = 0.9;
						const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

						const { motor, binding } = useBindingMotor(hooks, maximizedSize);

						return (
							<frame
								AnchorPoint={vec2Middle}
								BackgroundColor3={Color3.fromRGB(45, 167, 230)}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(1, 0.125)}
							>
								<uiaspectratioconstraint AspectRatio={7} />
								<uicorner CornerRadius={new UDim(0.2, 0)} />
								<BaseUIStroke native={{ Color: Color3.fromRGB(12, 52, 79), Thickness: 1.5 }} />

								<frame
									AnchorPoint={vec2Middle}
									BackgroundColor3={Color3.fromRGB(12, 52, 79)}
									Position={UDim2.fromScale(0.075, 0.5)}
									Size={UDim2.fromScale(0.9, 0.9)}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />

									<imagelabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.5, 0.5)}
										Size={UDim2.fromScale(1, 1)}
										ScaleType={Enum.ScaleType.Fit}
									>
										<uicorner CornerRadius={new UDim(1, 0)} />
									</imagelabel>
								</frame>

								<imagebutton
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.825, 0.5)}
									Size={binding.map((value) => {
										return UDim2.fromScale(0.3, value);
									})}
									Image={assetIds.images.ui.index.Claim}
									ScaleType={Enum.ScaleType.Fit}
									Event={{
										Activated: (): void => {
											playSFX(UIEngagement.MinorEngagement);
											props.setPlayerViewed(oPlayer);
											props.returnToSelection();
										},
										MouseEnter: (): void => motor.setGoal(minimizedSpring),
										MouseLeave: (): void => motor.setGoal(maximizedSpring),
									}}
								>
									<uiaspectratioconstraint AspectRatio={2} />
									<textlabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Position={UDim2.fromScale(0.5, 0.5)}
										Size={UDim2.fromScale(0.8, 0.8)}
										Font={font}
										Text={"View"}
										TextColor3={Color3.fromRGB(255, 255, 255)}
										TextScaled={true}
									>
										<BaseUIStroke native={{ Color: Color3.fromRGB(28, 162, 62), Thickness: 1.5 }} />
									</textlabel>
								</imagebutton>

								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.4, 0.5)}
									Size={UDim2.fromScale(0.45, 0.9)}
									Font={font}
									Text={oPlayer.Name}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									TextXAlignment={Enum.TextXAlignment.Left}
								>
									<BaseUIStroke native={{ Color: Color3.fromRGB(12, 52, 79), Thickness: 1.5 }} />
								</textlabel>
							</frame>
						);
					})}
				</RescalingScrollingFrame>
				<uicorner CornerRadius={new UDim(0.075, 0)} />
			</frame>
		);
	},
);

/* eslint-disable jsdoc/require-jsdoc */
export const ReturnToAccountView = hooks((props: { returnToSelection: () => void }, hooks) => {
	const minimizedSize = 0.07;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.08;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	return (
		<imagebutton
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.035, 0.2)}
			Size={binding.map((value) => {
				return UDim2.fromScale(0.1, value);
			})}
			Image={assetIds.images.ui.index.returnToSelection}
			Event={{
				Activated: (): void => {
					playSFX(UIEngagement.MinorEngagement);
					props.returnToSelection();
				},
				MouseEnter: (): void => motor.setGoal(minimizedSpring),
				MouseLeave: (): void => motor.setGoal(maximizedSpring),
			}}
		>
			<uiaspectratioconstraint AspectRatio={1} />
		</imagebutton>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const RightComponentHeader = hooks(
	(
		props: { storeFound: boolean; headerText: string; displayReturn: boolean; returnToSelection: () => void },
		hooks,
	) => {
		if (!props.displayReturn && props.storeFound) {
			return (
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.4, 0.1)}
					Position={UDim2.fromScale(0.75, 0.215)}
					Text={props.headerText}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
			);
		} else if (props.storeFound) {
			const minimizedSize = 0.07;
			const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

			const maximizedSize = 0.08;
			const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

			const { motor, binding } = useBindingMotor(hooks, maximizedSize);
			return (
				<>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.215)}
						Size={binding.map((value) => {
							return UDim2.fromScale(0.1, value);
						})}
						Image={assetIds.images.ui.index.returnToSelection}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.returnToSelection();
							},
							MouseEnter: (): void => motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.4, 0.1)}
						Position={UDim2.fromScale(0.75, 0.215)}
						Text={props.headerText}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</>
			);
		} else {
			const minimizedSize = 0.1;
			const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

			const maximizedSize = 0.125;
			const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

			const { motor, binding } = useBindingMotor(hooks, maximizedSize);
			return (
				<>
					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.725, 0.625)}
						Size={binding.map((value) => {
							return UDim2.fromScale(value, 0.6);
						})}
						Image={assetIds.images.ui.index.Claim}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.returnToSelection();
							},
							MouseEnter: (): void => motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Size={UDim2.fromScale(0.8, 0.8)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Text={"Return"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={font}
						>
							<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 87, 13) }} />
						</textlabel>
					</imagebutton>
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.535, 0.1)}
						Position={UDim2.fromScale(0.725, 0.5)}
						Text={props.headerText}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</>
			);
		}
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const StatCard = hooks((props: { header: string; stat: string | number }) => {
	const statElement: Array<Roact.Element> = [];
	if (ValidRank(props.stat)) {
		statElement.push(
			<RankIcon
				position={UDim2.fromScale(0.9, 0.5)}
				size={{ minimizedSize: 0.85, maximizedSize: 1 }}
				rank={props.stat}
			/>,
		);
	} else if (typeIs(props.stat, "string")) {
		statElement.push(
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.45, 0.95)}
				Position={UDim2.fromScale(0.765, 0.5)}
				Text={props.stat}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextXAlignment={Enum.TextXAlignment.Right}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
			</textlabel>,
		);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 0.175)}
		>
			<uiaspectratioconstraint AspectRatio={6.5} />
			<frame
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(0, 94, 153)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.95)}
			>
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.4, 0.95)}
					Position={UDim2.fromScale(0.215, 0.5)}
					Text={props.header}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextXAlignment={Enum.TextXAlignment.Left}
					Font={font}
				>
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
				{statElement}
			</frame>
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const PlayerStats = hooks((props: { viewedPlayer: Player; returnToSelection: () => void }, hooks) => {
	const { useValue, useEffect, useState } = hooks;

	const playerStore = retrieveStore(props.viewedPlayer);
	if (playerStore === undefined) {
		return (
			<RightComponentHeader
				storeFound={false}
				headerText={`Error: No data found for ${props.viewedPlayer.Name}.`}
				displayReturn={true}
				returnToSelection={props.returnToSelection}
			/>
		);
	}

	const storeState = playerStore.getState();
	const [hatches, setHatches] = useState(storeState.index.eggs);
	const [timePlayed, setTimePlayed] = useState(storeState.index.timePlayed);
	const [groupRank, setGroupRank] = useState(storeState.index.groupRank);
	const [rank, setRank] = useState(storeState.rank);
	const [title, setTitle] = useState(storeState.title);
	const [weapon, setWeapon] = useState(storeState.currentWeapon.id);
	const [talisman, setTalisman] = useState(storeState.currentTalisman);

	let totalRegularEggHatches = 0;
	let totalVoidEggHatches = 0;
	hatches.forEach((egg) => {
		totalRegularEggHatches += egg.regular;
		totalVoidEggHatches += egg.void;
	});

	const groupRankName = groupRank === undefined ? "No Rank" : GROUP_ROLES[groupRank].tag;
	const titleName = title ?? "No Title";
	const weaponName = getWeaponInfo(weapon).name;
	const talismanName = talisman === undefined ? "No Talisman" : getTalismanData(talisman).name;

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Failed to get Account Player Stats UIListLayout.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Account Player Stats ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Account Player Stats to have a ScrollingFrame.`);

		scrollingFrame.GetChildren().forEach((card) => {
			if (card.IsA("Frame")) {
				card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
			}
		});
	});

	useEffect(() => {
		const connection = playerStore.changed.connect((newState, oldState) => {
			if (newState.index.eggs !== oldState.index.eggs) {
				setHatches(newState.index.eggs);
			}

			if (newState.index.timePlayed !== oldState.index.timePlayed) {
				setTimePlayed(newState.index.timePlayed);
			}

			if (newState.index.groupRank !== oldState.index.groupRank) {
				setGroupRank(newState.index.groupRank);
			}

			if (newState.rank !== oldState.rank) {
				setRank(newState.rank);
			}

			if (newState.title !== oldState.title) {
				setTitle(newState.title);
			}

			if (newState.currentWeapon.id !== oldState.currentWeapon.id) {
				setWeapon(newState.currentWeapon.id);
			}

			if (newState.currentTalisman !== oldState.currentTalisman) {
				setTalisman(newState.currentTalisman);
			}
		});

		return (): void => connection.disconnect();
	});

	return (
		<>
			<RightComponentHeader
				storeFound={true}
				headerText={`${props.viewedPlayer.Name}'s Stats`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
			<RescalingScrollingFrame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.725, 0.615)}
				Size={UDim2.fromScale(0.5, 0.685)}
				ScrollBarThickness={0}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0.025, 0)}
					Ref={uiListLayoutRef.value}
				/>
				<StatCard header={"Reg. Eggs:"} stat={statsAbbreviator.numberToString(totalRegularEggHatches)} />
				<StatCard header={"Void Eggs:"} stat={statsAbbreviator.numberToString(totalVoidEggHatches)} />
				<StatCard header={"Time Played:"} stat={formatTime(timePlayed)} />
				<StatCard header={"Group Rank:"} stat={groupRankName} />
				<StatCard header={"Rank:"} stat={rank} />
				<StatCard header={"Title:"} stat={titleName} />
				<StatCard header={"Weapon:"} stat={weaponName} />
				<StatCard header={"Talisman:"} stat={talismanName} />
			</RescalingScrollingFrame>
		</>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

interface OptionsProps extends OptionsMappedProps {
	returnToSelection: () => void;
}

interface OptionsMappedProps {
	settings: SettingsState;
}

/**
 * Maps the Rodux store's state to the props.
 *
 * @param state The current state of the store.
 * @returns The mapped props to render with.
 */
function mapStateToProps(state: StoreState): OptionsMappedProps {
	return {
		settings: state.settings,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const OptionSectionHeader = hooks((props: { yPos: number; text: string }) => {
	return (
		<textlabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.9, 0.018)}
			Position={UDim2.fromScale(0.5, props.yPos)}
			Font={font}
			Text={props.text}
			TextScaled={true}
			TextColor3={Color3.fromRGB(255, 255, 255)}
		>
			<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
		</textlabel>
	);
});
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const OptionChoice = hooks(
	(props: { header: string; enabled: boolean; yPos: number; onPressed: () => void }, hooks) => {
		const minimizedSize = 0.8;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.9;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const motor = useBindingMotor(hooks, maximizedSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, props.yPos)}
				Size={UDim2.fromScale(1, 0.175)}
			>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.365, 0.5)}
						Size={UDim2.fromScale(0.7, 0.6)}
						Text={props.header}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.85, 0.5)}
						Size={motor.binding.map((value) => {
							return UDim2.fromScale(0.29, value);
						})}
						Image={props.enabled ? assetIds.images.ui.index.Claim : assetIds.images.ui.index.Off}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onPressed();
							},
							MouseEnter: (): void => motor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => motor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={2} />
						<textlabel
							AnchorPoint={vec2Middle}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.9, 0.9)}
							Text={props.enabled ? "On" : "Off"}
							TextScaled={true}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={font}
						>
							<BaseUIStroke
								native={{
									Thickness: 1.5,
									Color: props.enabled ? Color3.fromRGB(36, 159, 66) : Color3.fromRGB(106, 14, 46),
								}}
							/>
						</textlabel>
					</imagebutton>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const OptionMultiChoice = hooks(
	(props: { header: string; context: string; yPos: number; onDecrease: () => void; onIncrease: () => void }, hooks) => {
		const minimizedSize = 0.8;
		const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

		const maximizedSize = 0.9;
		const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

		const decreaseMotor = useBindingMotor(hooks, maximizedSize);
		const increaseMotor = useBindingMotor(hooks, maximizedSize);

		return (
			<frame
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, props.yPos)}
				Size={UDim2.fromScale(1, 0.175)}
			>
				<uiaspectratioconstraint AspectRatio={6.5} />
				<frame
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 94, 153)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.95)}
				>
					<uicorner CornerRadius={new UDim(0.2, 0)} />
					<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 64, 102) }} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.215, 0.5)}
						Size={UDim2.fromScale(0.4, 0.95)}
						Text={props.header}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextXAlignment={Enum.TextXAlignment.Left}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.58, 0.5)}
						Size={decreaseMotor.binding.map((value) => {
							return UDim2.fromScale(0.29, value);
						})}
						Image={assetIds.images.buttons["back arrow"]}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onDecrease();
							},
							MouseEnter: (): void => decreaseMotor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => decreaseMotor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.75, 0.5)}
						Size={UDim2.fromScale(0.2, 0.95)}
						Text={props.context}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>

					<imagebutton
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.915, 0.5)}
						Size={increaseMotor.binding.map((value) => {
							return UDim2.fromScale(0.29, value);
						})}
						Image={assetIds.images.buttons["forward arrow"]}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: (): void => {
								playSFX(UIEngagement.MinorEngagement);
								props.onIncrease();
							},
							MouseEnter: (): void => increaseMotor.motor.setGoal(minimizedSpring),
							MouseLeave: (): void => increaseMotor.motor.setGoal(maximizedSpring),
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</imagebutton>
				</frame>
			</frame>
		);
	},
);
/* eslint-enable jsdoc/require-jsdoc */

/* eslint-disable jsdoc/require-jsdoc */
export const PlayerOptions = RoactRodux.connect(mapStateToProps)(
	hooks((props: OptionsProps, { useContext }) => {
		const {
			toggleButtonClickSFX,
			toggleMusicVolume,
			toggleSoundEffectsVolume,
			toggleAuto,
			toggleWalkSpeed,
			togglePublicInventory,
			togglePublicTradeHistory,
			toggleGraphics,
			toggleTimeOfDay,
			togglePetAnimationType,
			togglePetsStudsOfDistance,
			togglePetsDisplayed,
			toggleAutoDelete,
		} = useContext(remoteContext);

		return (
			<>
				<RightComponentHeader
					storeFound={true}
					headerText={`Settings [${Players.LocalPlayer.Name}]`}
					returnToSelection={props.returnToSelection}
					displayReturn={true}
				/>
				<scrollingframe
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.725, 0.615)}
					Size={UDim2.fromScale(0.5, 0.685)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
					CanvasSize={UDim2.fromScale(0, 4)}
				>
					<OptionSectionHeader text={"Sound / SFX"} yPos={0.01} />
					<OptionChoice
						header={"Button SFX"}
						enabled={props.settings.sound.buttonClick}
						yPos={0.035}
						onPressed={(): void => toggleButtonClickSFX.SendToServer(!props.settings.sound.buttonClick)}
					/>
					<OptionMultiChoice
						header={"Music Volume"}
						context={`${props.settings.sound.music * 10}%`}
						yPos={0.068}
						onDecrease={(): void => {
							const decreasedVolume = props.settings.sound.music - 1;
							if (decreasedVolume <= 0) {
								return;
							}

							toggleMusicVolume.SendToServer(decreasedVolume);
						}}
						onIncrease={(): void => {
							const increasedVolume = props.settings.sound.music + 1;
							if (increasedVolume > 10) {
								return;
							}

							toggleMusicVolume.SendToServer(increasedVolume);
						}}
					/>
					<OptionMultiChoice
						header={"SFX Volume"}
						context={`${props.settings.sound.soundEffects * 10}%`}
						yPos={0.101}
						onDecrease={(): void => {
							const decreasedVolume = props.settings.sound.soundEffects - 1;
							if (decreasedVolume <= 0) {
								return;
							}

							toggleSoundEffectsVolume.SendToServer(decreasedVolume);
						}}
						onIncrease={(): void => {
							const increaseVolume = props.settings.sound.soundEffects + 1;
							if (increaseVolume > 10) {
								return;
							}

							toggleSoundEffectsVolume.SendToServer(increaseVolume);
						}}
					/>

					<OptionSectionHeader text={"Gameplay"} yPos={0.135} />
					<OptionChoice
						header={"Auto Hatch"}
						enabled={props.settings.gameplay.autoHatch}
						yPos={0.16}
						onPressed={(): void => toggleAuto.SendToServer()}
					/>
					<OptionMultiChoice
						header={"Walkspeed"}
						context={tostring(props.settings.gameplay.walkSpeed)}
						yPos={0.193}
						onDecrease={(): void => toggleWalkSpeed.SendToServer(props.settings.gameplay.walkSpeed - 1)}
						onIncrease={(): void => toggleWalkSpeed.SendToServer(props.settings.gameplay.walkSpeed + 1)}
					/>

					<OptionSectionHeader text={"Privacy"} yPos={0.227} />
					<OptionChoice
						header={"Public Inventory"}
						enabled={props.settings.privacy.publicInventory}
						yPos={0.252}
						onPressed={(): void => togglePublicInventory.SendToServer()}
					/>
					<OptionChoice
						header={"Public Trades"}
						enabled={props.settings.privacy.publicTradeHistory}
						yPos={0.285}
						onPressed={(): void => togglePublicTradeHistory.SendToServer()}
					/>

					<OptionSectionHeader text={"Visual"} yPos={0.319} />
					<OptionMultiChoice
						header={"Graphics"}
						context={props.settings.visual.graphicsQuality}
						yPos={0.344}
						onDecrease={(): void => toggleGraphics.SendToServer("Low")}
						onIncrease={(): void => toggleGraphics.SendToServer("High")}
					/>
					<OptionMultiChoice
						header={"Time of Day"}
						context={tostring(props.settings.visual.timeOfDay)}
						yPos={0.377}
						onDecrease={(): void => {
							const decreasedTimeOfday = props.settings.visual.timeOfDay - 1;
							if (decreasedTimeOfday <= 0) {
								return;
							}

							toggleTimeOfDay.SendToServer(decreasedTimeOfday);
						}}
						onIncrease={(): void => {
							const increasedTimeOfDay = props.settings.visual.timeOfDay + 1;
							if (increasedTimeOfDay > 24) {
								return;
							}

							toggleTimeOfDay.SendToServer(increasedTimeOfDay);
						}}
					/>
					<OptionMultiChoice
						header={"Pet Animation"}
						context={props.settings.visual.petAnimationType === "Following" ? "1" : "2"}
						yPos={0.41}
						onDecrease={(): void => togglePetAnimationType.SendToServer("Following")}
						onIncrease={(): void => togglePetAnimationType.SendToServer("Surrounding")}
					/>
					<OptionMultiChoice
						header={"Pet Distance"}
						context={tostring(props.settings.visual.petsStudsOfDistance)}
						yPos={0.443}
						onDecrease={(): void =>
							togglePetsStudsOfDistance.SendToServer(props.settings.visual.petsStudsOfDistance - 1)
						}
						onIncrease={(): void =>
							togglePetsStudsOfDistance.SendToServer(props.settings.visual.petsStudsOfDistance + 1)
						}
					/>
					<OptionChoice
						header={"Pets Displayed"}
						enabled={props.settings.visual.petsDisplayed}
						yPos={0.476}
						onPressed={(): void => togglePetsDisplayed.SendToServer(!props.settings.visual.petsDisplayed)}
					/>

					<OptionSectionHeader text={"Auto Delete"} yPos={0.51} />
					<OptionChoice
						header={"Basic Rarity"}
						enabled={props.settings.autoDelete.rarities.Basic}
						yPos={0.535}
						onPressed={(): void => toggleAutoDelete.SendToServer("Basic")}
					/>
					<OptionChoice
						header={"Ordinary Rarity"}
						enabled={props.settings.autoDelete.rarities.Ordinary}
						yPos={0.568}
						onPressed={(): void => toggleAutoDelete.SendToServer("Ordinary")}
					/>
					<OptionChoice
						header={"Rare Rarity"}
						enabled={props.settings.autoDelete.rarities.Rare}
						yPos={0.601}
						onPressed={(): void => toggleAutoDelete.SendToServer("Rare")}
					/>
					<OptionChoice
						header={"Epic Rarity"}
						enabled={props.settings.autoDelete.rarities.Epic}
						yPos={0.634}
						onPressed={(): void => toggleAutoDelete.SendToServer("Epic")}
					/>
				</scrollingframe>
			</>
		);
	}),
);
/* eslint-enable jsdoc/require-jsdoc */

/**
 * An interface hub for the player's account.
 */
export const AccountHub = hooks((props: AccountHubProps, hooks) => {
	if (!props.enabled) {
		return <></>;
	}

	const { useValue, useEffect, useState } = hooks;

	const [playerViewing, setViewedPlayer] = useState<Player>(Players.LocalPlayer);
	const [playerSelectionVisible, setPlayerSelectionVisibility] = useState(false);
	const [rightComponentDisplayed, setRightComponentDisplayed] = useState<
		"Stats" | "Accolades" | "TradeHistory" | "Options" | "Codes" | "Mastery" | undefined
	>(undefined);

	const viewportFrameRef = useValue(Roact.createRef<ViewportFrame>());
	const cameraRef = useValue(Roact.createRef<Camera>());
	useEffect(() => {
		if (playerSelectionVisible) {
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
			if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) {
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
			if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) {
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
		leftDisplayedComponents.push(
			<AccountPlayerSelection
				setPlayerViewed={(player): void => setViewedPlayer(player)}
				returnToSelection={(): void => setPlayerSelectionVisibility(false)}
			/>,
			<ReturnToAccountView returnToSelection={(): void => setPlayerSelectionVisibility(false)} />,
		);
	} else {
		leftDisplayedComponents.push(
			<frame
				AnchorPoint={vec2Middle}
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
			</frame>,

			<EditAccount />,
			<SelectPlayer setPlayerSelectionVisibility={(): void => setPlayerSelectionVisibility(true)} />,
		);
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
						(playerStore !== undefined && playerStore.getState().settings.privacy.publicTradeHistory) ?? false
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
				<frame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.725, 0.565)}
					Size={UDim2.fromScale(0.5, 0.765)}
				>
					<uigridlayout
						CellPadding={UDim2.fromScale(0.09, 0.09)}
						CellSize={UDim2.fromScale(0.265, 0.265)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>

					{iconsToDisplay}
				</frame>,
			);
		}
	}

	return (
		<imagelabel
			AnchorPoint={vec2Middle}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.575, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image={assetIds.images.ui.account.background}
			ScaleType={Enum.ScaleType.Fit}
		>
			<uiaspectratioconstraint AspectRatio={1.5} />
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.4, 0.135)}
				Position={UDim2.fromScale(0.5, 0.08)}
				Text={"Account"}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Font={font}
			>
				<BaseUIStroke native={{ Thickness: 1.5, Color: Color3.fromRGB(184, 80, 0) }} />
			</textlabel>

			{leftDisplayedComponents}
			{rightDisplayedComponents}

			<ExitButton
				Position={UDim2.fromScale(0.985, 0.115)}
				minimizedSize={0.09}
				maximizedSize={0.1}
				onClosed={(): void => props.hideMenu()}
			/>
		</imagelabel>
	);
});
