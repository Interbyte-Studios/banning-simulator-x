import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { TalismanGradient } from "client/ui/elements/gradients/talismanGradient";
import { TalismanViewport } from "client/ui/elements/viewports/talismanViewport";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { TalismanPhases } from "shared/configs/talismans";
import { Talisman } from "shared/rodux/talismans";
import { getTalismanData } from "shared/util/getTalismanData";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { FullComponentHeader } from "../util/fullComponentHeader";

/* eslint-disable jsdoc/require-jsdoc */
export const ModifyTalismanPhase = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [talismanSelected, setTalismanSelected] = useState<Talisman | undefined>(undefined);
	const [talismanPhase, setTalismanPhase] = useState<TalismanPhases | undefined>(undefined);
	const [modifiedPhase, setModifiedPhase] = useState<TalismanPhases | undefined>(undefined);

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

	const { admin_ModifyTalismanLevel } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const maximizedSize = 0.15;

	if (talismanSelected !== undefined && talismanPhase !== undefined) {
		const talismanData = getWeaponInfo(talismanSelected.id);

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Modify Talisman Phase Confirmation for ${props.playerViewing.Name}`}
					returnToSelection={(): void => setTalismanPhase(undefined)}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.2),
						Text: `Are you sure you want to change the phase of "${talismanData.name}" talisman for player: ${props.playerViewing.Name} to: ${talismanPhase}?`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.75, 0.675),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setTalismanSelected(undefined);
							setModifiedPhase(undefined);
							setTalismanPhase(undefined);
							props.setActiveAction();
							admin_ModifyTalismanLevel.SendToServer(props.playerViewing.UserId, {
								talismanId: talismanSelected.id,
								phase: talismanPhase,
							});
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Yes!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) },
						}}
					/>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.25, 0.675),
						Image: assetIds.images.ui.index.Off,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setModifiedPhase(undefined);
							setTalismanPhase(undefined);
							setTalismanSelected(undefined);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "No!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(140, 28, 104) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else if (talismanSelected !== undefined) {
		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Set Modified Phase for Talisman`}
					returnToSelection={(): void => {
						setTalismanPhase(undefined);
						setModifiedPhase(undefined);
					}}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.35),
						Size: UDim2.fromScale(0.95, 0.075),
						Text: `Modified Level: ${modifiedPhase ?? "(No Input)"}`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<SpringImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						Size: UDim2.fromScale(0.4, 0.125),
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							setModifiedPhase("normal");
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Normal",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
						}}
					>
						<TalismanGradient phase={"normal"} />
					</StrokeTextLabel>
				</SpringImageButton>
				<SpringImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						Size: UDim2.fromScale(0.4, 0.125),
					}}
					size={{
						maxSize: maximizedSize,
						minSize: minimizedSize,
					}}
					events={{
						Activated: (): void => {
							setModifiedPhase("awakend");
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Awakend",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
						}}
					>
						<TalismanGradient phase={"awakend"} />
					</StrokeTextLabel>
				</SpringImageButton>
				<SpringImageButton
					native={{
						BackgroundTransparency: 0,
						BackgroundColor3: Color3.fromRGB(0, 131, 213),
						Position: UDim2.fromScale(0.5, 0.695),
						Size: UDim2.fromScale(0.4, 0.125),
					}}
					size={{
						maxSize: maximizedSize,
						minSize: minimizedSize,
					}}
					events={{
						Activated: (): void => {
							setModifiedPhase("artifact");
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Artifact",
						}}
						stroke={{
							native: {
								Thickness: 1.755,
								Color: Color3.fromRGB(0, 56, 125),
							},
						}}
					>
						<TalismanGradient phase={"artifact"} />
					</StrokeTextLabel>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.825),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ maxSize: maximizedSize, minSize: minimizedSize }}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setTalismanPhase(modifiedPhase);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "Ok!",
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else {
		const layoutRef = useValue(Roact.createRef<UIGridLayout>());
		useEffect(() => {
			const uiGridLayout = layoutRef.value.getValue();
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative talisman level ui.");

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
					ScrollBarThickness={12}
				BorderSizePixel={0}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(110, 110)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={layoutRef.value}
					/>
					{playerStore.getState().talismans.map((storedTalisman) => {
						const talismanData = getTalismanData(storedTalisman.id);

						const additionalElements: Array<Roact.Element> = [];
						if (storedTalisman.phase !== "normal") {
							const phaseName = storedTalisman.phase;
							const capitalizedPhaseName = string.upper(phaseName.sub(1, 1)) + phaseName.sub(2, phaseName.size());

							additionalElements.push(
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.95),
										Size: UDim2.fromScale(0.7, 0.2),
										Text: capitalizedPhaseName,
									}}
									stroke={{
										native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
									}}
								>
									<TalismanGradient phase={storedTalisman.phase} />
								</StrokeTextLabel>,
							);
						}

						return (
							<BaseFrame LayoutOrder={storedTalisman.id}>
								<SpringImageButton
									native={{
										BackgroundTransparency: 0,
										BackgroundColor3: Color3.fromRGB(46, 115, 179),
										Size: UDim2.fromScale(0.925, 0.925),
									}}
									size={{ maxSize: maximizedSize, minSize: minimizedSize }}
									events={{
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											setTalismanSelected(storedTalisman);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
									<TalismanViewport talismanId={storedTalisman.id} phase={storedTalisman.phase} />
									<StrokeTextLabel
										native={{
											Position: UDim2.fromScale(0.5, 0.1),
											Size: UDim2.fromScale(1, 0.2),
											Text: talismanData.name,
										}}
										stroke={{
											native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
										}}
									/>
									{additionalElements}
								</SpringImageButton>
							</BaseFrame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}
});
