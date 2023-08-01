debug.setmemorycategory("disableHatching");
import { Players, TweenService } from "@rbxts/services";
import { disableHatch } from "client/ui/components/eggs/control";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");
const hatchUI = playerGui.WaitForChild("Hatch");
const stopButton = hatchUI.WaitForChild("Stop") as ImageButton;

stopButton.Activated.Connect((): void => disableHatch());

const buttonSize = stopButton.Size;
stopButton.MouseEnter.Connect(() => {
	const tweenInfo = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
	const tween = TweenService.Create(stopButton, tweenInfo, {
		Size: UDim2.fromScale(buttonSize.Y.Scale * 0.8, buttonSize.Y.Scale * 0.8),
	});
	tween.Play();
});
stopButton.MouseLeave.Connect(() => {
	const tweenInfo = new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
	const tween = TweenService.Create(stopButton, tweenInfo, {
		Size: buttonSize,
	});
	tween.Play();
});
