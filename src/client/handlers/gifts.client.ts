import { Players, TweenService } from "@rbxts/services";
import assetIds from "shared/assets";
import { remotes } from "shared/remotes";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");
const gifts = playerGui.WaitForChild("Gifts");
const giftTemplate = gifts.WaitForChild("template");

remotes.Client.Get("gamepassGiftReceived").Connect((gamepassName, playerWhoGifted) => {
	warn(`Received gift`);
	const giftMessage = giftTemplate.Clone() as ImageLabel;
	const closeGift = giftMessage.WaitForChild("close") as ImageButton;
	const gamepassImage = giftMessage.WaitForChild("gamepassImage") as ImageLabel;
	const message = giftMessage.WaitForChild("message") as TextLabel;

	const gamepass = assetIds.images.decals.gamepasses[gamepassName];
	gamepassImage.Image = gamepass;

	message.Text = `Congratulations! ${playerWhoGifted.Name} has gifted you the ${gamepassName} gamepass!`;
	giftMessage.Parent = gifts;
	giftMessage.Visible = true;

	const originalSize = closeGift.Size;
	const tweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
	const enterConnection = closeGift.MouseEnter.Connect(() =>
		TweenService.Create(closeGift, tweenInfo, {
			Size: UDim2.fromScale(originalSize.X.Scale - 0.1, originalSize.Y.Scale - 0.1),
		}).Play(),
	);
	const leftConnection = closeGift.MouseEnter.Connect(() =>
		TweenService.Create(closeGift, tweenInfo, {
			Size: originalSize,
		}).Play(),
	);
	const clickConnection = closeGift.MouseButton1Click.Connect(() => {
		giftMessage.Destroy();
		enterConnection.Disconnect();
		leftConnection.Disconnect();
		clickConnection.Disconnect();
	});
});
