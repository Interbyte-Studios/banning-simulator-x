import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { WeaponViewport } from "client/ui/elements/viewports/weaponViewport";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { Weapon } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { FullComponentHeader } from "../util/fullComponentHeader";

/* eslint-disable jsdoc/require-jsdoc */
export const ModifyWeaponLevel = hooks((props: { playerViewing: Player; setActiveAction: () => void }, hooks) => {
	const { useValue, useEffect, useState, useContext } = hooks;
	const [weaponSelected, setWeaponSelected] = useState<Weapon | undefined>(undefined);
	const [weaponLevel, setWeaponLevel] = useState<number | undefined>(undefined);
	const [modifiedLevel, setModifiedLevel] = useState<number | undefined>(undefined);

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

	const { admin_ModifyWeaponLevel } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const maximizedSize = 0.15;

	if (weaponSelected !== undefined && weaponLevel !== undefined) {
		const weaponData = getWeaponInfo(weaponSelected.id);

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Modify Weapon Level Confirmation for ${props.playerViewing.Name}`}
					returnToSelection={(): void => setWeaponLevel(undefined)}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.2),
						Text: `Are you sure you want to change the level of "${weaponData.name}" weapon for player: ${props.playerViewing.Name} to: ${weaponLevel}?`,
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
							setWeaponLevel(undefined);
							setWeaponSelected(undefined);
							setModifiedLevel(undefined);
							props.setActiveAction();
							admin_ModifyWeaponLevel.SendToServer(props.playerViewing.UserId, {
								weaponId: weaponSelected.id,
								level: weaponLevel,
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
							setWeaponSelected(undefined);
							setWeaponLevel(undefined);
							setModifiedLevel(undefined);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />

					<StrokeTextLabel
						native={{
							Text: "No!",
							Size: UDim2.fromScale(0.8, 0.8),
						}}
						stroke={{
							native: { Thickness: 1.755, Color: Color3.fromRGB(140, 28, 104) },
						}}
					/>
				</SpringImageButton>
			</>
		);
	} else if (weaponSelected !== undefined) {
		const weaponMaxLevel = 10;

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Set Modified Level for Weapon`}
					returnToSelection={(): void => {
						setWeaponSelected(undefined);
						setModifiedLevel(undefined);
					}}
					displayReturn={true}
				/>
				<StrokeTextLabel
					native={{
						Size: UDim2.fromScale(0.95, 0.075),
						Text: `Modified Level: ${modifiedLevel ?? "(No Input)"}`,
					}}
					stroke={{
						native: { Thickness: 1.755, Color: Color3.fromRGB(0, 56, 125) },
					}}
				/>
				<BaseFrame
					BackgroundTransparency={0}
					BackgroundColor3={Color3.fromRGB(0, 131, 213)}
					Position={UDim2.fromScale(0.5, 0.615)}
					Size={UDim2.fromScale(0.4, 0.125)}
				>
					<uiaspectratioconstraint AspectRatio={7} />
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(19, 81, 128) }} />
					<textbox
						AnchorPoint={vec2Middle}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 0.6)}
						PlaceholderText={"Input Level: (Ex: 30)"}
						PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
						Text={""}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Font={font}
						TextScaled={true}
						Change={{
							Text: (rbx): void => {
								const text = rbx.Text;
								if (text === "") {
									return;
								}

								const number = tonumber(text);
								if (number === undefined) {
									return;
								}

								const roundedNumber = math.floor(number);
								if (roundedNumber > weaponMaxLevel) {
									if (modifiedLevel === weaponMaxLevel) {
										return;
									}

									setModifiedLevel(weaponMaxLevel);
								} else setModifiedLevel(roundedNumber);
							},
						}}
					>
						<BaseUIStroke native={{ Thickness: 1.2 }} />
					</textbox>
				</BaseFrame>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.75),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{
						maxSize: maximizedSize,
						minSize: minimizedSize,
					}}
					events={{
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							setWeaponLevel(modifiedLevel);
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
			assert(uiGridLayout, "Failed to get UIGridLayout for administrative weapon level ui.");

			CollectionService.AddTag(uiGridLayout, `UnscaledInventoryGridLayout`);
		});

		return (
			<>
				<FullComponentHeader
					storeFound={true}
					headerText={`Select Weapon to modify for ${props.playerViewing.Name}`}
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
					ScrollBarImageColor3={Color3.fromRGB(0, 51, 80)}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<uigridlayout
						CellPadding={UDim2.fromOffset(6, 6)}
						CellSize={UDim2.fromOffset(110, 110)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						FillDirectionMaxCells={5}
						Ref={layoutRef.value}
					/>
					{playerStore.getState().weapons.map((storedWeapon) => {
						const weaponData = getWeaponInfo(storedWeapon.id);

						const additionalElements: Array<Roact.Element> = [];
						if (storedWeapon.level > 1) {
							additionalElements.push(
								<StrokeTextLabel
									native={{
										Position: UDim2.fromScale(0.5, 0.95),
										Size: UDim2.fromScale(0.7, 0.2),
										Text: `Level: ${storedWeapon.level}`,
									}}
									stroke={{
										native: { Thickness: 2, Color: Color3.fromRGB(0, 74, 122) },
									}}
								/>,
							);
						}

						return (
							<BaseFrame LayoutOrder={storedWeapon.id}>
								<SpringImageButton
									native={{
										BackgroundTransparency: 0,
										BackgroundColor3: Color3.fromRGB(46, 115, 179),
										Size: UDim2.fromScale(0.925, 0.925),
									}}
									size={{
										maxSize: maximizedSize,
										minSize: minimizedSize,
									}}
									events={{
										Activated: (): void => {
											playSFX(UIEngagement.MajorEngagement);
											setWeaponSelected(storedWeapon);
										},
									}}
								>
									<uiaspectratioconstraint AspectRatio={1} />
									<uicorner CornerRadius={new UDim(1, 0)} />
									<BaseUIStroke native={{ Thickness: 3, Transparency: 0.5 }} />
									<WeaponViewport weaponId={storedWeapon.id} />
									<StrokeTextLabel
										native={{
											Size: UDim2.fromScale(1, 0.2),
											Position: UDim2.fromScale(0.5, 0.1),
											Text: weaponData.name,
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
