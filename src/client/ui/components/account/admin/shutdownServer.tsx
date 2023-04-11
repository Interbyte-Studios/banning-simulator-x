import Flipper from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { CollectionService } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { font, vec2Middle } from "client/ui/commonValues";
import { useBindingMotor } from "client/ui/customHooks/useBindingMotor";
import { BaseUIStroke } from "client/ui/elements/baseElements/baseUIStroke";
import { CurrencyIcon } from "client/ui/elements/icons/currencyIcon";
import { RescalingScrollingFrame } from "client/ui/elements/common/rescalingScrollingFrame";
import { hooks } from "client/ui/hooks";
import { remoteContext } from "client/ui/mocks/remoteContext";
import { playSFX, UIEngagement } from "client/util/playSound";
import assetIds from "shared/assets";
import { currencies } from "shared/configs/currencies";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { FullComponentHeader } from "../util/fullComponentHeader";

/* eslint-disable jsdoc/require-jsdoc */
export const ShutdownServer = hooks((props: { setActiveAction: () => void }, hooks) => {
	const { useContext } = hooks;

	const { admin_ShutdownServer } = useContext(remoteContext);

	const minimizedSize = 0.115;
	const minimizedSpring = new Flipper.Spring(minimizedSize, { frequency: 5 });

	const maximizedSize = 0.15;
	const maximizedSpring = new Flipper.Spring(maximizedSize, { frequency: 5 });

	const continueMotor = useBindingMotor(hooks, maximizedSize);
	const retractMotor = useBindingMotor(hooks, maximizedSize);

	return (
		<>
			<FullComponentHeader
				storeFound={true}
				headerText={`Shutdown this server?`}
				returnToSelection={(): void => props.setActiveAction()}
				displayReturn={true}
			/>
			<textlabel
				AnchorPoint={vec2Middle}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 0.2)}
				Font={font}
				Text={`Are you sure you want to shut down this server?`}
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
						props.setActiveAction();
						admin_ShutdownServer.SendToServer();
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
						props.setActiveAction();
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
});
