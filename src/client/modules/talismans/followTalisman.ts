import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { getItemById } from "shared/util/getItemById";
import { getTalismanData } from "shared/util/getTalismanData";
import { setAssetProperties } from "shared/util/setAssetProperties";

const talismansFolder = ReplicatedStorage.assetObjects.talismans;

/**.
 * Equips a talisman to the player that follows them.
 *
 * @param player The lcoal player.
 * @param talismanId The id of the talisman thats being equipped.
 */
export function talismanEquipped(player: Player, talismanId: number): void {
	const talismanData = getTalismanData(talismanId);
	const talismanModel = getItemById(talismansFolder, talismanId);

	if (Workspace.interactions.FindFirstChild("talismans")?.FindFirstChild(player.Name)) {
		Workspace.interactions.FindFirstChild("talismans")?.FindFirstChild(player.Name)?.Destroy();
	}

	const talisman = talismanModel?.Clone() as Model;
	assert(talisman, `Could not get model for talisman of Id${talismanId} of name ${talismanData.name}`);
	setAssetProperties("talisman", talisman);

	const character = player.Character;
	const humanoidRootPart = character?.PrimaryPart as BasePart;

	const bodyPosition = new Instance("BodyPosition", talisman.PrimaryPart);
	const bodyGyro = new Instance("BodyGyro", talisman.PrimaryPart);

	bodyPosition.MaxForce = new Vector3(4000000, 4000000, 4000000);
	bodyPosition.P = 20000;
	bodyGyro.MaxTorque = new Vector3(400000, 400000, 400000);

	talisman.Name = player.Name;
	talisman.Parent = Workspace.interactions.FindFirstChild("talismans");

	RunService.RenderStepped.Connect(() => {
		const hover = math.cos(tick() * 3) * 1;
		if (humanoidRootPart) {
			bodyPosition.Position = humanoidRootPart.CFrame.mul(new CFrame(2, hover, 3)).Position;
			bodyGyro.CFrame = humanoidRootPart.CFrame;
		}
	});
}
