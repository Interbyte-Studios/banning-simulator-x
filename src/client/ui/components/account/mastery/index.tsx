import Roact from "@rbxts/roact";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { AccountMastery } from "shared/configs/accountMastery";

import { AccountIconTemplate } from "../util/accountIconTemplate";
import { FullComponentHeader } from "../util/fullComponentHeader";
import { MasteryCard } from "./masteryCard";

interface MasteryProps {
	playerViewing: Player;
	returnToSelection: () => void;
}

/**
 * A mastery section showing the player's mastery of the game.
 */
export const Mastery = hooks((props: MasteryProps, { useState, useValue, useEffect }) => {
	const [masteryDisplayed, setMasteryDisplayed] = useState<
		"Eggs" | "Pet Experience" | "Fusing" | "Boosts" | "Banning" | undefined
	>(undefined);

	const playerStore = retrieveStore(props.playerViewing);
	if (playerStore === undefined) {
		return (
			<FullComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Accolades`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
		);
	}

	const uiListLayoutRef = useValue(Roact.createRef<UIListLayout>());
	useEffect(() => {
		if (masteryDisplayed === undefined) {
			return;
		}

		const uiListLayout = uiListLayoutRef.value.getValue();
		assert(uiListLayout, `Failed to get Accolades UIListLayout.`);

		const scrollingFrame = uiListLayout.Parent;
		assert(scrollingFrame, `Failed to get Accolades ScrollingFrame.`);
		assert(scrollingFrame.IsA("ScrollingFrame"), `Expected Accolades to have a ScrollingFrame.`);

		scrollingFrame.GetChildren().forEach((card) => {
			if (card.IsA("Frame")) {
				card.Size = UDim2.fromOffset(scrollingFrame.AbsoluteSize.X, scrollingFrame.AbsoluteSize.X / 4);
			}
		});
	});

	const masteryElements: Array<Roact.Element> = [];
	if (masteryDisplayed === "Eggs") {
		for (const masteryData of AccountMastery.eggs) {
			masteryElements.push(
				<MasteryCard
					playerViewing={props.playerViewing}
					progress={playerStore.getState().eggs.eggs}
					requiredProgress={masteryData.requiredHatches}
					header={`Egg Hatching (Level ${masteryData.level})`}
					description={`Reduced Hatching Cost: x${masteryData.reducedEggCostMultiplier}`}
					level={masteryData.level}
				/>,
			);
		}
	} else if (masteryDisplayed === "Pet Experience") {
		for (const masteryData of AccountMastery.rank) {
			let totalMaxLevels = 0;
			playerStore.getState().index.pets.forEach((petIndex) => {
				totalMaxLevels += petIndex.maxLevel.radiant;
				totalMaxLevels += petIndex.maxLevel.void;
				totalMaxLevels += petIndex.maxLevel.regular;
			});

			masteryElements.push(
				<MasteryCard
					playerViewing={props.playerViewing}
					progress={totalMaxLevels}
					requiredProgress={masteryData.maxLevelPets}
					header={`Pet Experience (Level ${masteryData.level})`}
					description={`Pet Exp Multiple: x${masteryData.additionalPetExperienceMultiplier}`}
					level={masteryData.level}
				/>,
			);
		}
	} else if (masteryDisplayed === "Fusing") {
		let totalFusions = 0;
		playerStore.getState().index.pets.forEach((petIndex) => {
			totalFusions += petIndex.fused.radiant;
			totalFusions += petIndex.fused.void;
		});

		for (const masteryData of AccountMastery.fusing) {
			masteryElements.push(
				<MasteryCard
					playerViewing={props.playerViewing}
					progress={totalFusions}
					requiredProgress={masteryData.requiredFusions}
					header={`Fusion (Level ${masteryData.level})`}
					description={`Reduced Fusion Cost: x${masteryData.reducedFusionMultiplier}`}
					level={masteryData.level}
				/>,
			);
		}
	} else if (masteryDisplayed === "Boosts") {
		for (const masteryData of AccountMastery.boosts) {
			masteryElements.push(
				<MasteryCard
					playerViewing={props.playerViewing}
					progress={playerStore.getState().boosts.uses}
					requiredProgress={masteryData.requiredUses}
					header={`Boosts (Level ${masteryData.level})`}
					description={`Extended Boost Multiple: x${masteryData.extendedDurationMultiplier}`}
					level={masteryData.level}
				/>,
			);
		}
	} else if (masteryDisplayed === "Banning") {
		for (const masteryData of AccountMastery.banning) {
			masteryElements.push(
				<MasteryCard
					playerViewing={props.playerViewing}
					progress={playerStore.getState().bans.bans}
					requiredProgress={masteryData.requiredBans}
					header={`Banning (Level ${masteryData.level})`}
					description={`Currency Multiple: x${masteryData.currencyGainedMultiplier}`}
					level={masteryData.level}
				/>,
			);
		}
	} else if (masteryDisplayed === undefined) {
		masteryElements.push(
			<>
				<BaseFrame Position={UDim2.fromScale(0.5, 0.625)} Size={UDim2.fromScale(0.9, 0.7)}>
					<uigridlayout
						CellPadding={UDim2.fromScale(-0.095, 0.1)}
						CellSize={UDim2.fromScale(0.275, 0.26)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.hatchingMastery}
						text={"Eggs"}
						layoutOrder={1}
						onPressed={(): void => setMasteryDisplayed("Eggs")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.boostsMastery}
						text={"Boosts"}
						layoutOrder={2}
						onPressed={(): void => setMasteryDisplayed("Boosts")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.banMastery}
						text={"Banning"}
						layoutOrder={3}
						onPressed={(): void => setMasteryDisplayed("Banning")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.fusingMastery}
						text={"Fusing"}
						layoutOrder={4}
						onPressed={(): void => setMasteryDisplayed("Fusing")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.ui.account.rankMastery}
						text={"Experience"}
						layoutOrder={5}
						onPressed={(): void => setMasteryDisplayed("Pet Experience")}
					/>
				</BaseFrame>
			</>,
		);
	}

	const scrollingFrame: Array<Roact.Element> = [];
	if (masteryDisplayed !== undefined) {
		scrollingFrame.push(
			<>
				<RescalingScrollingFrame
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.62)}
					Size={UDim2.fromScale(0.95, 0.675)}
					ScrollBarThickness={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						Ref={uiListLayoutRef.value}
						Padding={new UDim(0.01, 0)}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>
					{masteryElements}
				</RescalingScrollingFrame>
			</>,
		);
	}

	return (
		<>
			<FullComponentHeader
				storeFound={true}
				headerText={`${props.playerViewing.Name}'s Mastery`}
				returnToSelection={props.returnToSelection}
				displayReturn={true}
			/>
			{masteryDisplayed !== undefined ? scrollingFrame : masteryElements}
		</>
	);
});
