import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { RankIcon } from "client/ui/elements/icons/rankIcon";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";

import { FullComponentHeader } from "../util/fullComponentHeader";

/* eslint-disable jsdoc/require-jsdoc */
export const ModifyRank = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [rankSelected, setRankSelected] = useState<number | undefined>(undefined);

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

	const { admin_ModifyRank } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.15;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const continueMotor = useBindingMotor(hooks, maximizedSize);
	const retractMotor = useBindingMotor(hooks, maximizedSize);

	if (rankSelected !== undefined) {
		const rankData = RANKS.find((rankData) => rankData.id === rankSelected);
		assert(rankData, `Failed to find rank data for rank of id ${rankSelected} | Admin`);

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Modify Rank Confirmation for ${props.playerViewing.Name}`}
					returnToSelection={(): void => setRankSelected(undefined)}
					displayReturn={true}
				/>
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.2)}
					Font={font}
					Text={`Are you sure you want to modify ${props.playerViewing.Name}'s rank to to: ${rankData.name}?`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.75, 0.675)}
					Size={continueMotor.binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					ScaleType={Enum.ScaleType.Fit}
					Image={assetIds.images.ui.index.Claim}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setRankSelected(undefined);
							props.setActiveAction();
							admin_ModifyRank.SendToServer(props.playerViewing.UserId, rankSelected);
						},
						MouseEnter: (): void => continueMotor.motor.setGoal(minimizedSpring),
						MouseLeave: (): void => continueMotor.motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={`Yes!`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) }} />
					</textlabel>
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.25, 0.675)}
					Size={retractMotor.binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					ScaleType={Enum.ScaleType.Fit}
					Image={assetIds.images.ui.index.Off}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setRankSelected(undefined);
						},
						MouseEnter: (): void => retractMotor.motor.setGoal(minimizedSpring),
						MouseLeave: (): void => retractMotor.motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={`No!`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(140, 28, 104) }} />
					</textlabel>
				</imagebutton>
			</>
		);
	} else {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative rank ui.");

			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		});

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Select Talisman to modify for ${props.playerViewing.Name}`}
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
					{RANKS.map((rankData) => {
						return (
							<frame BackgroundTransparency={1} LayoutOrder={rankData.id}>
								<imagebutton
									AnchorPoint={vec2Middle}
									BackgroundTransparency={0}
									BackgroundColor3={Color3.fromRGB(46, 115, 179)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(0.925, 0.925)}
									Image={""}
									Event={{
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											setRankSelected(rankData.id);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
									<RankIcon rank={rankData.id} position={UDim2.fromScale(0.5, 0.5)} size={UDim2.fromScale(0.9, 0.9)} />
									<textlabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Size={UDim2.fromScale(1, 0.2)}
										Position={UDim2.fromScale(0.5, 0.1)}
										Text={rankData.name}
										TextScaled={true}
										Font={font}
										TextColor3={Color3.fromRGB(255, 255, 255)}
									>
										<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
									</textlabel>
								</imagebutton>
							</frame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}
});
