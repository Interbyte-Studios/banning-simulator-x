import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { color3White, font, vec2Middle } from "client/ui/commonValues";
import { hooks } from "client/ui/hooks";
import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";
import { getZoneData } from "shared/util/getZoneData";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

interface ZonePurchasePromptProps {
	worldName: WorldName;
	zoneName: ZoneNames;
	onPurchase: () => void;
	onCancel: () => void;
}

const maximizedSize = { x: 0.375, y: 0.2 };
const minimizedSize = { x: 0.345, y: 0.18 };

const springProps = {
	frequency: 5,
	dampingRatio: 0.5,
};

/**
 * A zone prompt purchase interface.
 */
/* eslint-disable jsdoc/require-jsdoc */
export const ZonePurchasePromptFrame = hooks((props: ZonePurchasePromptProps) => {
	const zoneData = getZoneData(props.worldName, props.zoneName);

	const confirmButtonMotor = new Flipper.GroupMotor({ x: maximizedSize.x, y: maximizedSize.y });
	const [confirmButtonBinding, setConfirmButtonBinding] = Roact.createBinding(confirmButtonMotor.getValue());

	const cancelButtonMotor = new Flipper.GroupMotor({ x: maximizedSize.x, y: maximizedSize.y });
	const [cancelButtonBinding, setCancelButtonBinding] = Roact.createBinding(confirmButtonMotor.getValue());

	confirmButtonMotor.onStep(setConfirmButtonBinding);
	cancelButtonMotor.onStep(setCancelButtonBinding);

	return (
		<frame
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.289, 0.367)}
			BackgroundColor3={Color3.fromRGB(255, 226, 188)}
		>
			<uiaspectratioconstraint AspectRatio={1.601} />
			<uistroke Thickness={4} Color={Color3.fromRGB(182, 161, 133)} />
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<textlabel
				Text={"Purchase Zone"}
				BackgroundTransparency={1}
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, -0.012)}
				Size={UDim2.fromScale(0.642, 0.16)}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
				Font={font}
			>
				<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
			</textlabel>
			<textbutton
				AnchorPoint={vec2Middle}
				TextTransparency={1}
				BackgroundColor3={Color3.fromRGB(167, 240, 170)}
				Position={UDim2.fromScale(0.3, 0.85)}
				Size={confirmButtonBinding.map((value) => {
					return UDim2.fromScale(value.x, value.y);
				})}
				AutoButtonColor={false}
				Event={{
					Activated: (): void => props.onPurchase(),
					MouseEnter: (): void => {
						confirmButtonMotor.setGoal({
							x: new Flipper.Spring(minimizedSize.x, springProps),
							y: new Flipper.Spring(minimizedSize.y, springProps),
						});
					},
					MouseLeave: (): void => {
						confirmButtonMotor.setGoal({
							x: new Flipper.Spring(maximizedSize.x, springProps),
							y: new Flipper.Spring(maximizedSize.y, springProps),
						});
					},
				}}
			>
				<uistroke Thickness={3} Color={Color3.fromRGB(112, 158, 113)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<textlabel
					Text={"Confirm"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					TextColor3={color3White}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(112, 158, 113)} />
				</textlabel>
			</textbutton>
			<textbutton
				AnchorPoint={vec2Middle}
				TextTransparency={1}
				BackgroundColor3={Color3.fromRGB(211, 141, 141)}
				Position={UDim2.fromScale(0.7, 0.85)}
				Size={cancelButtonBinding.map((value) => {
					return UDim2.fromScale(value.x, value.y);
				})}
				AutoButtonColor={false}
				Event={{
					Activated: (): void => props.onCancel(),
					MouseEnter: (): void => {
						cancelButtonMotor.setGoal({
							x: new Flipper.Spring(minimizedSize.x, springProps),
							y: new Flipper.Spring(minimizedSize.y, springProps),
						});
					},
					MouseLeave: (): void => {
						cancelButtonMotor.setGoal({
							x: new Flipper.Spring(maximizedSize.x, springProps),
							y: new Flipper.Spring(maximizedSize.y, springProps),
						});
					},
				}}
			>
				<uistroke Thickness={3} Color={Color3.fromRGB(138, 92, 92)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<uicorner CornerRadius={new UDim(0.2, 0)} />
				<textlabel
					Text={"Cancel"}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.8)}
					BackgroundTransparency={1}
					TextColor3={color3White}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(138, 92, 92)} />
				</textlabel>
			</textbutton>
			<frame
				AnchorPoint={vec2Middle}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromScale(0.9, 0.6)}
				BackgroundColor3={Color3.fromRGB(215, 190, 157)}
			>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<textlabel
					Text={props.zoneName}
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.165)}
					Size={UDim2.fromScale(0.8, 0.3)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
				</textlabel>
				<textlabel
					Text={zoneData.cost ? `Rank ${zoneData.cost.requiredRank}` : "No Rank"}
					AnchorPoint={vec2Middle}
					TextXAlignment={Enum.TextXAlignment.Left}
					Position={UDim2.fromScale(0.65, 0.5)}
					Size={UDim2.fromScale(0.414, 0.25)}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					BackgroundTransparency={1}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
					<imagelabel
						Image={"rbxassetid://10189531403"}
						BackgroundTransparency={1}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(-0.2, 0.5)}
						Size={UDim2.fromScale(0.302, 1.2)}
					/>
				</textlabel>
				<textlabel
					Text={zoneData.cost ? twoDpAbbreviator.numberToString(zoneData.cost.amount) : "Free"}
					AnchorPoint={vec2Middle}
					TextXAlignment={Enum.TextXAlignment.Left}
					Position={UDim2.fromScale(0.65, 0.82)}
					Size={UDim2.fromScale(0.414, 0.25)}
					BackgroundTransparency={1}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
					Font={font}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
					<imagelabel
						Image={zoneData.cost ? assetIds.images.currencies[zoneData.cost.currency] : ""}
						BackgroundTransparency={1}
						ScaleType={Enum.ScaleType.Fit}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(-0.2, 0.5)}
						Size={UDim2.fromScale(0.302, 1.2)}
					/>
				</textlabel>
			</frame>
		</frame>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
