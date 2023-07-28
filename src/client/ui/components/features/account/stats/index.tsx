import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { TitleGradient } from "client/ui/elements/gradients/titleGradient";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";
import { GROUP_ROLES } from "shared/configs/game";
import { TITLES } from "shared/configs/titles";
import { getTalismanData } from "shared/util/getTalismanData";
import { getWeaponInfo } from "shared/util/getWeaponInfo";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { RightComponentHeader } from "../util/rightComponentHeader";
import { StatCard } from "./card";

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
	const [npcBans, setNPCBans] = useState(0);
	const [bans, setBans] = useState(storeState.bans);
	const [hatches, setHatches] = useState(storeState.index.eggs);
	const [timePlayed, setTimePlayed] = useState(storeState.index.timePlayed);
	const [groupRank, setGroupRank] = useState(storeState.index.groupRank);
	const [rank, setRank] = useState(storeState.rank);
	const [title, setTitle] = useState(storeState.title);
	const [weapon, setWeapon] = useState(storeState.currentWeapon.id);
	const [talisman, setTalisman] = useState(storeState.currentTalisman);
	const [legendariesHatched, setLegendariesHatched] = useState(storeState.eggs.rarities.Legendary);
	const [prismaticsHatched, setPrismaticsHatched] = useState(storeState.eggs.rarities.Prismatic);
	const [primordialsHatched, setPrimordialsHatched] = useState(storeState.eggs.rarities.Primordial);

	let totalRegularEggHatches = 0;
	let totalVoidEggHatches = 0;
	hatches.forEach((egg) => {
		totalRegularEggHatches += egg.regular;
		totalVoidEggHatches += egg.void;
	});

	let groupTag = "No Rank";
	let groupColor = Color3.fromRGB(255, 255, 255);

	pcall(() => {
		for (const [rankIndex, rankData] of pairs(GROUP_ROLES)) {
			if (groupRank === undefined) {
				continue;
			}

			if (groupRank === rankIndex) {
				groupTag = rankData.tag;
				groupColor = rankData.color;
			}
		}
	});

	const groupRankName = groupTag;
	const groupRankColor = groupColor;

	const titleSpecialElement: Array<Roact.Element> = [];
	const titleName = title ?? "No Title";
	if (title !== undefined) {
		const titleData = TITLES.find((x) => x.name === title);
		if (titleData !== undefined) {
			titleSpecialElement.push(
				<>
					<TitleGradient titleId={titleData.id} />
				</>,
			);
		}
	}

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

		const connection = scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			scrollingFrame.GetChildren().forEach((card) => {
				if (card.IsA("Frame")) {
					card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
				}
			});
		});
		return (): void => connection.Disconnect();
	});

	useEffect(() => {
		const playerStore = retrieveStore(props.viewedPlayer);
		if (playerStore === undefined) {
			throw `Failed to get player store for ${props.viewedPlayer.Name}.`;
		}

		const connection = playerStore.changed.connect((newState, oldState) => {
			if (newState.weapons === oldState.weapons) {
				let newBans = 0;
				for (const weapon of newState.weapons) {
					newBans += weapon.bans;
				}
				setNPCBans(newBans);
			}

			if (newState.bans !== oldState.bans) {
				setBans(newState.bans);
			}

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

			if (newState.eggs.rarities.Legendary !== oldState.eggs.rarities.Legendary) {
				setTalisman(newState.eggs.rarities.Legendary);
			}

			if (newState.eggs.rarities.Prismatic !== oldState.eggs.rarities.Prismatic) {
				setTalisman(newState.eggs.rarities.Prismatic);
			}

			if (newState.eggs.rarities.Primordial !== oldState.eggs.rarities.Primordial) {
				setTalisman(newState.eggs.rarities.Primordial);
			}
		});

		return (): void => connection.disconnect();
	}, [props.viewedPlayer]);

	useEffect(() => {
		const playerStore = retrieveStore(props.viewedPlayer);
		if (playerStore === undefined) {
			throw `Failed to get player store for ${props.viewedPlayer.Name}.`;
		}

		const currentState = playerStore.getState();

		let newBans = 0;
		for (const weapon of currentState.weapons) {
			newBans += weapon.bans;
		}

		setNPCBans(newBans);
		setBans(currentState.bans);
		setHatches(currentState.index.eggs);
		setTimePlayed(currentState.index.timePlayed);
		setGroupRank(currentState.index.groupRank);
		setRank(currentState.rank);
		setTitle(currentState.title);
		setWeapon(currentState.currentWeapon.id);
		setTalisman(currentState.currentTalisman);
		setPrismaticsHatched(currentState.eggs.rarities.Prismatic);
		setPrimordialsHatched(currentState.eggs.rarities.Primordial);
		setLegendariesHatched(currentState.eggs.rarities.Legendary);
	}, [props.viewedPlayer]);

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
				ScrollBarThickness={12}
				BorderSizePixel={0}
				ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
				ScrollingDirection={Enum.ScrollingDirection.Y}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					Padding={new UDim(0.005, 0)}
					Ref={uiListLayoutRef.value}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<StatCard header={"Title:"} stat={titleName} additionalElements={titleSpecialElement} layoutId={1} />
				<StatCard header={"Rank:"} stat={rank} layoutId={2} />
				<StatCard header={"NPCs Banned:"} stat={statsAbbreviator.numberToString(npcBans)} layoutId={3} />
				<StatCard header={"Bans:"} stat={statsAbbreviator.numberToString(bans)} layoutId={3} />
				<StatCard
					header={"Started Playing:"}
					stat={playerStore.getState().index.joinDate.FormatLocalTime("LL", "en-us")}
					layoutId={4}
				/>
				<StatCard header={"Time Played:"} stat={formatTime(timePlayed)} layoutId={4} />
				<StatCard header={"Reg. Eggs:"} stat={statsAbbreviator.numberToString(totalRegularEggHatches)} layoutId={5} />
				<StatCard header={"Void Eggs:"} stat={statsAbbreviator.numberToString(totalVoidEggHatches)} layoutId={6} />
				<StatCard header={"Legends Hatched:"} stat={statsAbbreviator.numberToString(legendariesHatched)} layoutId={7} />
				<StatCard header={"Prismatics Hatched:"} stat={tostring(prismaticsHatched)} layoutId={8} />
				<StatCard header={"Primordials Hatched:"} stat={tostring(primordialsHatched)} layoutId={9} />
				<StatCard header={"Weapon:"} stat={weaponName} layoutId={10} />
				<StatCard header={"Talisman:"} stat={talismanName} layoutId={11} />
				<StatCard header={"Group Rank:"} stat={groupRankName} textColor={groupRankColor} layoutId={12} />
			</RescalingScrollingFrame>
		</>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
