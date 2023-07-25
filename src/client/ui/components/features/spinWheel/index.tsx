import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { MarketplaceService, Players, RunService } from "@rbxts/services";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseFrame } from "client/ui/elements/baseElements/baseFrame";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { SpringImageButton } from "client/ui/elements/baseElements/imagebuttons/springImage";
import { ImageLabel } from "client/ui/elements/baseElements/imagelabels/image";
import { StrokeTextLabel } from "client/ui/elements/baseElements/textlabels/strokeTextLabel";
import { ExitButton } from "client/ui/elements/common/exitButton";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { formatTime } from "client/util/formatTime";
import { getCurrencyIcon } from "client/util/getCurrencyIcon";
import { getPetImage } from "client/util/getPetImage";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { BOOST_IMAGES, ONE_HUNDRED_SPINS, TEN_SPINS } from "shared/configs/game";
import { spinRewards } from "shared/configs/spinWheel";
import { StoreState } from "shared/rodux";
import { SpinWheelState } from "shared/rodux/spinWheel";

import { SpinRewardFrame } from "./rewardFrame";
import { RewardSlot } from "./rewardSlot";

interface SpinWheelMappedProps {
	spinWheel: SpinWheelState;
}

interface SpinWheelProps extends SpinWheelMappedProps {
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

const slotsData: Record<number, { image: string; amount: number; rewardType: "boost" | "currency" | "pet" }> = [];

for (const [index, rewardInfo] of pairs(spinRewards)) {
	if (rewardInfo.rewardType === "currency" && rewardInfo.rewardData.name !== undefined) {
		slotsData[index] = {
			image: getCurrencyIcon(rewardInfo.rewardData.name),
			amount: rewardInfo.rewardData.amount ?? 1,
			rewardType: "currency",
		};
	} else if (rewardInfo.rewardType === "boosts") {
		if (rewardInfo.rewardData.boostName === undefined) {
			throw `Boost name is undefined for reward ${index}!`;
		}

		if (rewardInfo.rewardData.boostAmount === undefined) {
			throw `Boost amount is undefined for reward ${index}!`;
		}

		slotsData[index] = {
			image: BOOST_IMAGES[rewardInfo.rewardData.boostName][rewardInfo.rewardData.boostAmount],
			amount: rewardInfo.rewardData.boostAmount ?? 1,
			rewardType: "boost",
		};
	} else if (rewardInfo.rewardType === "pet" && rewardInfo.rewardData.petId !== undefined) {
		slotsData[index] = {
			image: getPetImage(rewardInfo.rewardData.petId, "regular"),
			amount: rewardInfo.rewardData.amount ?? 1,
			rewardType: "pet",
		};
	}
}

/**
 * The spin wheel component.
 */
export const SpinWheel = RoactRodux.connect(mapStateToProps)(
	hooks((props: SpinWheelProps, hooks) => {
		const { useContext, useEffect, useState, useValue } = hooks;
		const { spinWheel } = useContext(remoteContext);
		const [rewardFrameVisibility, updateRewardFrameVisibility] = useState<boolean>(false);
		const [timeLeft, setTimeLeft] = useState(0);
		const [displayedInfo, updateDisplayedInfo] = useState<{
			rewardType: "boost" | "currency" | "pet";
			image: string;
			amount: number;
		}>({
			rewardType: "boost",
			image: "",
			amount: 0,
		});

		const defaultButtonScale = 1;
		const updatedButtonScale = 0.9;
		const buttonSize = UDim2.fromScale(0.22, 0.22);

		const defaultButtonSpring = new Flipper.Spring(defaultButtonScale);
		const updatedButtonSpring = new Flipper.Spring(updatedButtonScale);

		const wheelSpin = useBindingMotor(hooks, 0);
		const spinButton = useBindingMotor(hooks, defaultButtonScale);

		const slots: Array<Roact.Element> = [];
		const isSpinning = useValue(false);

		for (const [index, rewardData] of pairs(slotsData)) {
			slots.push(
				<RewardSlot
					rewardType={rewardData.rewardType}
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
			if (isSpinning.value === true) {
				return;
			}
			isSpinning.value = true;

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
				isSpinning.value = false;

				if (rewardFrameVisibility === false && isSpinning.value === false) {
					updateRewardFrameVisibility(true);
				}
			});

			return (): void => connection.disconnect();
		}, []);

		useEffect(() => {
			const connection = RunService.RenderStepped.Connect(() => {
				const now = DateTime.now().UnixTimestamp;
				if (now >= props.spinWheel.lastSpinTime + 86400) {
					setTimeLeft(0);
					return;
				}

				setTimeLeft(math.ceil(props.spinWheel.lastSpinTime + 86400 - now));
				task.wait(1);
			});

			return (): void => connection.Disconnect();
		}, [timeLeft, props.spinWheel.lastSpinTime]);

		return (
			<>
				<ExitButton
					minimizedSize={0.08}
					maximizedSize={0.09}
					onClosed={(): void => props.hideMenu()}
					Position={UDim2.fromScale(0.675, 0.1)}
				/>
				<SpinRewardFrame
					rewardType={displayedInfo.rewardType}
					rewardData={{ image: displayedInfo.image, amount: displayedInfo.amount }}
					closed={(): void => updateRewardFrameVisibility(false)}
					visible={rewardFrameVisibility}
				/>
				<BaseFrame Position={UDim2.fromScale(0.5, 0.4)} Size={UDim2.fromScale(0.65, 0.68)}>
					<uiaspectratioconstraint AspectRatio={1} />
					<ImageLabel native={{ Image: "rbxassetid://11751284496" }}>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
					<ImageLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.9),
							Image: "rbxassetid://11751293075",
							Rotation: wheelSpin.binding.map((value) => value),
						}}
					>
						{slots}
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
					<ImageLabel
						native={{
							AnchorPoint: Vector2.one.mul(0.5),
							Position: UDim2.fromScale(0.5, 0.06),
							Size: UDim2.fromScale(0.2, 0.2),
							Image: "rbxassetid://11752302246",
						}}
					/>
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
								if (isSpinning.value) {
									return;
								}

								spinWheel
									.CallServerAsync()
									.andThen((rewardData) => {
										if (rewardData.reward === undefined) {
											return;
										}

										rotateWheel(rewardData.reward);
										updateDisplayedInfo({
											rewardType: slotsData[rewardData.reward].rewardType,
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
				</BaseFrame>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.5, 0.825),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.1, maxSize: 0.125 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							if (isSpinning.value) {
								return;
							}

							spinWheel
								.CallServerAsync()
								.andThen((rewardData) => {
									if (rewardData.reward === undefined) {
										return;
									}

									rotateWheel(rewardData.reward);
									updateDisplayedInfo({
										rewardType: slotsData[rewardData.reward].rewardType,
										image: slotsData[rewardData.reward].image,
										amount: slotsData[rewardData.reward].amount,
									});
								})
								.catch(warn);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.8, 0.8),
							Text: "SPIN",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(17, 150, 55) } }}
					/>
				</SpringImageButton>
				<StrokeTextLabel
					native={{
						Position: UDim2.fromScale(0.5, 0.91),
						Size: UDim2.fromScale(0.125, 0.05),
						Text: `${props.spinWheel.spinsAvailable} Spins Left`,
					}}
					stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(17, 150, 55) } }}
				/>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.35, 0.825),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.07, maxSize: 0.1 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, TEN_SPINS);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.8),
							Text: "+1 Spin",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(17, 150, 55) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.675, 1),
							Size: UDim2.fromScale(0.45, 0.45),
							Text: "R$49",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(99, 52, 16) } }}
					/>
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.275, 1),
							Size: UDim2.fromScale(0.5, 0.5),
							Image: assetIds.images.vectors.Robux,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
				</SpringImageButton>
				<SpringImageButton
					native={{
						Position: UDim2.fromScale(0.65, 0.825),
						Image: assetIds.images.ui.index.Claim,
					}}
					size={{ minSize: 0.07, maxSize: 0.1 }}
					events={{
						/**
						 *
						 */
						Activated: (): void => {
							playSFX(UIEngagement.MajorEngagement);
							MarketplaceService.PromptProductPurchase(Players.LocalPlayer, ONE_HUNDRED_SPINS);
						},
					}}
				>
					<uiaspectratioconstraint AspectRatio={2} />
					<StrokeTextLabel
						native={{
							Size: UDim2.fromScale(0.9, 0.8),
							Text: "+10 Spins",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(17, 150, 55) } }}
					/>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.675, 1),
							Size: UDim2.fromScale(0.45, 0.45),
							Text: "R$239",
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(99, 52, 16) } }}
					/>
					<ImageLabel
						native={{
							Position: UDim2.fromScale(0.275, 1),
							Size: UDim2.fromScale(0.5, 0.5),
							Image: assetIds.images.vectors.Robux,
						}}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</ImageLabel>
					<StrokeTextLabel
						native={{
							Position: UDim2.fromScale(0.5, 0.76),
							Size: UDim2.fromScale(0.15, 0.04),
							Text: `${formatTime(timeLeft)}`,
							Visible: timeLeft > 0,
						}}
						stroke={{ native: { Thickness: 2, Color: Color3.fromRGB(99, 52, 16) } }}
					/>
				</SpringImageButton>
			</>
		);
	}),
);
