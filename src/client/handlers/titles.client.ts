import { Players, RunService } from "@rbxts/services";
import { TITLES } from "shared/configs/titles";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const chat = playerGui.WaitForChild("Chat");
const chatChannelParentFrame = chat.FindFirstChild("Frame")?.FindFirstChild("ChatChannelParentFrame");
const chatScroll = chatChannelParentFrame?.FindFirstChild("Frame_MessageLogDisplay")?.FindFirstChild("Scroller");

const gradients: Array<UIGradient> = [];
chatScroll?.ChildAdded.Connect((chatObject) => {
	if (!chatObject.IsA("Frame")) {
		return;
	}

	const messageObject = chatObject.FindFirstChildOfClass("TextLabel");
	if (messageObject === undefined) {
		return;
	}

	const messageTitle = messageObject.FindFirstChildOfClass("TextLabel");
	if (messageTitle === undefined) {
		return;
	}

	const titleContent = messageTitle.Text.split("[")[1].split("]")[0];
	const titleData = TITLES.find((_title) => _title.name === titleContent);
	assert(titleData, `Failed to get data for title named: "${titleContent}".`);

	if (typeIs(titleData.effect, "Color3")) {
		return;
	}

	const titleGradient = new Instance("UIGradient");
	titleGradient.Color = titleData.effect;
	titleGradient.Offset = new Vector2(-0.75, 0);
	titleGradient.Parent = messageTitle;
	gradients.push(titleGradient);

	const connection = titleGradient.Destroying.Connect(() => {
		gradients.forEach((gradient, index) => {
			if (gradient === titleGradient) {
				gradients.unorderedRemove(index);
				return;
			}
		});

		connection.Disconnect();
	});
});

RunService.RenderStepped.Connect((deltaTime) => {
	gradients.forEach((gradient) => {
		if (gradient.Offset.X < 0.75) {
			gradient.Offset = new Vector2(gradient.Offset.X + 0.5 * deltaTime, 0);
		} else {
			gradient.Offset = new Vector2(-0.75, 0);
		}

		gradient.Rotation = 40;
	});
});
