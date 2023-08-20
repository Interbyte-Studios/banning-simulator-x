import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { AccountMastery } from "shared/configs/accountMastery";

import { AccountIconTemplate } from "../account/util/accountIconTemplate";
import { FullComponentHeader } from "../account/util/fullComponentHeader";
import { MasteryCard } from "./masteryCard";

interface MasteryProps {
	hideMenu: () => void;
}

/**
 * A mastery section showing the player's mastery of the game.
 */
export const Mastery = hooks((props: MasteryProps, { useState, useValue, useEffect }) => {
	const [masteryDisplayed, setMasteryDisplayed] = useState<
		"Eggs" | "Pet Experience" | "Fusing" | "Boosts" | "Banning" | undefined
	>(undefined);

	const playerStore = retrieveStore(Players.LocalPlayer);
	if (playerStore === undefined) {
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

				<FullComponentHeader
					storeFound={true}
					headerText={`${Players.LocalPlayer}'s Mastery`}
					returnToSelection={
						masteryDisplayed !== undefined ? (): void => setMasteryDisplayed(undefined) : props.hideMenu
					}
					displayReturn={true}
				/>
				<ExitButton
					Position={UDim2.fromScale(0.985, 0.115)}
					minimizedSize={0.09}
					maximizedSize={0.1}
					onClosed={(): void => props.hideMenu()}
				/>
			</ImageLabel>
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
				totalMaxLevels += petIndex.index.maxLevel.radiant;
				totalMaxLevels += petIndex.index.maxLevel.void;
				totalMaxLevels += petIndex.index.maxLevel.regular;
			});

			masteryElements.push(
				<MasteryCard
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
			totalFusions += petIndex.index.fused.radiant;
			totalFusions += petIndex.index.fused.void;
		});

		for (const masteryData of AccountMastery.fusing) {
			masteryElements.push(
				<MasteryCard
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
						CellPadding={UDim2.fromScale(0, 0.1)}
						CellSize={UDim2.fromScale(0.3, 0.4)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.vectors.Egg}
						imagePosition={UDim2.fromScale(0.485, 0.5)}
						displayBackground={false}
						text={"Eggs"}
						layoutOrder={1}
						onPressed={(): void => setMasteryDisplayed("Eggs")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.vectors.boosts.greenCrate}
						imagePosition={UDim2.fromScale(0.45, 0.5)}
						imageSize={UDim2.fromScale(0.85, 0.85)}
						displayBackground={false}
						text={"Boosts"}
						layoutOrder={2}
						onPressed={(): void => setMasteryDisplayed("Boosts")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.vectors.Hammer}
						imageSize={UDim2.fromScale(0.85, 0.85)}
						displayBackground={false}
						text={"Banning"}
						layoutOrder={3}
						onPressed={(): void => setMasteryDisplayed("Banning")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.vectors.PetPaw}
						imagePosition={UDim2.fromScale(0.515, 0.5)}
						displayBackground={false}
						text={"Fusing"}
						layoutOrder={4}
						onPressed={(): void => setMasteryDisplayed("Fusing")}
					/>

					<AccountIconTemplate
						accessibleFeature={true}
						image={assetIds.images.vectors.Experience}
						imagePosition={UDim2.fromScale(0.485, 0.5)}
						displayBackground={false}
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
					ScrollBarThickness={12}
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					BorderSizePixel={0}
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

			<FullComponentHeader
				storeFound={true}
				headerText={`${Players.LocalPlayer}'s Mastery`}
				returnToSelection={masteryDisplayed !== undefined ? (): void => setMasteryDisplayed(undefined) : props.hideMenu}
				displayReturn={true}
			/>
			{masteryDisplayed !== undefined ? scrollingFrame : masteryElements}
			<ExitButton
				Position={UDim2.fromScale(0.985, 0.115)}
				minimizedSize={0.09}
				maximizedSize={0.1}
				onClosed={(): void => props.hideMenu()}
			/>
		</ImageLabel>
	);
});
