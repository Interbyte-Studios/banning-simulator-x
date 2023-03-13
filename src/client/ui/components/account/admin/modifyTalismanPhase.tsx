import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { RescalingScrollingFrame } from "client/ui/elements/rescalingScrollingFrame";
import { TalismanGradient } from "client/ui/elements/talismanGradient";
import { TalismanViewport } from "client/ui/elements/talismanViewport";
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
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.15;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const continueMotor = useBindingMotor(hooks, maximizedSize);
	const retractMotor = useBindingMotor(hooks, maximizedSize);
	const levelMotor = useBindingMotor(hooks, maximizedSize);

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
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.2)}
					Font={font}
					Text={`Are you sure you want to change the phase of "${talismanData.name}" talisman for player: ${props.playerViewing.Name} to: ${talismanPhase}?`}
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
							setTalismanSelected(undefined);
							setModifiedPhase(undefined);
							setTalismanPhase(undefined);
							props.setActiveAction();
							admin_ModifyTalismanLevel.SendToServer(props.playerViewing.UserId, {
								talismanId: talismanSelected.id,
								phase: talismanPhase,
							});
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
							setModifiedPhase(undefined);
							setTalismanPhase(undefined);
							setTalismanSelected(undefined);
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
				<textlabel
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.35)}
					Size={UDim2.fromScale(0.95, 0.075)}
					Font={font}
					Text={`Modified Level: ${modifiedPhase ?? "(No Input)"}`}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
				>
					<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
				</textlabel>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.5, 0.465)}
					Size={UDim2.fromScale(0.4, 0.125)}
					Image={""}
					Event={{
						Activated: (): void => setModifiedPhase("normal"),
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={"Normal"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<TalismanGradient phase={"normal"} />
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.5, 0.58)}
					Size={UDim2.fromScale(0.4, 0.125)}
					Image={""}
					Event={{
						Activated: (): void => setModifiedPhase("awakend"),
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={"Awakend"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<TalismanGradient phase={"awakend"} />
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.5, 0.695)}
					Size={UDim2.fromScale(0.4, 0.125)}
					Image={""}
					Event={{
						Activated: (): void => setModifiedPhase("artifact"),
					}}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={"Artifact"}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<TalismanGradient phase={"artifact"} />
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) }} />
					</textlabel>
				</imagebutton>
				<imagebutton
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.825)}
					Size={levelMotor.binding.map((value) => {
						return UDim2.fromScale(value, value);
					})}
					ScaleType={Enum.ScaleType.Fit}
					Image={assetIds.images.ui.index.Claim}
					Event={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setTalismanPhase(modifiedPhase);
						},
						MouseEnter: (): void => levelMotor.motor.setGoal(minimizedSpring),
						MouseLeave: (): void => levelMotor.motor.setGoal(maximizedSpring),
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<textlabel
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 0.8)}
						Font={font}
						Text={`Ok!`}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
					>
						<BaseUIStroke native={{ Thickness: 1.755, Color: Color3.fromRGB(23, 154, 77) }} />
					</textlabel>
				</imagebutton>
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
					{playerStore.getState().talismans.map((storedTalisman) => {
						const talismanData = getTalismanData(storedTalisman.id);

						const additionalElements: Array<Roact.Element> = [];
						if (storedTalisman.phase !== "normal") {
							const capitalizedPhaseName =
								storedTalisman.phase === "artifact"
									? "Artifact"
									: storedTalisman.phase === "awakend"
									? "Awakend"
									: "Normal";

							additionalElements.push(
								<textlabel
									AnchorPoint={vec2Middle}
									BackgroundTransparency={1}
									Position={UDim2.fromScale(0.5, 0.95)}
									Size={UDim2.fromScale(0.7, 0.2)}
									Font={font}
									Text={capitalizedPhaseName}
									TextScaled={true}
									TextColor3={Color3.fromRGB(255, 255, 255)}
								>
									<TalismanGradient phase={storedTalisman.phase} />
									<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
								</textlabel>,
							);
						}

						return (
							<frame BackgroundTransparency={1} LayoutOrder={storedTalisman.id}>
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
											setTalismanSelected(storedTalisman);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
									<TalismanViewport talismanId={storedTalisman.id} phase={storedTalisman.phase} />
									<textlabel
										AnchorPoint={vec2Middle}
										BackgroundTransparency={1}
										Size={UDim2.fromScale(1, 0.2)}
										Position={UDim2.fromScale(0.5, 0.1)}
										Text={talismanData.name}
										TextScaled={true}
										Font={font}
										TextColor3={Color3.fromRGB(255, 255, 255)}
									>
										<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(0, 74, 122) }} />
									</textlabel>
									{additionalElements}
								</imagebutton>
							</frame>
						);
					})}
				</RescalingScrollingFrame>
			</>
		);
	}
});
