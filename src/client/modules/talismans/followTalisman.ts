import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { getItemById } from "shared/util/getItemById";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

const talismansFolder = ReplicatedStorage.assetObjects.talismans;

/**.
 * Equips a talisman to the player that follows them.
 *
 * @param player The local player.
 * @param talismanId The id of the talisman thats being equipped.
 */
export function equipTalisman(player: Player, talismanId: number): void {
	const talismanData = getTalismanData(talismanId);
	const talismanModel = getItemById(talismansFolder, talismanId);

	const talisman = talismanModel?.Clone() as Model;
	assert(talisman, `Could not get model for talisman of Id${talismanId} of name ${talismanData.name}`);
	setAssetProperties("Talisman", talisman);

	const character = player.Character ?? player.CharacterAdded.Wait()[0];
	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	const humanoidRootPart = humanoid.RootPart;

	const talismanAttachment = new Instance("Attachment", talisman.PrimaryPart);

	const alignPosition = new Instance("AlignPosition", talisman.PrimaryPart);
	alignPosition.Mode = Enum.PositionAlignmentMode.OneAttachment;
	alignPosition.MaxForce = 50000;
	alignPosition.Attachment0 = talismanAttachment;
	alignPosition.Responsiveness = 50;

	const alignOrientation = new Instance("AlignOrientation", talisman.PrimaryPart);
	alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	alignOrientation.Attachment0 = talismanAttachment;
	alignOrientation.Responsiveness = 80;

	if (Workspace.interactions.talismans.FindFirstChild(player.Name)) {
		Workspace.interactions.talismans.FindFirstChild(player.Name)?.Destroy();
	}

	talisman.Name = player.Name;
	talisman.Parent = Workspace.interactions.FindFirstChild("talismans");

	const talismanRender = RunService.RenderStepped.Connect(() => {
		if (humanoidRootPart) {
			const hover = math.cos(os.clock() * 3) * 1;

			alignPosition.Position = humanoidRootPart.CFrame.mul(new CFrame(2, hover, 3)).Position;
			alignOrientation.CFrame = humanoidRootPart.CFrame;
		}
	});

	humanoid.Died.Connect(() => {
		talismanRender.Disconnect();
		Workspace.interactions.talismans.FindFirstChild(player.Name)?.Destroy();
	});
}
