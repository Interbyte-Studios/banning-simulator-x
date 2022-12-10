import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getPetImage } from "client/util/getPetImage";
import assetIds from "shared/assets";
import { spinRewards } from "shared/configs/spinWheel";

import { RewardSlot } from "./rewardSlot";

interface SpinWheelProps {}

const slotPositions: Record<number, { pos: UDim2; rot?: number }> = {
	1: { pos: UDim2.fromScale(0.389, 0.038) },
	2: { pos: UDim2.fromScale(0.7, 0.34), rot: 90 },
	3: { pos: UDim2.fromScale(0.08, 0.34), rot: -90 },
	4: { pos: UDim2.fromScale(0.155, 0.122), rot: -45 },
	5: { pos: UDim2.fromScale(0.6, 0.565), rot: 145 },
	6: { pos: UDim2.fromScale(0.17, 0.55), rot: -130 },
	7: { pos: UDim2.fromScale(0.6, 0.125), rot: 45 },
	8: { pos: UDim2.fromScale(0.389, 0.64), rot: 180 },
};

const slotsData: Record<number, { image: string; amount: number }> = [];
for (const [index, rewardInfo] of pairs(spinRewards)) {
	if (rewardInfo.rewardType === "currency" && rewardInfo.rewardData.name !== undefined) {
		slotsData[index] = {
			image: assetIds.images.currencies[rewardInfo.rewardData.name],
			amount: rewardInfo.rewardData.amount,
		};
	} else if (rewardInfo.rewardType === "boosts") {
		slotsData[index] = { image: assetIds.images.vectors.Clover, amount: rewardInfo.rewardData.amount };
	} else if (rewardInfo.rewardType === "pet" && rewardInfo.rewardData.petId !== undefined) {
		slotsData[index] = {
			image: getPetImage(rewardInfo.rewardData.petId, "regular"),
			amount: rewardInfo.rewardData.amount,
		};
	}
}

export const SpinWheel = hooks((props: SpinWheelProps, hooks) => {
	const endedRot = new Random().NextNumber(-1200, -2400);
	const endedRotMotor = new Flipper.Spring(endedRot, { frequency: 2, dampingRatio: 5 });

	const wheelSpin = useBindingMotor(hooks, 0);
	const { useContext } = hooks;
	const { spinWheel } = useContext(remoteContext);

	const slots: Array<Roact.Element> = [];

	for (const [index, rewardData] of pairs(slotsData)) {
		slots.push(
			<RewardSlot
				pos={slotPositions[index].pos}
				amount={rewardData.amount}
				image={rewardData.image}
				rot={slotPositions[index].rot ?? 0}
			/>,
		);
	}

	/**
	 *
	 */
	function rotateWheel(): void {
		wheelSpin.motor.setGoal(endedRotMotor);
	}

	return (
		<frame
			AnchorPoint={vec2Middle}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.27, 0.57)}
			BackgroundTransparency={1}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<imagelabel
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Fit}
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={vec2Middle}
				Image={"rbxassetid://11751284496"}
			>
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
			<imagelabel
				AnchorPoint={Vector2.one.mul(0.5)}
				Position={UDim2.fromScale(0.5, 0.06)}
				Size={UDim2.fromScale(0.2, 0.2)}
				BackgroundTransparency={1}
				Image={"rbxassetid://11752302246"}
				ScaleType={Enum.ScaleType.Fit}
				ZIndex={2}
			></imagelabel>
			<imagelabel
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Fit}
				Size={UDim2.fromScale(0.9, 0.9)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={vec2Middle}
				Image={"rbxassetid://11751293075"}
				Rotation={wheelSpin.binding.map((value) => {
					return value;
				})}
			>
				{slots}
				<uiaspectratioconstraint AspectRatio={1} />
			</imagelabel>
			<textbutton
				Size={UDim2.fromScale(0.22, 0.22)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={vec2Middle}
				BackgroundColor3={Color3.fromRGB(52, 190, 255)}
				AutoButtonColor={false}
				TextTransparency={1}
				Event={{
					/**
					 *
					 */
					Activated: (): void => {
						spinWheel.SendToServer();
						rotateWheel();
					},
				}}
			>
				<uigradient
					Rotation={90}
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(175, 211, 255)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(74, 90, 109)),
						])
					}
				/>
				<uistroke Thickness={4} Color={Color3.fromRGB(11, 52, 68)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<textlabel
					Text={"SPIN"}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.8, 0.8)}
					AnchorPoint={vec2Middle}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Font={font}
					TextScaled={true}
				>
					<uistroke Thickness={3} Color={Color3.fromRGB(11, 52, 68)} />
				</textlabel>
			</textbutton>
		</frame>
	);
});
