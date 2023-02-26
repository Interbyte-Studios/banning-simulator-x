import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { formatTime } from "client/util/formatTime";
import { GROUP_ROLES } from "shared/configs/game";
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
