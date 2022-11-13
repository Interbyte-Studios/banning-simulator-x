import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { font, vec2Middle } from "client/ui/commonValues";
import { AnnouncementContext } from "client/ui/context/AnnouncementsAPI";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseUIStroke";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import assetIds from "shared/assets";
import { RedeemCodeFailKind } from "shared/remotes/media/redeemCode";

const maximizedSize = 0.1;
const minimizedSize = 0.075;

/* eslint-disable jsdoc/require-jsdoc */
export const TwitterHandle = hooks((_, hooks) => {
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const { motor, binding } = useBindingMotor(hooks, maximizedSize);

	const { useValue, useContext } = hooks;
	const { redeemCode } = useContext(remoteContext);
	const { addError } = useContext(AnnouncementContext);

	const textBoxRef = useValue(Roact.createRef<TextBox>());

	return (
		<>
			<imagelabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.375, 0.45)}
				Size={UDim2.fromScale(0.65, 0.125)}
				Image={assetIds.images.ui.codes.input}
				ScaleType={Enum.ScaleType.Fit}
			>
				<textbox
					AnchorPoint={vec2Middle}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.95, 0.5)}
					PlaceholderText={"Input Twitter Code"}
					PlaceholderColor3={Color3.fromRGB(255, 255, 255)}
					Text={""}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Font={font}
					TextScaled={true}
					Ref={textBoxRef.value}
				>
					<BaseUIStroke Thickness={1.2} />
				</textbox>
			</imagelabel>
			<imagebutton
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.84, 0.45)}
				Size={binding.map((value) => {
					return UDim2.fromScale(0.25, value);
				})}
				Image={assetIds.images.buttons["long green button"]}
				ScaleType={Enum.ScaleType.Fit}
				Event={{
					Activated: async (): Promise<void> => {
						const textBox = textBoxRef.value.getValue();
						if (textBox === undefined) {
							addError("Please input your handle to verify.");
							return;
						}

						const codeRedeemed = await redeemCode.CallServerAsync(textBox.Text);
						if (codeRedeemed.success) {
							addError(`You've redeemed the code "${textBox.Text}."`);
							return;
						} else {
							switch (codeRedeemed.reason) {
								case RedeemCodeFailKind.AlreadyRedeemed: {
									addError("You have already redeemed that code.");
									return;
								}
								case RedeemCodeFailKind.InvalidCode: {
									addError(`The code you entered "${textBox.Text}" is invalid.`);
									return;
								}
							}
						}
					},
					MouseEnter: (): void => motor.setGoal(minimizedSpring),
					MouseLeave: (): void => motor.setGoal(maximizedSpring),
				}}
			>
				<textlabel
					AnchorPoint={vec2Middle}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.8, 0.6)}
					BackgroundTransparency={1}
					TextScaled={true}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Text={"Redeem"}
					Font={font}
				>
					<BaseUIStroke Thickness={1.2} />
				</textlabel>
			</imagebutton>
		</>
	);
});
/* eslint-enable jsdoc/require-jsdoc */
