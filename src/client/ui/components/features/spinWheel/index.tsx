import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import { getPetImage } from "client/util/getPetImage";
import assetIds from "shared/assets";
import { spinRewards } from "shared/configs/spinWheel";
import { StoreState } from "shared/rodux";
import { SpinWheelState } from "shared/rodux/spinWheel";

import { SpinRewardFrame } from "./rewardFrame";
import { RewardSlot } from "./rewardSlot";
import { SpinWheelSidebar } from "./sideBar";
import { SpinWheelTopText } from "./topText";

interface SpinWheelMappedProps {
	spinWheel: SpinWheelState;
}

interface SpinWheelProps extends SpinWheelMappedProps {
	visible: boolean;
	hideMenu: () => void;
}

/**
 *
 * @param state The current state of the store.
 * @returns Mapped props.
 */
function mapStateToProps(state: StoreState): SpinWheelMappedProps {
	return {
		spinWheel: state.spinWheel,
	};
}

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
			image: getCurrencyIcon(rewardInfo.rewardData.name),
			amount: rewardInfo.rewardData.amount ?? 1,
		};
	} else if (rewardInfo.rewardType === "boosts") {
		slotsData[index] = { image: assetIds.images.vectors.Clover, amount: rewardInfo.rewardData.boostAmount ?? 1 };
	} else if (rewardInfo.rewardType === "pet" && rewardInfo.rewardData.petId !== undefined) {
		slotsData[index] = {
			image: getPetImage(rewardInfo.rewardData.petId, "regular"),
			amount: rewardInfo.rewardData.amount ?? 1,
		};
	}
}

export const SpinWheel = RoactRodux.connect(mapStateToProps)(
	hooks((props: SpinWheelProps, hooks) => {
		const { useContext, useEffect, useState } = hooks;
		const { spinWheel, spinWheelInfo } = useContext(remoteContext);
		const [rewardFrameVisibility, updateRewardFrameVisibility] = useState<boolean>(false);
		const [displayedInfo, updateDisplayedInfo] = useState<{
			image: string;
			amount: number;
		}>({
			image: "",
			amount: 0,
		});

		if (!props.visible) {
			return <></>;
		}

		const defaultButtonScale = 1;
		const updatedButtonScale = 0.9;
		const buttonSize = UDim2.fromScale(0.22, 0.22);

		const defaultButtonSpring = new Flipper.Spring(defaultButtonScale);
		const updatedButtonSpring = new Flipper.Spring(updatedButtonScale);

		const wheelSpin = useBindingMotor(hooks, 0);
		const spinButton = useBindingMotor(hooks, defaultButtonScale);

		const slots: Array<Roact.Element> = [];
		let isSpinning = false;

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
		 *@param reward The index of the reward the player received.
		 */
		function rotateWheel(reward: number): void {
			if (isSpinning === true) {
				return;
			}
			isSpinning = true;

			const rewardRot = slotPositions[reward].rot ?? 0;
			const randomRotAdded = new Random().NextInteger(-10, 10);
			const wheelRotateGoal = new Flipper.Spring(-rewardRot - 360 * 5 + randomRotAdded, {
				frequency: 3,
				dampingRatio: 2,
			});

			wheelSpin.motor.setGoal(wheelRotateGoal);
		}

		useEffect(() => {
			const connection = wheelSpin.motor.onComplete(() => {
				if (wheelSpin.motor.getValue() >= 0) {
					return;
				}

				wheelSpin.motor.setGoal(new Flipper.Instant(0));
				isSpinning = false;

				if (rewardFrameVisibility === false && isSpinning === false) {
					updateRewardFrameVisibility(true);
				}
			});

			return (): void => connection.disconnect();
		}, []);

		useEffect(() => {
			spinWheelInfo.SendToServer();
		});

		return (
			<frame
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
			>
				<SpinRewardFrame
					rewardData={{ image: displayedInfo.image, amount: displayedInfo.amount }}
					closed={(): void => updateRewardFrameVisibility(false)}
					visible={rewardFrameVisibility}
				/>
				<SpinWheelSidebar
					spinsDone={props.spinWheel.spinsDone}
					startTime={props.spinWheel.startTime}
					endTime={props.spinWheel.endTime}
					visible={rewardFrameVisibility !== true}
				/>
				<uiaspectratioconstraint AspectRatio={2.03} />
				<imagelabel
					Size={UDim2.fromScale(0.37, 0.695)}
					Position={UDim2.fromScale(0.5, 0.5)}
					AnchorPoint={vec2Middle}
					ScaleType={Enum.ScaleType.Fit}
					Image={assetIds.images.ui.codes.background}
					BackgroundTransparency={1}
					Visible={rewardFrameVisibility !== true}
				>
					<ExitButton
						minimizedSize={0.1}
						maximizedSize={0.12}
						onClosed={(): void => props.hideMenu()}
						Position={UDim2.fromScale(0.98, 0.08)}
					/>
					<SpinWheelTopText
						startTime={props.spinWheel.startTime}
						endTime={props.spinWheel.endTime}
						spins={props.spinWheel.spinsDone}
						dayEndTime={props.spinWheel.dayEndTime}
					/>
					<uiaspectratioconstraint AspectRatio={1.08} />
					<textlabel
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.06)}
						Size={UDim2.fromScale(0.375, 0.1)}
						BackgroundTransparency={1}
						TextScaled={true}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Text={"Spin Wheel"}
						Font={font}
					>
						<BaseUIStroke native={{ Thickness: 2, Color: Color3.fromRGB(148, 94, 15) }} />
					</textlabel>
					<frame
						Key={"SPIN WHEEL"}
						AnchorPoint={vec2Middle}
						Position={UDim2.fromScale(0.5, 0.6)}
						Size={UDim2.fromScale(0.65, 0.68)}
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
							Size={spinButton.binding.map((value) => {
								return UDim2.fromScale(buttonSize.X.Scale * value, buttonSize.Y.Scale * value);
							})}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={vec2Middle}
							BackgroundColor3={Color3.fromRGB(52, 190, 255)}
							AutoButtonColor={false}
							TextTransparency={1}
							Event={{
								/* eslint-disable jsdoc/require-jsdoc */
								MouseLeave: (): void => spinButton.motor.setGoal(defaultButtonSpring),
								MouseEnter: (): void => spinButton.motor.setGoal(updatedButtonSpring),
								Activated: (): void => {
									if (isSpinning === true) {
										return;
									}

									spinWheel
										.CallServerAsync()
										.andThen((rewardData) => {
											if (isSpinning) {
												return;
											}

											if (rewardData.reward === undefined) {
												return;
											}

											rotateWheel(rewardData.reward);
											updateDisplayedInfo({
												image: slotsData[rewardData.reward].image,
												amount: slotsData[rewardData.reward].amount,
											});
										})
										.catch(warn);
								},
								/* eslint-enable jsdoc/require-jsdoc */
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
							<BaseUIStroke
								native={{
									Thickness: 4,
									Color: Color3.fromRGB(11, 52, 68),
									ApplyStrokeMode: Enum.ApplyStrokeMode.Border,
								}}
							/>
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
								<BaseUIStroke
									native={{
										Thickness: 4,
										Color: Color3.fromRGB(11, 52, 68),
									}}
								/>
							</textlabel>
						</textbutton>
					</frame>
				</imagelabel>
			</frame>
		);
	}),
);
